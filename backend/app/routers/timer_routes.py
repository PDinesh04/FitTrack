
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models import Workout, User
from app.dependencies import get_current_user
from app.timer_schemas import WorkoutTimerCreate, WorkoutTimerStop

router = APIRouter(prefix="/workout-timer", tags=["Workout Timer"])


@router.post("/start")
def start_workout(
    data: WorkoutTimerCreate,
    current_user: User = Depends(get_current_user)
):
    return {
        "message": "Workout timer started",
        "workout_name": data.workout_name,
        "category": data.category,
        "calories_per_minute": data.calories_per_minute
    }


@router.post("/stop")
def stop_workout(
    data: WorkoutTimerStop,
    workout_name: str,
    category: str,
    calories_per_minute: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not workout_name.strip() or not category.strip():
        raise HTTPException(status_code=400, detail="Invalid workout details")

    calories = round(data.duration * calories_per_minute)

    workout = Workout(
        user_id=current_user.id,
        workout_name=workout_name,
        category=category,
        duration=data.duration,
        calories_burned=calories,
        workout_date=data.workout_date
    )

    db.add(workout)
    db.commit()
    db.refresh(workout)

    return {
        "message": "Workout completed successfully",
        "workout_id": workout.id,
        "duration_minutes": workout.duration,
        "calories_burned": workout.calories_burned
    }
