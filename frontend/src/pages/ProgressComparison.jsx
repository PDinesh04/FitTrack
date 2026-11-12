
import React, { useEffect, useState } from "react";
import api from "../services/api";

function ProgressComparison() {
  const [weekly, setWeekly] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const [weeklyResponse, monthlyResponse] = await Promise.all([
          api.get("/progress-comparison/weekly"),
          api.get("/progress-comparison/monthly")
        ]);

        setWeekly(weeklyResponse.data);
        setMonthly(monthlyResponse.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          "Unable to load progress comparison."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, []);

  if (loading) return <p style={styles.message}>Loading comparison...</p>;

  if (error) {
    return <p style={styles.error}>{String(error)}</p>;
  }

  const formatChange = (value) => {
    const number = Number(value || 0);
    return `${number > 0 ? "+" : ""}${number.toFixed(1)}%`;
  };

  const ComparisonCard = ({ title, current, previous, change }) => (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>Current: <strong>{current}</strong></p>
      <p>Previous: <strong>{previous}</strong></p>
      <p style={styles.change}>Change: {formatChange(change)}</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1>Progress Comparison</h1>
      <p>Compare your current performance with previous periods.</p>

      {weekly && (
        <>
          <h2>Weekly Comparison</h2>
          <div style={styles.grid}>
            <ComparisonCard
              title="Workouts"
              current={weekly.current_workouts}
              previous={weekly.previous_workouts}
              change={weekly.workouts_change}
            />
            <ComparisonCard
              title="Calories Burned"
              current={weekly.current_calories}
              previous={weekly.previous_calories}
              change={weekly.calories_change}
            />
            <ComparisonCard
              title="Duration (minutes)"
              current={weekly.current_duration}
              previous={weekly.previous_duration}
              change={weekly.duration_change}
            />
          </div>
        </>
      )}

      {monthly && (
        <>
          <h2>Monthly Comparison</h2>
          <div style={styles.grid}>
            <ComparisonCard
              title="Workouts"
              current={monthly.current_workouts}
              previous={monthly.previous_workouts}
              change={monthly.workouts_change}
            />
            <ComparisonCard
              title="Calories Burned"
              current={monthly.current_calories}
              previous={monthly.previous_calories}
              change={monthly.calories_change}
            />
            <ComparisonCard
              title="Duration (minutes)"
              current={monthly.current_duration}
              previous={monthly.previous_duration}
              change={monthly.duration_change}
            />
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "30px"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px"
  },
  change: {
    color: "#2563eb",
    fontWeight: "bold"
  },
  message: {
    textAlign: "center",
    marginTop: "50px"
  },
  error: {
    color: "red",
    textAlign: "center"
  }
};

export default ProgressComparison;

