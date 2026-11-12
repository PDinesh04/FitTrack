
import React, { useEffect, useState } from "react";
import api from "../services/api";

function ExternalActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    provider: "Health Connect",
    activity_name: "",
    steps: 0,
    calories: 0,
    duration: 0,
    activity_date: new Date().toLocaleDateString("en-CA")
  });

  const fetchActivities = async () => {
    try {
      const response = await api.get("/external-activities/");
      setActivities(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load activities."
      );
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const importActivity = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/external-activities/", {
        ...form,
        steps: Number(form.steps),
        calories: Number(form.calories),
        duration: Number(form.duration)
      });

      setMessage("Activity imported successfully!");

      setForm({
        provider: "Health Connect",
        activity_name: "",
        steps: 0,
        calories: 0,
        duration: 0,
        activity_date: new Date().toLocaleDateString("en-CA")
      });

      await fetchActivities();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Activity import failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>External Fitness Activities</h1>
      <p>Import activity records from external fitness platforms.</p>

      <div style={styles.card}>
        <h2>Import Activity</h2>

        <form onSubmit={importActivity} style={styles.form}>
          <label>Fitness Provider</label>
          <select
            name="provider"
            value={form.provider}
            onChange={handleChange}
            style={styles.input}
          >
            <option>Google Fit</option>
            <option>Apple Health</option>
            <option>Health Connect</option>
          </select>

          <label>Activity Name</label>
          <input
            name="activity_name"
            placeholder="Example: Walking"
            value={form.activity_name}
            onChange={handleChange}
            required
            minLength={2}
            style={styles.input}
          />

          <label>Steps</label>
          <input
            type="number"
            name="steps"
            value={form.steps}
            onChange={handleChange}
            min="0"
            style={styles.input}
          />

          <label>Calories Burned</label>
          <input
            type="number"
            name="calories"
            value={form.calories}
            onChange={handleChange}
            min="0"
            style={styles.input}
          />

          <label>Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            min="0"
            style={styles.input}
          />

          <label>Activity Date</label>
          <input
            type="date"
            name="activity_date"
            value={form.activity_date}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Importing..." : "Import Activity"}
          </button>
        </form>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{String(error)}</p>}
      </div>

      <h2>Imported Activities</h2>

      {activities.length === 0 ? (
        <p>No external activities imported yet.</p>
      ) : (
        <div style={styles.grid}>
          {activities.map((activity) => (
            <div key={activity.id} style={styles.card}>
              <h3>{activity.activity_name}</h3>
              <p>Provider: {activity.provider}</p>
              <p>Steps: {activity.steps}</p>
              <p>Calories: {activity.calories} kcal</p>
              <p>Duration: {activity.duration} minutes</p>
              <p>Date: {activity.activity_date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "35px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "7px"
  },
  button: {
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "15px"
  },
  success: {
    color: "green"
  },
  error: {
    color: "red"
  }
};

export default ExternalActivities;
