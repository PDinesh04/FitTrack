
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Reminder
from app.reminder_schemas import (
    ReminderCreate,
    ReminderUpdate,
    ReminderResponse
)

router = APIRouter(
    prefix="/reminders",
    tags=["Reminders & Alerts"]
)


@router.post("/", response_model=ReminderResponse)
def create_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_reminder = Reminder(
        **reminder.model_dump(),
        user_id=current_user.id
    )

    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)

    return new_reminder


@router.get("/", response_model=list[ReminderResponse])
def get_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Reminder).filter(
        Reminder.user_id == current_user.id
    ).order_by(
        Reminder.reminder_date,
        Reminder.reminder_time
    ).all()


@router.get("/today", response_model=list[ReminderResponse])
def get_today_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Reminder).filter(
        Reminder.user_id == current_user.id,
        Reminder.reminder_date == date.today(),
        Reminder.is_completed == False
    ).order_by(Reminder.reminder_time).all()


@router.patch("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(
    reminder_id: int,
    update: ReminderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()

    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    reminder.is_completed = update.is_completed
    db.commit()
    db.refresh(reminder)

    return reminder


@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()

    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    db.delete(reminder)
    db.commit()

    return {"message": "Reminder deleted successfully"}
