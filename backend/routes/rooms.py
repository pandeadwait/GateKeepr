from fastapi import APIRouter

from backend.models.schemas import Room

router = APIRouter(prefix="/rooms", tags=["rooms"])


def get_all_rooms() -> list[Room]:
    """Placeholder for a future repository or data-access implementation."""
    return [
        Room(id=1, name="A-101", capacity=2, occupied=1, priority=1),
        Room(id=2, name="B-204", capacity=3, occupied=2, priority=2),
    ]


@router.get("/", response_model=list[Room])
def list_rooms() -> list[Room]:
    return get_all_rooms()
