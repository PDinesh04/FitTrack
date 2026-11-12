
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import date

from app.database import get_db
from app.models import (
    User, Workout, WorkoutPlan, Goal, Streak, UserBadge
)
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/personalized-dashboard",
    tags=["Personalized Dashboard"]
)


@router.get("/")
def personalized_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    workouts = db.query(
        func.count(Workout.id),
        func.coalesce(func.sum(Workout.calories_burned), 0)
    ).filter(
        Workout.user_id == current_user.id,
        Workout.workout_date == today
    ).first()

    upcoming = db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id,
        WorkoutPlan.scheduled_date >= today
    ).order_by(
        WorkoutPlan.scheduled_date
    ).limit(5).all()

    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()

    streak = db.query(Streak).filter(
        Streak.user_id == current_user.id
    ).first()

    badges = db.query(UserBadge).options(
        joinedload(UserBadge.badge)
    ).filter(
        UserBadge.user_id == current_user.id
    ).all()

    return {
        "daily_summary": {
            "total_workouts": workouts[0],
            "total_calories": workouts[1]
        },
        "upcoming_workouts": [
            {
                "id": item.id,
                "title": item.title,
                "description": item.description,
                "scheduled_date": item.scheduled_date
            }
            for item in upcoming
        ],
        "goals": [
            {
                "id": goal.id,
                "goal_type": goal.goal_type,
                "target_value": goal.target_value,
                "current_value": goal.current_value,
                "deadline": goal.deadline,
                "progress_percentage": min(
                    100,
                    round(goal.current_value / goal.target_value * 100, 2)
                ) if goal.target_value > 0 else 0
            }
            for goal in goals
        ],
        "streak": {
            "current_streak": streak.current_streak if streak else 0,
            "longest_streak": streak.longest_streak if streak else 0
        },
        "earned_badges": [
            {
                "name": item.badge.name,
                "description": item.badge.description,
                "icon": item.badge.icon,
                "earned_at": item.earned_at
            }
            for item in badges if item.badge
        ]
    }
