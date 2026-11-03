
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    analytics_routes,
    auth_routes,
    goal_routes,
    notification_routes,
    progress_routes,
    workout_routes,
)

app = FastAPI(
    title="FitTrack API",
    version="0.1.0",
)

# CORS configuration for React frontend
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

# Register all API routers
app.include_router(auth_routes.router)
app.include_router(workout_routes.router)
app.include_router(progress_routes.router)
app.include_router(goal_routes.router)
app.include_router(notification_routes.router)
app.include_router(analytics_routes.router)


@app.get("/")
def root():
    return {
        "message": "FitTrack API is running"
    }
