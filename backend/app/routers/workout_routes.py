
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Workout, User

from app.workout_schemas import WorkoutCreate, WorkoutResponse
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/workouts",
    tags=["Workout Management"]
)


@router.post("/", response_model=WorkoutResponse, status_code=201)
def add_workout(
    workout: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_workout = Workout(
        user_id=current_user.id,
        workout_name=workout.workout_name,
        category=workout.category,
        duration=workout.duration,
        calories_burned=workout.calories_burned,
        workout_date=workout.workout_date
    )

    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)

    return new_workout

@router.get("/", response_model=list[WorkoutResponse])
def get_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workouts = db.query(Workout).filter(
        Workout.user_id == current_user.id
    ).all()

    return workouts


@router.get("/{workout_id}", response_model=WorkoutResponse)
def get_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    return workout



@router.put("/{workout_id}", response_model=WorkoutResponse)
def update_workout(
    workout_id: int,
    updated_data: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    workout.workout_name = updated_data.workout_name
    workout.category = updated_data.category
    workout.duration = updated_data.duration
    workout.calories_burned = updated_data.calories_burned
    workout.workout_date = updated_data.workout_date

    db.commit()
    db.refresh(workout)

    return workout



@router.delete("/{workout_id}")
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=404,
            detail="Workout not found"
        )

    db.delete(workout)
    db.commit()

    return {
        "message": "Workout deleted successfully"
    }
