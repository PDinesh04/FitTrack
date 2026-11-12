
from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import APIRouter, Depends

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Workout

router = APIRouter(
    prefix="/advanced-analytics",
    tags=["Advanced Analytics"]
)


@router.get("/")
def get_advanced_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    first_day = today.replace(day=1)

    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id
    )

    total_workouts = workouts.count()

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

    monthly_workouts = workouts.filter(
        Workout.workout_date >= first_day,
        Workout.workout_date <= today
    ).count()

    monthly_calories = db.query(
        func.coalesce(func.sum(Workout.calories_burned), 0)
    ).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date >= first_day,
        Workout.workout_date <= today
    ).scalar()

    category_data = db.query(
        Workout.category,
        func.count(Workout.id).label("count")
    ).filter(
        Workout.user_id == current_user.id
    ).group_by(Workout.category).all()

    weekly_data = []

    for days_ago in range(6, -1, -1):
        selected_date = today - timedelta(days=days_ago)

        daily_calories = db.query(
            func.coalesce(func.sum(Workout.calories_burned), 0)
        ).filter(
            Workout.user_id == current_user.id,
            Workout.workout_date == selected_date
        ).scalar()

        weekly_data.append({
            "date": selected_date.isoformat(),
            "calories": daily_calories
        })

    return {
        "overall": {
            "total_workouts": total_workouts,
            "total_calories": total_calories,
            "total_duration": total_duration
        },
        "monthly": {
            "workouts": monthly_workouts,
            "calories": monthly_calories
        },
        "category_breakdown": [
            {"category": item.category, "count": item.count}
            for item in category_data
        ],
        "weekly_calories": weekly_data
    }
