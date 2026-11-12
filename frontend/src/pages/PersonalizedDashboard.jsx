
import React, { useEffect, useState } from "react";
import api from "../services/api";

function PersonalizedDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/personalized-dashboard/")
      .then((response) => setData(response.data))
      .catch((err) => {
        setError(
          err.response?.data?.detail ||
          "Unable to load personalized dashboard."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{String(error)}</p>;
  if (!data) return <p>No dashboard data available.</p>;

  const summary = data.daily_summary || {};
  const streak = data.streak || {};

  return (
    <div style={styles.container}>
      <h1>My Fitness Dashboard</h1>
      <p>Your personal fitness overview.</p>

      <h2>Today's Summary</h2>
      <div style={styles.grid}>
        <Card
          title="Workouts"
          value={summary.workouts ?? 0}
        />
        <Card
          title="Calories Burned"
          value={summary.calories ?? 0}
        />
        <Card
          title="Current Streak"
          value={`${streak.current_streak ?? 0} days`}
        />
        <Card
          title="Longest Streak"
          value={`${streak.longest_streak ?? 0} days`}
        />
      </div>

      <h2>Upcoming Workouts</h2>
      {data.upcoming_workouts?.length ? (
        <div style={styles.list}>
          {data.upcoming_workouts.map((workout) => (
            <div key={workout.id} style={styles.item}>
              <strong>{workout.title}</strong>
              <p>{workout.description || "No description"}</p>
              <span>{workout.scheduled_date}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No upcoming workouts scheduled.</p>
      )}

      <h2>My Goals</h2>
      {data.goals?.length ? (
        <div style={styles.list}>
          {data.goals.map((goal) => (
            <div key={goal.id} style={styles.item}>
              <strong>{goal.goal_type}</strong>
              <p>
                {goal.current_value} / {goal.target_value}
              </p>
              <p>
                Progress: {Number(goal.progress_percentage ?? 0).toFixed(1)}%
              </p>
              <progress
                value={Math.min(
                  100,
                  Math.max(0, Number(goal.progress_percentage ?? 0))
                )}
                max="100"
                style={{ width: "100%" }}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No goals created yet.</p>
      )}

      <h2>Earned Badges 🏆</h2>
      {data.earned_badges?.length ? (
        <div style={styles.grid}>
          {data.earned_badges.map((badge, index) => (
            <Card
              key={badge.id ?? index}
              title={badge.name}
              value={badge.icon || "🏅"}
            />
          ))}
        </div>
      ) : (
        <p>No badges earned yet.</p>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "30px"
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textAlign: "center"
  },
  list: {
    display: "grid",
    gap: "12px",
    marginBottom: "30px"
  },
  item: {
    padding: "18px",
    border: "1px solid #ddd",
    borderRadius: "10px"
  }
};

export default PersonalizedDashboard;
