
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Workout

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).count()

    total_calories = db.query(
        func.coalesce(func.sum(Workout.calories_burned), 0)
    ).filter(
        Workout.user_id == current_user.id
    ).scalar()

    total_duration = db.query(
        func.coalesce(func.sum(Workout.duration), 0)
    ).filter(
        Workout.user_id == current_user.id
    ).scalar()

    return {
        "period": "All time",
        "total_workouts": total_workouts,
        "total_calories": total_calories,
        "total_duration": total_duration
    }
