
from datetime import date
from pydantic import BaseModel, Field
from typing import Literal


class ExternalActivityCreate(BaseModel):
    provider: Literal["Google Fit", "Apple Health", "Health Connect"]
    activity_name: str = Field(min_length=2, max_length=150)
    steps: int = Field(default=0, ge=0)
    calories: int = Field(default=0, ge=0)
    duration: int = Field(default=0, ge=0)
    activity_date: date


class ExternalActivityResponse(ExternalActivityCreate):
    id: int
    user_id: int

    model_config = {"from_attributes": True}
