
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models
from app.routers import (
    analytics_routes,
    auth_routes,
    goal_routes,
    notification_routes,
    progress_routes,
    workout_routes,
)
from app.routers import workout_plan_routes
from app.routers import exercise_routes
from app.routers import comparison_routes
from app.routers import streak_routes
from app.routers import badge_routes
from app.routers import meal_routes
from app.routers import personalized_dashboard_routes
from app.routers import water_routes
from app.routers import recommendation_routes
from app.routers import timer_routes
from app.routers import external_activity_routes
from app.routers import advanced_analytics_routes
from app.routers import reminder_routes

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
app.include_router(workout_plan_routes.router)
app.include_router(exercise_routes.router)
app.include_router(comparison_routes.router)
app.include_router(streak_routes.router)
app.include_router(badge_routes.router)
app.include_router(meal_routes.router)
app.include_router(personalized_dashboard_routes.router)
app.include_router(water_routes.router)
app.include_router(recommendation_routes.router)
app.include_router(timer_routes.router)
app.include_router(external_activity_routes.router)
app.include_router(advanced_analytics_routes.router)
app.include_router(reminder_routes.router)

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "message": "FitTrack API is running"
    }
