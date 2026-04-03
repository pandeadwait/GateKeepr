from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass

from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.models.booking import Booking
from backend.models.room import Room
from backend.models.user import User
from backend.schemas.booking import BookingCreate
from backend.services.exceptions import InvalidInputError, NoRoomsAvailableError, NotFoundError


@dataclass(frozen=True)
class AllocationRule:
    field_name: str
    descending: bool = False


DEFAULT_ALLOCATION_RULES: tuple[AllocationRule, ...] = (
    AllocationRule(field_name="floor_number"),
    AllocationRule(field_name="block"),
    AllocationRule(field_name="room_number"),
)


def allocate_room(
    db: Session,
    payload: BookingCreate,
    priority_rules: Sequence[AllocationRule] | None = None,
) -> Booking:
    _validate_booking_input(payload)
    _ensure_user_exists(db, payload.user_id)

    candidate_rooms = _find_available_rooms(
        db=db,
        requested_room_id=payload.room_id,
        priority_rules=priority_rules or DEFAULT_ALLOCATION_RULES,
    )
    if not candidate_rooms:
        raise NoRoomsAvailableError("No rooms are currently available for allocation.")

    room = candidate_rooms[0]

    booking = Booking(
        user_id=payload.user_id,
        room_id=room.id,
        status=payload.status,
        check_in_date=payload.check_in_date,
        check_out_date=payload.check_out_date,
    )
    db.add(booking)
    db.flush()

    # TODO: this still allows a narrow race window under concurrent booking requests.
    # A later pass should wrap selection + insert in stricter transactional handling.
    occupancy_after_allocation = _count_active_bookings(db, room.id)
    room.status = _resolve_room_status(
        occupancy=occupancy_after_allocation,
        capacity=room.capacity,
    )

    # TODO: replace this simple sort strategy with configurable weighted scoring.
    # TODO: support richer preference inputs such as room type, accessibility, and date ranges.
    db.commit()
    db.refresh(booking)
    db.refresh(room)
    return booking


def _validate_booking_input(payload: BookingCreate) -> None:
    if payload is None:
        raise InvalidInputError("Booking payload is required.")
    if payload.user_id is None:
        raise InvalidInputError("user_id is required.")
    if payload.room_id is None:
        raise InvalidInputError("room_id is required.")
    if not payload.status or not payload.status.strip():
        raise InvalidInputError("status is required.")
    if payload.check_in_date is None:
        raise InvalidInputError("check_in_date is required.")
    # TODO: intentionally not validating check_out_date ordering yet.


def _ensure_user_exists(db: Session, user_id: int) -> None:
    user = db.get(User, user_id)
    if user is None:
        raise NotFoundError(f"User with id {user_id} was not found.")


def _find_available_rooms(
    db: Session,
    requested_room_id: int,
    priority_rules: Sequence[AllocationRule],
) -> list[Room]:
    query = db.query(Room)

    if requested_room_id is not None:
        room = db.get(Room, requested_room_id)
        if room is None:
            raise NotFoundError("Room not found.")
        query = query.filter(Room.id == requested_room_id)

    rooms = query.all()
    available_rooms = [room for room in rooms if _is_room_available(db, room)]

    return sorted(
        available_rooms,
        key=lambda room: _build_sort_key(room, priority_rules),
    )


def _is_room_available(db: Session, room: Room) -> bool:
    if room.status.lower() not in {"available", "partially_booked"}:
        return False
    return _count_active_bookings(db, room.id) < room.capacity


def _count_active_bookings(db: Session, room_id: int) -> int:
    booking_count = (
        db.query(func.count(Booking.id))
        .filter(Booking.room_id == room_id, Booking.status == "active")
        .scalar()
    )
    return int(booking_count or 0)


def _build_sort_key(room: Room, priority_rules: Sequence[AllocationRule]) -> tuple[object, ...]:
    key_parts: list[object] = []
    for rule in priority_rules:
        value = getattr(room, rule.field_name)
        if rule.descending and isinstance(value, (int, float)):
            key_parts.append(-value)
        elif rule.descending:
            key_parts.append((0, value))
        else:
            key_parts.append(value)
    return tuple(key_parts)


def _resolve_room_status(occupancy: int, capacity: int) -> str:
    if occupancy <= 0:
        return "available"
    if occupancy >= capacity:
        return "occupied"
    return "partially_booked"
