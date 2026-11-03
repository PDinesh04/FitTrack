
import { useState } from "react";
import api from "../services/api";
import "./Progress.css";

function Progress() {
  const [progressDate, setProgressDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProgress = async () => {
    if (!progressDate) {
      setError("Please select a date.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/progress/daily", {
        params: {
          progress_date: progressDate,
        },
      });

      setProgress(response.data);
    } catch (err) {
      console.error("Progress API error:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load progress. Please try again."
      );
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>Daily Progress</h1>
        <p>Track your workouts and calories burned.</p>
      </div>

      <div className="progress-filter">
        <label htmlFor="progress-date">Select Date</label>

        <input
          id="progress-date"
          type="date"
          value={progressDate}
          onChange={(e) => setProgressDate(e.target.value)}
        />

        <button onClick={fetchProgress} disabled={loading}>
          {loading ? "Loading..." : "View Progress"}
        </button>
      </div>

      {error && <p className="progress-error">{error}</p>}

      {progress && (
        <div className="progress-cards">
          <div className="progress-card">
            <div className="progress-icon">🏋️</div>
            <h3>Total Workouts</h3>
            <p className="progress-value">
              {progress.total_workouts}
            </p>
            <span>Workouts completed</span>
          </div>

          <div className="progress-card">
            <div className="progress-icon">🔥</div>
            <h3>Calories Burned</h3>
            <p className="progress-value">
              {progress.total_calories}
            </p>
            <span>Calories burned</span>
          </div>

          <div className="progress-card">
            <div className="progress-icon">📅</div>
            <h3>Progress Date</h3>
            <p className="progress-date">
              {progress.date}
            </p>
            <span>Selected day</span>
          </div>
        </div>
      )}

      {!progress && !loading && !error && (
        <div className="progress-empty">
          <h3>Check your daily progress</h3>
          <p>
            Select a date and click View Progress to see your
            workout summary.
          </p>
        </div>
      )}
    </div>
  );
}

export default Progress;
