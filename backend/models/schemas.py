from pydantic import BaseModel, Field


class Room(BaseModel):
    id: int
    name: str = Field(..., min_length=1)
    capacity: int = Field(..., ge=1)
    occupied: int = Field(..., ge=0)
    priority: int = Field(..., ge=1)


class AllocationRequest(BaseModel):
    priority: int = Field(..., ge=1)
