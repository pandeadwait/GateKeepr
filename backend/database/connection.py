from __future__ import annotations

from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


DATABASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = DATABASE_DIR / "app.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"


class DatabaseConnectionError(RuntimeError):
    """Raised when the application cannot connect to the configured database."""


class Base(DeclarativeBase):
    """Base class for all ORM models."""


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, class_=Session)


def get_engine() -> Engine:
    try:
        with engine.connect() as connection:
            connection.close()
    except SQLAlchemyError as exc:
        raise DatabaseConnectionError("Failed to connect to the SQLite database.") from exc
    return engine


def init_db() -> None:
    try:
        DATABASE_DIR.mkdir(parents=True, exist_ok=True)

        # Import models here so metadata is fully registered before create_all.
        from backend.models import booking, room, user  # noqa: F401

        Base.metadata.create_all(bind=get_engine())
    except SQLAlchemyError as exc:
        raise DatabaseConnectionError("Failed to initialize the SQLite database.") from exc


def get_db() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
