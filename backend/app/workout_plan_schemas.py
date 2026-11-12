
from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import Optional


class WorkoutPlanCreate(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    description: Optional[str] = None
    scheduled_date: date


class WorkoutPlanUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=150)
    description: Optional[str] = None
    scheduled_date: Optional[date] = None


class WorkoutPlanResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    scheduled_date: date
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
