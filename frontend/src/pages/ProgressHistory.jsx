
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";
import "./ProgressHistory.css";

function ProgressHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch daily summaries for the last 7 days.
      const today = new Date();
      const requests = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dateString = [
          date.getFullYear(),
          String(date.getMonth() + 1).padStart(2, "0"),
          String(date.getDate()).padStart(2, "0"),
        ].join("-");

        requests.push(
          api.get("/progress/daily", {
            params: { progress_date: dateString },
          })
        );
      }

      const responses = await Promise.all(requests);

      const data = responses.map((response) => ({
        date: response.data.date,
        workouts: response.data.total_workouts,
        calories: response.data.total_calories,
      }));

      setHistory(data);
    } catch (err) {
      console.error("Progress history error:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load progress history."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Progress History</h1>
        <p>Your workout and calorie activity for the last 7 days.</p>
      </div>

      {loading && <p>Loading progress history...</p>}

      {error && <p className="history-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="history-summary">
            <div className="history-card">
              <h3>Total Workouts</h3>
              <p>
                {history.reduce(
                  (sum, item) => sum + item.workouts,
                  0
                )}
              </p>
            </div>

            <div className="history-card">
              <h3>Total Calories</h3>
              <p>
                {history.reduce(
                  (sum, item) => sum + item.calories,
                  0
                )}
              </p>
            </div>
          </div>

          <div className="history-chart-card">
            <h2>Calories Burned</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="history-chart-card">
            <h2>Workouts Completed</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="workouts"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default ProgressHistory;
