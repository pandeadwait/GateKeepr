-- ==============================================================================
-- SMART HOSTEL COMMAND CENTER - ROOM SEED SCRIPT
-- Seeds the layout based on "A Block Hostel Floor 2 & 15" for all 15 floors.
-- Executable in ORACLE SQL*Plus (PL/SQL Block)
-- ==============================================================================

SET DEFINE OFF;

DECLARE
    floor_idx NUMBER;
BEGIN
    -- Loop through Floors 1 to 15
    FOR floor_idx IN 1..15 LOOP

        -- Specially mapped to avoid hitting multiple INSERT statements parsing limitations in Oracle.
        -- We execute sequential INSERT statements natively inside the PL/SQL loop context.

        -- ==============================================
        -- INNER RING AND SPECIAL ROOMS
        -- ==============================================
        
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) 
        VALUES (TO_CHAR(floor_idx) || '00', floor_idx, 'A', 1, 'WARDEN');
        
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) 
        VALUES (TO_CHAR(floor_idx) || '00A', floor_idx, 'A', 1, 'STAFF');

        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '01', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '02', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '03', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '04', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '05', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '06', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '07', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '08', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '09', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '10', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '11', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '12', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '13', floor_idx, 'A', 2, '2AC');

        -- ==============================================
        -- OUTER RING ROOMS
        -- ==============================================
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '14', floor_idx, 'A', 2, '2AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '15', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '16', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '17', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '18', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '19', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '20', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '21', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '22', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '23', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '24', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '25', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '26', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '27', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '28', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '29', floor_idx, 'A', 3, '3NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '30', floor_idx, 'A', 3, '3NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '31', floor_idx, 'A', 3, '3NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '32', floor_idx, 'A', 3, '3NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '33', floor_idx, 'A', 3, '3NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '34', floor_idx, 'A', 3, '3NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '35', floor_idx, 'A', 3, '3NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '36', floor_idx, 'A', 3, '3NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '37', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '38', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '39', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '40', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '41', floor_idx, 'A', 4, '4NAC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '42', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '43', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '44', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '45', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '46', floor_idx, 'A', 4, '4AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '47', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '48', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '49', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '50', floor_idx, 'A', 3, '3AC');
        INSERT INTO rooms (room_number, floor_number, block, capacity, room_type) VALUES (TO_CHAR(floor_idx) || '51', floor_idx, 'A', 3, '3AC');

    END LOOP;
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Successfully seeded 15 floors of rooms.');
END;
/
