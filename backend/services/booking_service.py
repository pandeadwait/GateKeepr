from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.models.booking import Booking
from backend.schemas.booking import BookingCreate
from backend.services.allocation_service import allocate_room
from backend.services.exceptions import NotFoundError


def create_booking(db: Session, payload: BookingCreate) -> Booking:
    return allocate_room(db, payload)


def delete_booking(db: Session, booking_id: int) -> None:
    booking = db.get(Booking, booking_id)
    if booking is None:
        raise NotFoundError("Booking not found.")

    room = booking.room
    db.delete(booking)
    db.flush()

    if room is not None:
        remaining_active_bookings = (
            db.query(func.count(Booking.id))
            .filter(Booking.room_id == room.id, Booking.status == "active")
            .scalar()
        )
        active_count = int(remaining_active_bookings or 0)
        # TODO: maintenance rooms currently fall back to generic occupancy states here.
        if active_count <= 0:
            room.status = "available"
        elif active_count < room.capacity:
            room.status = "partially_booked"
        else:
            room.status = "occupied"

    db.commit()
