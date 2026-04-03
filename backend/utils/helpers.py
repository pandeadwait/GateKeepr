from backend.models.schemas import Room


def has_available_beds(room: Room) -> bool:
    return room.occupied < room.capacity
