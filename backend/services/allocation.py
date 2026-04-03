from collections.abc import Sequence

from backend.models.schemas import Room


def allocate_room(rooms: Sequence[Room], priority: int) -> Room | None:
    """
    Select the best available room for a given priority.

    Lower priority values are treated as higher preference.
    """
    available_rooms = [room for room in rooms if room.occupied < room.capacity]
    if not available_rooms:
        return None

    prioritized_rooms = sorted(
        available_rooms,
        key=lambda room: (abs(room.priority - priority), room.occupied, room.id),
    )
    return prioritized_rooms[0]
