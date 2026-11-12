
from datetime import date
from pydantic import BaseModel, Field
from typing import Literal


class ReminderCreate(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    message: str = Field(min_length=2, max_length=500)
    reminder_type: Literal["Workout", "Water", "Meal", "General"]
    reminder_time: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$")
    reminder_date: date


class ReminderUpdate(BaseModel):
    is_completed: bool


class ReminderResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    reminder_type: str
    reminder_time: str
    reminder_date: date
    is_completed: bool

    model_config = {"from_attributes": True}
