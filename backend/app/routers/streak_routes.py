
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from app.database import get_db
from app.models import Streak, Workout, User
from app.dependencies import get_current_user
from app.streak_schemas import StreakResponse

router = APIRouter(prefix="/streak", tags=["Streak Tracking"])


@router.get("/me", response_model=StreakResponse)
def get_my_streak(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout_dates = db.query(
        Workout.workout_date
    ).filter(
        Workout.user_id == current_user.id
    ).distinct().order_by(
        Workout.workout_date.desc()
    ).all()

    dates = [row[0] for row in workout_dates]

    current_streak = 0
    longest_streak = 0

    if dates:
        today = date.today()
        last_date = dates[0]

        # A streak remains active if the last workout was today or yesterday.
        if last_date >= today - timedelta(days=1):
            current_streak = 1

            for i in range(1, len(dates)):
                if dates[i] == last_date - timedelta(days=i):
                    current_streak += 1
                else:
                    break

        # Calculate the longest historical consecutive-day streak.
        longest_streak = 1
        running_streak = 1

        for i in range(1, len(dates)):
            difference = (dates[i - 1] - dates[i]).days

            if difference == 1:
                running_streak += 1
            else:
                running_streak = 1

            longest_streak = max(longest_streak, running_streak)

    streak = db.query(Streak).filter(
        Streak.user_id == current_user.id
    ).first()

    if not streak:
        streak = Streak(user_id=current_user.id)
        db.add(streak)

    streak.current_streak = current_streak
    streak.longest_streak = max(
        streak.longest_streak,
        longest_streak
    )
    streak.last_workout_date = dates[0] if dates else None

    db.commit()
    db.refresh(streak)

    return streak
