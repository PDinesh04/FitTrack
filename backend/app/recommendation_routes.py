
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import User, Workout, Goal, Streak, Exercise
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/recommendations",
    tags=["AI Workout Suggestions"]
)


@router.get("/")
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get user's goals
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()

    # Get workout history
    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).order_by(
        Workout.workout_date.desc()
    ).limit(10).all()

    # Get streak
    streak = db.query(Streak).filter(
        Streak.user_id == current_user.id
    ).first()

    # Determine recommendation category
    goal_types = [goal.goal_type.lower() for goal in goals]

    if any("weight loss" in goal for goal in goal_types):
        preferred_category = "Cardio"
        reason = "Recommended based on your weight-loss goal."

    elif any("muscle gain" in goal for goal in goal_types):
        preferred_category = "Strength"
        reason = "Recommended based on your muscle-gain goal."

    elif any("steps" in goal for goal in goal_types):
        preferred_category = "Cardio"
        reason = "Recommended to support your activity goal."

    elif workouts:
        preferred_category = workouts[0].category
        reason = "Recommended based on your recent workout history."

    else:
        preferred_category = "Yoga"
        reason = "A beginner-friendly category to get started."

    # Get matching exercises
    exercises = db.query(Exercise).filter(
        Exercise.category == preferred_category
    ).limit(5).all()

    # If no matching exercises exist, show available exercises
    if not exercises:
        exercises = db.query(Exercise).limit(5).all()

    total_workouts = db.query(func.count(Workout.id)).filter(
        Workout.user_id == current_user.id
    ).scalar()

    return {
        "preferred_category": preferred_category,
        "reason": reason,
        "total_workouts": total_workouts,
        "current_streak": streak.current_streak if streak else 0,
        "recommendations": [
            {
                "id": exercise.id,
                "name": exercise.name,
                "category": exercise.category,
                "description": exercise.description,
                "duration": exercise.duration
            }
            for exercise in exercises
        ]
    }
