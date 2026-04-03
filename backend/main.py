from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.rooms import router as rooms_router


def create_app() -> FastAPI:
    app = FastAPI(title="HostelGrid Backend")

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

    @app.get("/", tags=["health"])
    def read_root() -> dict[str, str | dict[str, str]]:
        return {
            "message": "HostelGrid backend is running",
            "available_endpoints": {
                "rooms": "/api/rooms",
                "allocate": "/api/rooms/allocate",
            },
        }

    app.include_router(rooms_router, prefix="/api")
    return app


app = create_app()
