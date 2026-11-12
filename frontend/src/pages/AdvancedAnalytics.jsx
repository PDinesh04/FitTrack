
import React, { useEffect, useState } from "react";
import api from "../services/api";

function AdvancedAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/advanced-analytics/")
      .then((response) => setData(response.data))
      .catch((err) => {
        setError(
          err.response?.data?.detail ||
          "Unable to load analytics."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p style={styles.error}>{String(error)}</p>;
  if (!data) return <p>No analytics data available.</p>;

  const overall = data.overall || {};
  const monthly = data.monthly || {};

  return (
    <div style={styles.container}>
      <h1>Advanced Fitness Analytics 📊</h1>
      <p>Analyze your fitness performance and activity trends.</p>

      <h2>Overall Performance</h2>

      <div style={styles.grid}>
        <SummaryCard
          title="Total Workouts"
          value={overall.total_workouts ?? 0}
        />
        <SummaryCard
          title="Calories Burned"
          value={`${overall.total_calories ?? 0} kcal`}
        />
        <SummaryCard
          title="Workout Duration"
          value={`${overall.total_duration ?? 0} min`}
        />
      </div>

      <h2>This Month</h2>

      <div style={styles.grid}>
        <SummaryCard
          title="Monthly Workouts"
          value={monthly.workouts ?? 0}
        />
        <SummaryCard
          title="Monthly Calories"
          value={`${monthly.calories ?? 0} kcal`}
        />
      </div>

      <h2>Workout Category Breakdown</h2>

      {data.category_breakdown?.length > 0 ? (
        <div style={styles.card}>
          {data.category_breakdown.map((item) => (
            <div key={item.category} style={styles.categoryRow}>
              <strong>{item.category}</strong>
              <span>{item.count} workouts</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No category data available.</p>
      )}

      <h2>Last 7 Days – Calories Burned</h2>

      {data.weekly_calories?.length > 0 ? (
        <div style={styles.card}>
          {data.weekly_calories.map((item) => {
            const maxCalories = Math.max(
              1,
              ...data.weekly_calories.map((day) => Number(day.calories))
            );

            const width = Math.max(
              0,
              (Number(item.calories) / maxCalories) * 100
            );

            return (
              <div key={item.date} style={styles.day}>
                <div style={styles.dayHeader}>
                  <strong>{item.date}</strong>
                  <span>{item.calories} kcal</span>
                </div>

                <div style={styles.barBackground}>
                  <div
                    style={{
                      ...styles.bar,
                      width: `${width}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No weekly activity data available.</p>
      )}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div style={styles.summaryCard}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "35px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    margin: "20px 0 30px"
  },
  summaryCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "22px",
    textAlign: "center"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    margin: "20px 0 30px"
  },
  categoryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    borderBottom: "1px solid #eee"
  },
  day: {
    marginBottom: "18px"
  },
  dayHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "7px"
  },
  barBackground: {
    background: "#e5e7eb",
    height: "14px",
    borderRadius: "10px",
    overflow: "hidden"
  },
  bar: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "10px"
  },
  error: {
    color: "red",
    textAlign: "center"
  }
};

export default AdvancedAnalytics;
