from fastapi import FastAPI

from backend.routes.rooms import router as rooms_router


def create_app() -> FastAPI:
    app = FastAPI(title="HostelGrid Backend")

    @app.get("/", tags=["health"])
    def read_root() -> dict[str, str]:
        return {"message": "HostelGrid backend is running"}

    app.include_router(rooms_router, prefix="/api")
    return app


app = create_app()
