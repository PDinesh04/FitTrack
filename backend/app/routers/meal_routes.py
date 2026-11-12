
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.database import get_db
from app.models import Meal, User
from app.dependencies import get_current_user
from app.meal_schemas import MealCreate, MealResponse

router = APIRouter(prefix="/meals", tags=["Nutrition & Meals"])


@router.post("/", response_model=MealResponse, status_code=201)
def add_meal(
    data: MealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meal = Meal(
        user_id=current_user.id,
        **data.model_dump()
    )

    db.add(meal)
    db.commit()
    db.refresh(meal)
    return meal


@router.get("/", response_model=list[MealResponse])
def get_meals(
    meal_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Meal).filter(
        Meal.user_id == current_user.id
    )

    if meal_date:
        query = query.filter(
            func.date(Meal.created_at) == meal_date
        )

    return query.order_by(Meal.created_at.desc()).all()


@router.get("/daily-summary")
def daily_summary(
    meal_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    selected_date = meal_date or date.today()

    result = db.query(
        func.coalesce(func.sum(Meal.calories), 0),
        func.coalesce(func.sum(Meal.protein), 0),
        func.coalesce(func.sum(Meal.carbs), 0),
        func.coalesce(func.sum(Meal.fats), 0)
    ).filter(
        Meal.user_id == current_user.id,
        func.date(Meal.created_at) == selected_date
    ).first()

    return {
        "date": selected_date,
        "total_calories": result[0],
        "total_protein": result[1],
        "total_carbs": result[2],
        "total_fats": result[3]
    }


@router.delete("/{meal_id}")
def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meal = db.query(Meal).filter(
        Meal.id == meal_id,
        Meal.user_id == current_user.id
    ).first()

    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    db.delete(meal)
    db.commit()

    return {"message": "Meal deleted successfully"}
