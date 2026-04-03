from collections.abc import Sequence
from typing import Protocol

from backend.models.schemas import Room, RoomStatus


class RoomRepository(Protocol):
    def get_all_rooms(self) -> Sequence[Room]:
        """Return room rows or view models from the persistence layer."""


class InMemoryRoomRepository:
    """
    Temporary adapter that mirrors the database-facing contract.

    Replace this with an Oracle-backed repository later without changing routes
    or service logic.
    """

    def get_all_rooms(self) -> Sequence[Room]:
        return [
            Room(
                id=1,
                room_number="201",
                floor_number=2,
                block="A",
                capacity=2,
                room_type="2AC",
                status=RoomStatus.PARTIALLY_OCCUPIED,
                current_occupants=1,
                active_warning_tickets=0,
            ),
            Room(
                id=2,
                room_number="207",
                floor_number=2,
                block="A",
                capacity=3,
                room_type="3AC",
                status=RoomStatus.AVAILABLE,
                current_occupants=0,
                active_warning_tickets=0,
            ),
            Room(
                id=3,
                room_number="324",
                floor_number=3,
                block="A",
                capacity=4,
                room_type="4NAC",
                status=RoomStatus.MAINTENANCE,
                current_occupants=0,
                active_warning_tickets=1,
            ),
            Room(
                id=4,
                room_number="415",
                floor_number=4,
                block="A",
                capacity=3,
                room_type="3AC",
                status=RoomStatus.FULLY_OCCUPIED,
                current_occupants=3,
                active_warning_tickets=0,
            ),
        ]


def get_room_repository() -> RoomRepository:
    return InMemoryRoomRepository()


def has_available_beds(room: Room) -> bool:
    return room.available_beds > 0 and room.status != RoomStatus.MAINTENANCE
