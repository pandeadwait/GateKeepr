from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from backend.database.connection import Base


class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    room_number: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    floor_number: Mapped[int] = mapped_column(Integer, nullable=False)
    block: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    room_type: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)

    bookings: Mapped[list["Booking"]] = relationship(
        back_populates="room",
        cascade="all, delete-orphan",
    )

    @validates("room_number", "block", "room_type", "status")
    def validate_required_strings(self, key: str, value: str) -> str:
        if value is None or not str(value).strip():
            raise ValueError(f"{key} is required.")
        return value.strip()

    @validates("floor_number", "capacity")
    def validate_required_integers(self, key: str, value: int) -> int:
        if value is None:
            raise ValueError(f"{key} is required.")
        return value
