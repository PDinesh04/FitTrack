
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setError("");

      const [analyticsResponse, workoutsResponse, goalsResponse] =
        await Promise.all([
          api.get("/analytics"),
          api.get("/workouts/"),
          api.get("/goals/"),
        ]);

      setAnalytics(analyticsResponse.data);
      setWorkouts(workoutsResponse.data);
      setGoals(goalsResponse.data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load dashboard information."
      );
    }
  };

  const totalWorkouts = analytics?.total_workouts ?? workouts.length;
  const totalCalories = analytics?.total_calories ?? 0;
  const activeGoals = goals.filter(
    (goal) => goal.current_value < goal.target_value
  ).length;

  const recentWorkouts = [...workouts]
    .sort(
      (a, b) =>
        new Date(b.workout_date) - new Date(a.workout_date)
    )
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Welcome to FitTrack</h1>
          <p>Your personal fitness dashboard</p>
        </div>
      </header>

      {error && <p className="dashboard-error">{error}</p>}

      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-icon">🏋️</span>
          <h3>Total Workouts</h3>
          <p>{totalWorkouts}</p>
        </div>

        <div className="dashboard-stat-card">
          <span className="dashboard-stat-icon">🔥</span>
          <h3>Calories Burned</h3>
          <p>{totalCalories}</p>
        </div>

        <div className="dashboard-stat-card">
          <span className="dashboard-stat-icon">🎯</span>
          <h3>Active Goals</h3>
          <p>{activeGoals}</p>
        </div>
      </section>

      <section className="dashboard-quick-links">
        <h2>Quick Access</h2>

        <div className="dashboard-links-grid">
          <Link to="/workouts" className="dashboard-link-card">
            <span>🏋️</span>
            <h3>Workouts</h3>
            <p>Manage your workout sessions</p>
          </Link>

          <Link to="/progress" className="dashboard-link-card">
            <span>📊</span>
            <h3>Daily Progress</h3>
            <p>Check your daily activity</p>
          </Link>

          <Link
            to="/progress-history"
            className="dashboard-link-card"
          >
            <span>📈</span>
            <h3>Progress History</h3>
            <p>View your weekly trends</p>
          </Link>

          <Link to="/goals" className="dashboard-link-card">
            <span>🎯</span>
            <h3>Goals</h3>
            <p>Track your fitness targets</p>
          </Link>

          <Link to="/analytics" className="dashboard-link-card">
            <span>📉</span>
            <h3>Analytics</h3>
            <p>Explore your fitness statistics</p>
          </Link>

          <Link
            to="/notifications"
            className="dashboard-link-card"
          >
            <span>🔔</span>
            <h3>Notifications</h3>
            <p>View your fitness updates</p>
          </Link>
        </div>
      </section>

      <section className="dashboard-recent">
        <div className="dashboard-section-heading">
          <h2>Recent Workouts</h2>
          <Link to="/workouts">View All</Link>
        </div>

        {recentWorkouts.length === 0 ? (
          <div className="dashboard-empty">
            <p>No workouts recorded yet.</p>
            <Link to="/workouts">Add your first workout</Link>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Workout</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Calories</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentWorkouts.map((workout) => (
                  <tr key={workout.id}>
                    <td>{workout.workout_name}</td>
                    <td>{workout.category}</td>
                    <td>{workout.duration} min</td>
                    <td>{workout.calories_burned}</td>
                    <td>{workout.workout_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
