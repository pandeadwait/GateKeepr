from fastapi import APIRouter, Depends, Query

from backend.models.schemas import AllocationRequest, AllocationResponse, Room, RoomStatus
from backend.services.allocation import allocate_room
from backend.utils.helpers import RoomRepository, get_room_repository

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("/", response_model=list[Room])
def list_rooms(
    block: str | None = Query(default=None),
    floor_number: int | None = Query(default=None, ge=1),
    room_type: str | None = Query(default=None),
    status: RoomStatus | None = Query(default=None),
    repository: RoomRepository = Depends(get_room_repository),
) -> list[Room]:
    rooms = list(repository.get_all_rooms())

    if block is not None:
        rooms = [room for room in rooms if room.block == block]
    if floor_number is not None:
        rooms = [room for room in rooms if room.floor_number == floor_number]
    if room_type is not None:
        rooms = [room for room in rooms if room.room_type == room_type]
    if status is not None:
        rooms = [room for room in rooms if room.status == status]

    return rooms


@router.post("/allocate", response_model=AllocationResponse)
def recommend_room_allocation(
    request: AllocationRequest,
    repository: RoomRepository = Depends(get_room_repository),
) -> AllocationResponse:
    rooms = list(repository.get_all_rooms())

    if request.preferred_block is not None:
        rooms = [room for room in rooms if room.block == request.preferred_block]
    if request.preferred_floor is not None:
        rooms = [room for room in rooms if room.floor_number == request.preferred_floor]
    if request.preferred_room_type is not None:
        rooms = [room for room in rooms if room.room_type == request.preferred_room_type]

    room = allocate_room(rooms=rooms, priority=request.priority)
    if room is None:
        return AllocationResponse(
            room=None,
            message="No matching room is currently available.",
        )

    return AllocationResponse(
        room=room,
        message="Recommended room generated successfully.",
    )
