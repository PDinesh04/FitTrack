
import React, { useEffect, useState } from "react";
import api from "../services/api";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await api.get("/analytics");
        setAnalytics(response.data);
      } catch (err) {
        setError("Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="workouts-page">Loading analytics...</div>;
  }

  if (error) {
    return <div className="workouts-page error-message">{error}</div>;
  }

  return (
    <div className="workouts-page">
      <h1>Fitness Analytics</h1>
      <p>Review your workout performance.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Workouts</h3>
          <h2>{analytics?.total_workouts ?? 0}</h2>
        </div>

        <div className="stat-card">
          <h3>Calories Burned</h3>
          <h2>{analytics?.total_calories ?? 0}</h2>
        </div>

        <div className="stat-card">
          <h3>Active Minutes</h3>
          <h2>{analytics?.total_duration ?? 0}</h2>
        </div>
      </div>

      <section className="workout-list">
        <h2>Summary</h2>
        <p>
          Keep recording workouts to understand your fitness progress over time.
        </p>
      </section>
    </div>
  );
}

export default Analytics;
