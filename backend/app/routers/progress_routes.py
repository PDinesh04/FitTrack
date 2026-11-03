
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Workout, User, Progress
from app.progress_schemas import ProgressResponse
from app.dependencies import get_current_user

from datetime import date

router = APIRouter(
    prefix="/progress",
    tags=["Daily Progress"]
)


@router.get("/daily", response_model=ProgressResponse)
def get_daily_progress(
    progress_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    total_workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date == progress_date
    ).count()

    total_calories = db.query(
        func.coalesce(func.sum(Workout.calories_burned), 0)
    ).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date == progress_date
    ).scalar()

    progress = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.date == progress_date
    ).first()

    if progress:
        progress.total_workouts = total_workouts
        progress.total_calories = total_calories
    else:
        progress = Progress(
            user_id=current_user.id,
            total_workouts=total_workouts,
            total_calories=total_calories,
            date=progress_date
        )
        db.add(progress)

    db.commit()
    db.refresh(progress)

    return progress
