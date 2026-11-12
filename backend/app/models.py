from sqlalchemy import (
    Column, Integer, String, DateTime, Date, ForeignKey, Boolean
)
from sqlalchemy.sql import func

from app.database import Base

from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())



from sqlalchemy import ForeignKey


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    workout_name = Column(String(150), nullable=False)

    category = Column(String(50), nullable=False)

    duration = Column(Integer, nullable=False)

    calories_burned = Column(Integer, nullable=False)

    workout_date = Column(Date, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    total_workouts = Column(Integer, default=0, nullable=False)

    total_calories = Column(Integer, default=0, nullable=False)

    date = Column(Date, nullable=False)

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    goal_type = Column(String(50), nullable=False)

    target_value = Column(Integer, nullable=False)

    current_value = Column(Integer, default=0, nullable=False)

    deadline = Column(Date, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(String(500), nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    
class WorkoutPlan(Base):
    __tablename__ = "workout_plans"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    title = Column(String(150), nullable=False)
    description = Column(String(500), nullable=True)
    scheduled_date = Column(Date, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(String(500), nullable=True)
    duration = Column(Integer, nullable=False)

class Streak(Base):
    __tablename__ = "streaks"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    last_workout_date = Column(Date, nullable=True)


class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(300), nullable=False)
    icon = Column(String(100), nullable=False)

    user_badges = relationship(
        "UserBadge",
        back_populates="badge"
    )


class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    badge_id = Column(
        Integer,
        ForeignKey("badges.id"),
        nullable=False
    )

    earned_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    badge = relationship(
        "Badge",
        back_populates="user_badges"
    )


class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    meal_type = Column(String(30), nullable=False)
    food_name = Column(String(150), nullable=False)
    calories = Column(Integer, nullable=False)
    protein = Column(Integer, default=0, nullable=False)
    carbs = Column(Integer, default=0, nullable=False)
    fats = Column(Integer, default=0, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class WaterTracking(Base):
    __tablename__ = "water_tracking"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    quantity = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class ExternalActivity(Base):
    __tablename__ = "external_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    provider = Column(String(50), nullable=False)
    activity_name = Column(String(150), nullable=False)
    steps = Column(Integer, default=0, nullable=False)
    calories = Column(Integer, default=0, nullable=False)
    duration = Column(Integer, default=0, nullable=False)
    activity_date = Column(Date, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(String(500), nullable=False)
    reminder_type = Column(String(50), nullable=False)
    reminder_time = Column(String(10), nullable=False)
    reminder_date = Column(Date, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


