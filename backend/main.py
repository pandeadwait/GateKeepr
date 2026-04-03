from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import DatabaseConnectionError, init_db
from backend.routes import bookings_router, rooms_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    app = FastAPI(title="Centralized Room Allocation & Management System")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def startup() -> None:
        try:
            init_db()
        except DatabaseConnectionError:
            raise

    app.include_router(rooms_router)
    app.include_router(bookings_router)
    return app


app = create_app()
