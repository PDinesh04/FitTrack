
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models import WorkoutPlan, User
from app.dependencies import get_current_user
from app.workout_plan_schemas import (
    WorkoutPlanCreate,
    WorkoutPlanUpdate,
    WorkoutPlanResponse
)

router = APIRouter(prefix="/workout-plans", tags=["Workout Plans"])


@router.post("/", response_model=WorkoutPlanResponse, status_code=201)
def create_plan(
    data: WorkoutPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = WorkoutPlan(
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        scheduled_date=data.scheduled_date
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.get("/", response_model=list[WorkoutPlanResponse])
def get_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id
    ).order_by(WorkoutPlan.scheduled_date).all()


@router.get("/upcoming", response_model=list[WorkoutPlanResponse])
def upcoming_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(WorkoutPlan).filter(
        WorkoutPlan.user_id == current_user.id,
        WorkoutPlan.scheduled_date >= date.today()
    ).order_by(WorkoutPlan.scheduled_date).all()


@router.put("/{plan_id}", response_model=WorkoutPlanResponse)
def update_plan(
    plan_id: int,
    data: WorkoutPlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == plan_id,
        WorkoutPlan.user_id == current_user.id
    ).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(plan, key, value)

    db.commit()
    db.refresh(plan)
    return plan


@router.delete("/{plan_id}")
def delete_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(WorkoutPlan).filter(
        WorkoutPlan.id == plan_id,
        WorkoutPlan.user_id == current_user.id
    ).first()

    if not plan:
        raise HTTPException(status_code=404, detail="Workout plan not found")

    db.delete(plan)
    db.commit()
    return {"message": "Workout plan deleted successfully"}
