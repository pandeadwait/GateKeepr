from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from backend.database import DatabaseConnectionError, get_db
from backend.schemas.room import RoomCreate, RoomRead, RoomStatusUpdate
from backend.services.exceptions import NotFoundError
from backend.services.room_service import create_room, list_rooms, update_room_status

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("", response_model=list[RoomRead])
def get_rooms(db: Session = Depends(get_db)) -> list[RoomRead]:
    try:
        return list_rooms(db)
    except DatabaseConnectionError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database query failed.") from exc


@router.post("", response_model=RoomRead, status_code=status.HTTP_201_CREATED)
def create_room_endpoint(payload: RoomCreate, db: Session = Depends(get_db)) -> RoomRead:
    try:
        return create_room(db, payload)
    except DatabaseConnectionError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create room.") from exc


@router.put("/{room_id}/status", response_model=RoomRead)
def update_room_status_endpoint(
    room_id: int,
    payload: RoomStatusUpdate,
    db: Session = Depends(get_db),
) -> RoomRead:
    try:
        return update_room_status(db, room_id, payload)
    except NotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except DatabaseConnectionError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update room status.") from exc
