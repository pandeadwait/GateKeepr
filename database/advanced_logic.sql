-- ==============================================================================
-- SMART HOSTEL COMMAND CENTER - ADVANCED ORACLE LOGIC
-- Execution: SQL*Plus (Constraints, Dashboard Views, Business Procedures)
-- ==============================================================================

-- ==============================================================================
-- 1. DATA VALIDATION CONSTRAINTS
-- ==============================================================================

-- Enforce bounded statuses and valid data states across tables
ALTER TABLE rooms ADD CONSTRAINT chk_rooms_status CHECK (status IN ('AVAILABLE', 'FULLY_OCCUPIED', 'PARTIALLY_OCCUPIED', 'MAINTENANCE'));
ALTER TABLE rooms ADD CONSTRAINT chk_rooms_capacity CHECK (capacity > 0);

ALTER TABLE maintenance_tickets ADD CONSTRAINT chk_tickets_status CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED'));
ALTER TABLE leave_requests ADD CONSTRAINT chk_leave_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));
ALTER TABLE leave_requests ADD CONSTRAINT chk_leave_dates CHECK (end_date >= start_date);
ALTER TABLE allocations ADD CONSTRAINT chk_allocations_status CHECK (status IN ('ACTIVE', 'PAST'));
ALTER TABLE announcements ADD CONSTRAINT chk_announcements_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'));

-- ==============================================================================
-- 2. DASHBOARD FRONTEND VIEWS
-- ==============================================================================

-- Core PVR visual layer: Flattens room coordinates against LIVE occupancy and warnings.
CREATE OR REPLACE VIEW vw_admin_pvr_grid AS
SELECT 
    r.id AS room_id,
    r.room_number,
    r.floor_number,
    r.block,
    r.capacity,
    r.room_type,
    r.status AS room_status,
    (SELECT COUNT(*) FROM allocations a WHERE a.room_id = r.id AND a.status = 'ACTIVE') AS current_occupants,
    (SELECT COUNT(*) FROM maintenance_tickets mt WHERE mt.room_id = r.id AND mt.status IN ('OPEN', 'IN_PROGRESS')) AS active_warning_tickets
FROM rooms r;

-- Student personal portal API layer: Hides sensitive user info from global scope.
CREATE OR REPLACE VIEW vw_student_portal AS
SELECT 
    u.id AS student_id,
    u.full_name,
    u.email,
    r.room_number,
    r.floor_number,
    r.block,
    a.allocated_date
FROM users u
LEFT JOIN allocations a ON u.id = a.user_id AND a.status = 'ACTIVE'
LEFT JOIN rooms r ON a.room_id = r.id
WHERE u.user_role = 'STUDENT';

-- Consolidated Live Activity Side panel
CREATE OR REPLACE VIEW vw_activity_feed AS
SELECT 
    id, user_id, 'OPERATIONAL' AS log_category, action_type, description, log_timestamp AS created_time
FROM activity_logs
UNION ALL
SELECT 
    id, user_id, 'AUDIT SECURITY' AS log_category, action_type, 'Table Target: ' || table_affected, created_at AS created_time
FROM audit_logs
ORDER BY created_time DESC;

-- ==============================================================================
-- 3. BUSINESS LOGIC STORED PROCEDURES (Transactional Blackboxes)
-- ==============================================================================

