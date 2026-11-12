
from app.database import SessionLocal
from app.models import Badge

db = SessionLocal()

badges = [
    {
        "name": "First Workout",
        "description": "Complete your first workout",
        "icon": "🏃"
    },
    {
        "name": "Workout Champion",
        "description": "Complete 10 workouts",
        "icon": "🏆"
    },
    {
        "name": "7 Day Streak",
        "description": "Maintain a 7-day workout streak",
        "icon": "🔥"
    },
    {
        "name": "Goal Achiever",
        "description": "Complete your first fitness goal",
        "icon": "🎯"
    }
]

for item in badges:
    exists = db.query(Badge).filter(
        Badge.name == item["name"]
    ).first()

    if not exists:
        db.add(Badge(**item))

db.commit()
db.close()

print("Default badges inserted successfully")
