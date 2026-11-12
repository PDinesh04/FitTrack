
from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional


class StreakResponse(BaseModel):
    id: int
    user_id: int
    current_streak: int
    longest_streak: int
    last_workout_date: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)
