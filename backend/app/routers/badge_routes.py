
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Badge, UserBadge, Workout, Goal, Streak, User
from app.dependencies import get_current_user
from app.badge_schemas import UserBadgeResponse

router = APIRouter(prefix="/badges", tags=["Achievement Badges"])


def award_badge(db, user_id, badge_name):
    badge = db.query(Badge).filter(
        Badge.name == badge_name
    ).first()

    if not badge:
        return

    existing = db.query(UserBadge).filter(
        UserBadge.user_id == user_id,
        UserBadge.badge_id == badge.id
    ).first()

    if not existing:
        db.add(UserBadge(
            user_id=user_id,
            badge_id=badge.id
        ))


@router.get("/me", response_model=list[UserBadgeResponse])
def my_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(UserBadge).options(
        joinedload(UserBadge.badge)
    ).filter(
        UserBadge.user_id == current_user.id
    ).order_by(UserBadge.earned_at.desc()).all()


@router.post("/check")
def check_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout_count = db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).count()

    streak = db.query(Streak).filter(
        Streak.user_id == current_user.id
    ).first()

    completed_goals = db.query(Goal).filter(
        Goal.user_id == current_user.id,
        Goal.current_value >= Goal.target_value
    ).count()

    if workout_count >= 1:
        award_badge(db, current_user.id, "First Workout")

    if workout_count >= 10:
        award_badge(db, current_user.id, "Workout Champion")

    if streak and streak.longest_streak >= 7:
        award_badge(db, current_user.id, "7 Day Streak")

    if completed_goals >= 1:
        award_badge(db, current_user.id, "Goal Achiever")

    db.commit()

    return {"message": "Achievement check completed"}


@router.get("/all")
def all_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Badge).order_by(Badge.id).all()
