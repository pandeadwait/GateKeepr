from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BookingCreate(BaseModel):
    user_id: int = Field(..., ge=1)
    room_id: int = Field(..., ge=1)
    status: str = Field(..., min_length=1)
    check_in_date: datetime
    check_out_date: datetime | None = None


class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    room_id: int
    status: str
    check_in_date: datetime
    check_out_date: datetime | None = None
    created_at: datetime
