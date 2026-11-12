# FitTrack – Fitness Tracker Application

FitTrack is a full-stack fitness tracking application designed to help users monitor their workouts, track fitness progress, manage goals, maintain healthy habits, and analyze their fitness activities.

The application provides a user-friendly dashboard with workout management, nutrition tracking, water intake monitoring, workout planning, streak tracking, and analytics.

## 🚀 Features

### 1. User Authentication
- User registration and login
- JWT-based authentication
- Protected application routes

### 2. Workout Management
- Add and manage workouts
- Track workout duration and calories burned
- View workout history
- Workout timer

### 3. Progress Tracking
- Track fitness progress
- Weekly and monthly comparisons
- Personalized dashboard
- Workout streak tracking

### 4. Goal Management
- Create and manage fitness goals
- Monitor goal progress
- Track achievements and badges

### 5. Workout Planning
- Create workout schedules
- Manage upcoming workout plans
- Exercise library with search and categories

### 6. Nutrition and Water Tracking
- Record daily meals
- Monitor calories, protein, carbohydrates, and fats
- Track daily water consumption

### 7. Analytics and Recommendations
- Workout analytics
- Advanced fitness analytics
- Category-wise workout breakdown
- Rule-based personalized workout recommendations

### 8. Additional Features
- External activity manual import
- Fitness reminders
- Notifications
- Achievement badges

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Frontend tooling | Vite |
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Authentication | JWT |
| API Testing | Swagger UI |
| Styling | CSS |

## 📂 Project Structure

```text
FitTrack/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   ├── dependencies.py
│   │   └── schemas
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── package.json
│   └── index.html
│
└── .gitignore
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git
- VS Code

### 1. Clone the Repository

```bash
git clone https://github.com/PDinesh04/FitTrack.git
cd FitTrack
```

### 2. Backend Setup

Open a terminal:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.venv\Scripts\Activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

## 🔗 API Documentation

FitTrack provides REST APIs for:

- Authentication
- Workouts
- Progress tracking
- Goals
- Analytics
- Notifications
- Workout plans
- Exercise library
- Progress comparison
- Streaks and badges
- Nutrition
- Water tracking
- Recommendations
- Workout timer
- External activities
- Reminders

Explore and test the APIs through FastAPI Swagger UI at `/docs`.

## 🔐 Authentication

FitTrack uses JWT authentication to protect user-specific endpoints.

Users must register and log in to access protected features. Authentication tokens are used when communicating with the backend APIs.

## 🗄️ Database

SQLite is used for data storage, with SQLAlchemy as the ORM.

The database stores user information, workouts, goals, progress, meals, water intake, reminders, and other fitness-related records.

## 🎯 Project Objectives

- Develop a full-stack application using React and FastAPI.
- Implement secure authentication using JWT.
- Build REST APIs and integrate them with a frontend.
- Manage relational database models using SQLAlchemy.
- Implement fitness tracking and analytics workflows.
- Improve practical full-stack development skills.

## 👨‍💻 Author

**Dinesh P**

GitHub: https://github.com/PDinesh04

## 📌 Project Status

Completed – Core backend APIs and frontend modules have been implemented and tested locally.

---

**FitTrack – Track Your Fitness. Monitor Your Progress. Stay Healthy.**
