
from pydantic import BaseModel, Field, ConfigDict
from datetime import date
from typing import Literal


class WorkoutCreate(BaseModel):
    workout_name: str = Field(min_length=2, max_length=150)

    category: Literal["Cardio", "Strength", "Yoga"]

    duration: int = Field(gt=0, le=1440)

    calories_burned: int = Field(ge=0)

    workout_date: date


class WorkoutResponse(BaseModel):
    id: int
    user_id: int
    workout_name: str
    category: str
    duration: int
    calories_burned: int
    workout_date: date

    model_config = ConfigDict(from_attributes=True)
