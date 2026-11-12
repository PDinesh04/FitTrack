
from pydantic import BaseModel, Field, ConfigDict
from typing import Literal


class MealCreate(BaseModel):
    meal_type: Literal["Breakfast", "Lunch", "Dinner", "Snacks"]
    food_name: str = Field(min_length=2, max_length=150)
    calories: int = Field(ge=0)
    protein: int = Field(default=0, ge=0)
    carbs: int = Field(default=0, ge=0)
    fats: int = Field(default=0, ge=0)


class MealResponse(BaseModel):
    id: int
    user_id: int
    meal_type: str
    food_name: str
    calories: int
    protein: int
    carbs: int
    fats: int

    model_config = ConfigDict(from_attributes=True)
