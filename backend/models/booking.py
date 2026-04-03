from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship, validates

from backend.database.connection import Base


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        UniqueConstraint("user_id", "room_id", "check_in_date", name="uq_booking_entry"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    room_id: Mapped[int] = mapped_column(ForeignKey("rooms.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    check_in_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    check_out_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="bookings")
    room: Mapped["Room"] = relationship(back_populates="bookings")

    @validates("user_id", "room_id", "check_in_date")
    def validate_required_fields(self, key: str, value: object) -> object:
        if value is None:
            raise ValueError(f"{key} is required.")
        return value

    @validates("status")
    def validate_status(self, key: str, value: str) -> str:
        if value is None or not str(value).strip():
            raise ValueError(f"{key} is required.")
        return value.strip()
