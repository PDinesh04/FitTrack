
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("")
def get_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return {
        "period": "Last 7 days",
        "total_workouts": 0,
        "total_calories": 0,
        "total_duration": 0,
    }

