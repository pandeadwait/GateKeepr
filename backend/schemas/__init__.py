"""Request and response schema exports."""

from backend.schemas.booking import BookingCreate, BookingRead
from backend.schemas.room import RoomCreate, RoomRead, RoomStatusUpdate

__all__ = [
    "BookingCreate",
    "BookingRead",
    "RoomCreate",
    "RoomRead",
    "RoomStatusUpdate",
]
