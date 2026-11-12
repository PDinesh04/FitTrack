
from pydantic import BaseModel, Field, ConfigDict
from datetime import date
from typing import Literal


class GoalCreate(BaseModel):
    goal_type: Literal["Weight Loss", "Muscle Gain", "Steps"]
    target_value: int = Field(gt=0)
    current_value: int = Field(ge=0)
    deadline: date


class GoalUpdate(BaseModel):
    current_value: int = Field(ge=0)


class GoalResponse(BaseModel):
    id: int
    user_id: int
    goal_type: str
    target_value: int
    current_value: int
    deadline: date

    model_config = ConfigDict(from_attributes=True)
