
import React, { useEffect, useState } from "react";
import api from "../services/api";

function Recommendations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/recommendations/")
      .then((response) => setData(response.data))
      .catch((err) => {
        setError(
          err.response?.data?.detail ||
          "Unable to load workout recommendations."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading recommendations...</p>;

  if (error) {
    return <p style={styles.error}>{String(error)}</p>;
  }

  if (!data) return <p>No recommendations available.</p>;

  return (
    <div style={styles.container}>
      <h1>AI Workout Suggestions 🤖</h1>
      <p>Discover exercises based on your fitness activity.</p>

      <div style={styles.summary}>
        <h2>Recommended Category: {data.preferred_category}</h2>
        <p>{data.reason}</p>
        <p>Total Workouts: {data.total_workouts}</p>
        <p>Current Streak: {data.current_streak} days</p>
      </div>

      <h2>Recommended Exercises</h2>

      {data.recommendations?.length > 0 ? (
        <div style={styles.grid}>
          {data.recommendations.map((exercise) => (
            <div key={exercise.id} style={styles.card}>
              <h3>{exercise.name}</h3>
              <span style={styles.category}>
                {exercise.category}
              </span>
              <p>
                {exercise.description || "No description available"}
              </p>
              <p>
                Duration: {exercise.duration} minutes
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>
          No exercises available. Add exercises to your Exercise Library first.
        </p>
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
  summary: {
    padding: "22px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    margin: "25px 0"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px"
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px"
  },
  category: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "5px 10px",
    borderRadius: "15px"
  },
  error: {
    color: "red",
    textAlign: "center"
  }
};

export default Recommendations;
