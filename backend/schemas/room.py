from pydantic import BaseModel, ConfigDict, Field


class RoomBase(BaseModel):
    room_number: str = Field(..., min_length=1)
    floor_number: int = Field(..., ge=0)
    block: str = Field(..., min_length=1)
    capacity: int = Field(..., ge=1)
    room_type: str = Field(..., min_length=1)


class RoomCreate(RoomBase):
    status: str = Field(..., min_length=1)


class RoomStatusUpdate(BaseModel):
    status: str = Field(..., min_length=1)


class RoomRead(RoomBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    active_booking_id: int | None = None
    active_booking_count: int = 0
