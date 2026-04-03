from enum import Enum

from pydantic import BaseModel, Field, computed_field


class RoomStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    PARTIALLY_OCCUPIED = "PARTIALLY_OCCUPIED"
    FULLY_OCCUPIED = "FULLY_OCCUPIED"
    MAINTENANCE = "MAINTENANCE"


class Room(BaseModel):
    id: int
    room_number: str = Field(..., min_length=1)
    floor_number: int = Field(..., ge=1)
    block: str = Field(..., min_length=1)
    capacity: int = Field(..., ge=1)
    room_type: str = Field(..., min_length=1)
    status: RoomStatus
    current_occupants: int = Field(default=0, ge=0)
    active_warning_tickets: int = Field(default=0, ge=0)

    @computed_field
    @property
    def available_beds(self) -> int:
        return max(self.capacity - self.current_occupants, 0)


class AllocationRequest(BaseModel):
    priority: int = Field(..., ge=1, le=10)
    preferred_block: str | None = Field(default=None, min_length=1)
    preferred_floor: int | None = Field(default=None, ge=1)
    preferred_room_type: str | None = Field(default=None, min_length=1)


class AllocationResponse(BaseModel):
    room: Room | None
    message: str
