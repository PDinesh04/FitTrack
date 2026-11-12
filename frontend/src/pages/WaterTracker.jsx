
import React, { useEffect, useState } from "react";
import api from "../services/api";

function WaterTracker() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({
    total_ml: 0,
    total_liters: 0,
    daily_goal: 2500,
    progress_percentage: 0,
    remaining_ml: 2500
  });

  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWater = async () => {
    try {
      const [recordsResponse, summaryResponse] = await Promise.all([
        api.get("/water/"),
        api.get("/water/daily-summary")
      ]);

      setRecords(recordsResponse.data);
      setSummary(summaryResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load water records."
      );
    }
  };

  useEffect(() => {
    fetchWater();
  }, []);

  const addWater = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/water/", {
        quantity: Number(quantity),
        date: new Date().toLocaleDateString("en-CA")
      });

      setQuantity("");
      await fetchWater();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to save water intake."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteWater = async (id) => {
    try {
      await api.delete(`/water/${id}`);
      await fetchWater();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete record.");
    }
  };

  const progress = Math.min(
    100,
    Math.max(0, Number(summary.progress_percentage || 0))
  );

  return (
    <div style={styles.container}>
      <h1>Water Intake Tracker 💧</h1>
      <p>Stay hydrated and track your daily water consumption.</p>

      <div style={styles.card}>
        <h2>Today's Water Intake</h2>
        <h1>{summary.total_ml ?? 0} ml</h1>
        <p>Daily Goal: {summary.daily_goal ?? 2500} ml</p>

        <div style={styles.progressBackground}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`
            }}
          />
        </div>

        <h3>{progress.toFixed(1)}% Completed</h3>
        <p>Remaining: {summary.remaining_ml ?? 0} ml</p>
      </div>

      <h2>Log Water Intake</h2>

      <form onSubmit={addWater} style={styles.form}>
        <input
          type="number"
          placeholder="Enter quantity in ml"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          max="10000"
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Saving..." : "Add Water"}
        </button>
      </form>

      {error && <p style={styles.error}>{String(error)}</p>}

      <h2>Water History</h2>

      {records.length === 0 ? (
        <p>No water records found.</p>
      ) : (
        <div style={styles.list}>
          {records.map((record) => (
            <div key={record.id} style={styles.record}>
              <div>
                <strong>{record.quantity} ml</strong>
                <p>{record.date}</p>
              </div>

              <button
                onClick={() => deleteWater(record.id)}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "35px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  card: {
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    textAlign: "center",
    margin: "25px 0"
  },
  progressBackground: {
    height: "15px",
    background: "#ddd",
    borderRadius: "10px",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    background: "#0ea5e9",
    transition: "width 0.3s"
  },
  form: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    margin: "20px 0"
  },
  input: {
    padding: "12px",
    flex: "1",
    minWidth: "200px",
    border: "1px solid #ccc",
    borderRadius: "7px"
  },
  button: {
    padding: "12px 20px",
    background: "#0284c7",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer"
  },
  list: {
    display: "grid",
    gap: "12px"
  },
  record: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px"
  },
  deleteButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "9px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  error: {
    color: "red"
  }
};

export default WaterTracker;
