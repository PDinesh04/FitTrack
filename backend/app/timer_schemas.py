
from pydantic import BaseModel, Field
from datetime import date


class WorkoutTimerCreate(BaseModel):
    workout_name: str = Field(min_length=2, max_length=150)
    category: str = Field(min_length=2, max_length=50)
    calories_per_minute: float = Field(gt=0, le=30)


class WorkoutTimerStop(BaseModel):
    duration: int = Field(gt=0, le=1440)
    workout_date: date
