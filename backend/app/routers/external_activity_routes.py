
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, ExternalActivity
from app.external_activity_schemas import (
    ExternalActivityCreate,
    ExternalActivityResponse
)

router = APIRouter(
    prefix="/external-activities",
    tags=["External Activities"]
)


@router.post("/", response_model=ExternalActivityResponse)
def import_activity(
    activity: ExternalActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_activity = ExternalActivity(
        **activity.model_dump(),
        user_id=current_user.id
    )

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    return new_activity


@router.get("/", response_model=list[ExternalActivityResponse])
def get_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(ExternalActivity).filter(
        ExternalActivity.user_id == current_user.id
    ).order_by(ExternalActivity.activity_date.desc()).all()
