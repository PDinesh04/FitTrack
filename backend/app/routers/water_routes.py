
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.database import get_db
from app.models import WaterTracking, User
from app.dependencies import get_current_user
from app.water_schemas import WaterCreate, WaterResponse

router = APIRouter(
    prefix="/water",
    tags=["Water Intake Tracker"]
)

# Default daily target: 2500 ml
DAILY_WATER_GOAL = 2500


@router.post("/", response_model=WaterResponse, status_code=201)
def add_water(
    data: WaterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    water = WaterTracking(
        user_id=current_user.id,
        quantity=data.quantity,
        date=data.date
    )

    db.add(water)
    db.commit()
    db.refresh(water)

    return water


@router.get("/", response_model=list[WaterResponse])
def get_water_logs(
    selected_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(WaterTracking).filter(
        WaterTracking.user_id == current_user.id
    )

    if selected_date:
        query = query.filter(
            WaterTracking.date == selected_date
        )

    return query.order_by(WaterTracking.date.desc()).all()


@router.get("/daily-summary")
def water_summary(
    selected_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_date = selected_date or date.today()

    total = db.query(
        func.coalesce(func.sum(WaterTracking.quantity), 0)
    ).filter(
        WaterTracking.user_id == current_user.id,
        WaterTracking.date == target_date
    ).scalar()

    percentage = round(
        min(total / DAILY_WATER_GOAL * 100, 100), 2
    )

    return {
        "date": target_date,
        "total_water_ml": total,
        "total_water_liters": round(total / 1000, 2),
        "daily_goal_ml": DAILY_WATER_GOAL,
        "progress_percentage": percentage,
        "remaining_ml": max(DAILY_WATER_GOAL - total, 0)
    }


@router.delete("/{water_id}")
def delete_water(
    water_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    record = db.query(WaterTracking).filter(
        WaterTracking.id == water_id,
        WaterTracking.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Water record not found"
        )

    db.delete(record)
    db.commit()

    return {"message": "Water record deleted successfully"}
