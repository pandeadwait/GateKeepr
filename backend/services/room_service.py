from sqlalchemy.orm import Session, selectinload

from backend.models.room import Room
from backend.schemas.room import RoomCreate, RoomRead, RoomStatusUpdate
from backend.services.exceptions import NotFoundError


def list_rooms(db: Session) -> list[RoomRead]:
    rooms = (
        db.query(Room)
        .options(selectinload(Room.bookings))
        .order_by(Room.id.asc())
        .all()
    )

    room_reads: list[RoomRead] = []
    for room in rooms:
        active_bookings = [
            booking for booking in room.bookings if booking.status.lower() == "active"
        ]
        active_booking = active_bookings[0] if active_bookings else None
        room_reads.append(
            RoomRead(
                id=room.id,
                room_number=room.room_number,
                floor_number=room.floor_number,
                block=room.block,
                capacity=room.capacity,
                room_type=room.room_type,
                status=room.status,
                active_booking_id=active_booking.id if active_booking else None,
                active_booking_count=len(active_bookings),
            )
        )

    return room_reads


def create_room(db: Session, payload: RoomCreate) -> Room:
    room = Room(
        room_number=payload.room_number,
        floor_number=payload.floor_number,
        block=payload.block,
        capacity=payload.capacity,
        room_type=payload.room_type,
        status=payload.status,
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


def update_room_status(db: Session, room_id: int, payload: RoomStatusUpdate) -> Room:
    room = db.get(Room, room_id)
    if room is None:
        raise NotFoundError(f"Room with id {room_id} was not found.")

    room.status = payload.status
    db.commit()
    db.refresh(room)
    return room