-- A. SAFELY ALLOCATE STUDENT (Avoids capacity overallocation)
CREATE OR REPLACE PROCEDURE sp_allocate_student (
    p_user_id IN NUMBER,
    p_room_id IN NUMBER,
    p_out_status OUT VARCHAR2
) AS
    v_current_occupants NUMBER;
    v_room_capacity NUMBER;
    v_already_allocated NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_already_allocated FROM allocations WHERE user_id = p_user_id AND status = 'ACTIVE';
    IF v_already_allocated > 0 THEN
        p_out_status := 'ERROR: User is already actively assigned to a room.';
        RETURN;
    END IF;

    SELECT capacity INTO v_room_capacity FROM rooms WHERE id = p_room_id;
    SELECT COUNT(*) INTO v_current_occupants FROM allocations WHERE room_id = p_room_id AND status = 'ACTIVE';
    
    IF v_current_occupants >= v_room_capacity THEN
        p_out_status := 'ERROR: Target Room is at full capacity!';
        RETURN;
    END IF;

    -- If checks pass, execute Allocation
    INSERT INTO allocations (user_id, room_id, allocated_date, status) VALUES (p_user_id, p_room_id, SYSDATE, 'ACTIVE');
    
    IF v_current_occupants + 1 = v_room_capacity THEN
        UPDATE rooms SET status = 'FULLY_OCCUPIED' WHERE id = p_room_id;
    ELSE
        UPDATE rooms SET status = 'PARTIALLY_OCCUPIED' WHERE id = p_room_id;
    END IF;

    INSERT INTO activity_logs (user_id, action_type, description) VALUES (p_user_id, 'ROOM_ALLOCATION', 'User allocated to room ID ' || p_room_id);

    COMMIT;
    p_out_status := 'SUCCESS';
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        p_out_status := 'ERROR: Invalid room ID mapping.';
    WHEN OTHERS THEN
        ROLLBACK;
        p_out_status := 'ERROR: ' || SQLERRM;
END;
/

-- B. EVICT / UN-ALLOCATE STUDENT (Frees capacity dynamically)
CREATE OR REPLACE PROCEDURE sp_evict_student (
    p_user_id IN NUMBER,
    p_room_id IN NUMBER,
    p_out_status OUT VARCHAR2
) AS
    v_current_occupants NUMBER;
BEGIN
    UPDATE allocations SET status = 'PAST' WHERE user_id = p_user_id AND room_id = p_room_id AND status = 'ACTIVE';

    SELECT COUNT(*) INTO v_current_occupants FROM allocations WHERE room_id = p_room_id AND status = 'ACTIVE';
    
    IF v_current_occupants = 0 THEN
        UPDATE rooms SET status = 'AVAILABLE' WHERE id = p_room_id;
    ELSE
        UPDATE rooms SET status = 'PARTIALLY_OCCUPIED' WHERE id = p_room_id;
    END IF;

    INSERT INTO activity_logs (user_id, action_type, description) VALUES (p_user_id, 'ROOM_EVICTION', 'User removed from room ID ' || p_room_id);
    
    COMMIT;
    p_out_status := 'SUCCESS';
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_out_status := 'ERROR: ' || SQLERRM;
END;
/

-- C. LODGE MAINTENANCE TICKET (Auto updates room statuses)
CREATE OR REPLACE PROCEDURE sp_lodge_maintenance (
    p_user_id IN NUMBER,
    p_room_id IN NUMBER,
    p_issue_type IN VARCHAR2,
    p_description IN VARCHAR2,
    p_out_status OUT VARCHAR2
) AS
BEGIN
    INSERT INTO maintenance_tickets (room_id, user_id, issue_type, description, status) 
    VALUES (p_room_id, p_user_id, p_issue_type, p_description, 'OPEN');
    
    UPDATE rooms SET status = 'MAINTENANCE' WHERE id = p_room_id;
    
    INSERT INTO activity_logs (user_id, action_type, description) 
    VALUES (p_user_id, 'TICKET_OPENED', 'Maintenance ticket lodged for room ID ' || p_room_id);
    
    COMMIT;
    p_out_status := 'SUCCESS';
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_out_status := 'ERROR: ' || SQLERRM;
END;
/

-- D. PROCESS LEAVE REQUEST (Securely logs in the audit trails)
CREATE OR REPLACE PROCEDURE sp_process_leave (
    p_leave_id IN NUMBER,
    p_warden_id IN NUMBER,
    p_decision IN VARCHAR2, 
    p_out_status OUT VARCHAR2
) AS
BEGIN
    UPDATE leave_requests 
    SET status = p_decision, approved_by = p_warden_id 
    WHERE id = p_leave_id;

    INSERT INTO audit_logs (user_id, action_type, table_affected, record_id)
    VALUES (p_warden_id, 'LEAVE_' || p_decision, 'leave_requests', p_leave_id);

    COMMIT;
    p_out_status := 'SUCCESS: Leave status updated to ' || p_decision;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        p_out_status := 'ERROR: ' || SQLERRM;
END;
/
