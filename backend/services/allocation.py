from collections.abc import Sequence

from backend.models.schemas import Room
from backend.utils.helpers import has_available_beds


def allocate_room(rooms: Sequence[Room], priority: int) -> Room | None:
    """
    Select the best available room for a given priority.

    Lower priority values are treated as higher preference.
    """
    available_rooms = [room for room in rooms if has_available_beds(room)]
    if not available_rooms:
        return None

    prioritized_rooms = sorted(
        available_rooms,
        key=lambda room: (
            abs(room.floor_number - priority),
            room.active_warning_tickets,
            room.current_occupants,
            room.id,
        ),
    )
    return prioritized_rooms[0]
