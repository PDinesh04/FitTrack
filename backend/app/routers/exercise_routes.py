
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Exercise, User
from app.dependencies import get_current_user
from app.exercise_schemas import ExerciseCreate, ExerciseResponse

router = APIRouter(prefix="/exercises", tags=["Exercise Library"])


@router.post("/", response_model=ExerciseResponse, status_code=201)
def create_exercise(
    data: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exercise = Exercise(**data.model_dump())
    db.add(exercise)
    db.commit()
    db.refresh(exercise)
    return exercise


@router.get("/", response_model=list[ExerciseResponse])
def get_exercises(
    search: str = Query(default="", max_length=150),
    category: str = Query(default=""),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Exercise)

    if search.strip():
        query = query.filter(
            Exercise.name.ilike(f"%{search.strip()}%")
        )

    if category:
        if category not in ["Cardio", "Strength", "Yoga"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid category"
            )
        query = query.filter(Exercise.category == category)

    return query.order_by(Exercise.name).all()


@router.get("/{exercise_id}", response_model=ExerciseResponse)
def get_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id
    ).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    return exercise
