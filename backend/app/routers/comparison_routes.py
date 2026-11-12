
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
import calendar

from app.database import get_db
from app.models import Workout, User
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/progress-comparison",
    tags=["Progress Comparison"]
)


def get_stats(db, user_id, start_date, end_date):
    result = db.query(
        func.count(Workout.id),
        func.coalesce(func.sum(Workout.calories_burned), 0),
        func.coalesce(func.sum(Workout.duration), 0)
    ).filter(
        Workout.user_id == user_id,
        Workout.workout_date >= start_date,
        Workout.workout_date <= end_date
    ).first()

    return {
        "total_workouts": result[0],
        "total_calories": result[1],
        "total_duration": result[2]
    }


def calculate_change(current, previous):
    if previous == 0:
        return 100 if current > 0 else 0

    return round(((current - previous) / previous) * 100, 2)


@router.get("/weekly")
def weekly_comparison(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    current_start = today - timedelta(days=today.weekday())
    current_end = today

    previous_start = current_start - timedelta(days=7)
    previous_end = current_start - timedelta(days=1)

    current = get_stats(
        db, current_user.id, current_start, current_end
    )

    previous = get_stats(
        db, current_user.id, previous_start, previous_end
    )

    return {
        "current_week": current,
        "previous_week": previous,
        "calorie_improvement": calculate_change(
            current["total_calories"],
            previous["total_calories"]
        ),
        "workout_improvement": calculate_change(
            current["total_workouts"],
            previous["total_workouts"]
        )
    }


@router.get("/monthly")
def monthly_comparison(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    current_start = today.replace(day=1)
    previous_end = current_start - timedelta(days=1)
    previous_start = previous_end.replace(day=1)

    current = get_stats(
        db, current_user.id, current_start, today
    )

    previous = get_stats(
        db, current_user.id, previous_start, previous_end
    )

    return {
        "current_month": current,
        "previous_month": previous,
        "calorie_improvement": calculate_change(
            current["total_calories"],
            previous["total_calories"]
        ),
        "workout_improvement": calculate_change(
            current["total_workouts"],
            previous["total_workouts"]
        )
    }
