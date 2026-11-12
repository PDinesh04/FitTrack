
from pydantic import BaseModel, Field, ConfigDict
from datetime import date


class WaterCreate(BaseModel):
    quantity: int = Field(gt=0, le=10000)
    date: date


class WaterResponse(BaseModel):
    id: int
    user_id: int
    quantity: int
    date: date

    model_config = ConfigDict(from_attributes=True)
