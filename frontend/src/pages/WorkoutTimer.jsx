
import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

function WorkoutTimer() {
  const [workoutName, setWorkoutName] = useState("");
  const [category, setCategory] = useState("Cardio");
  const [caloriesPerMinute, setCaloriesPerMinute] = useState(5);

  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((previous) => previous + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [running]);

  const formatTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const startWorkout = async () => {
    if (!workoutName.trim()) {
      setError("Enter a workout name.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.post("/workout-timer/start", {
        workout_name: workoutName,
        category,
        calories_per_minute: Number(caloriesPerMinute)
      });

      setStarted(true);
      setRunning(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to start workout."
      );
    }
  };

  const stopWorkout = async () => {
    if (seconds < 60) {
      setError("Complete at least one minute before saving.");
      return;
    }

    setRunning(false);
    setSaving(true);
    setError("");

    try {
      const duration = Math.ceil(seconds / 60);

      await api.post(
        "/workout-timer/stop",
        {
          duration,
          workout_date: new Date().toLocaleDateString("en-CA")
        },
        {
          params: {
            workout_name: workoutName,
            category,
            calories_per_minute: Number(caloriesPerMinute)
          }
        }
      );

      setMessage("Workout saved successfully!");

      setSeconds(0);
      setStarted(false);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to save workout."
      );
      setRunning(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Workout Timer ⏱️</h1>
      <p>Track your workout duration and estimated calories.</p>

      <div style={styles.card}>
        <label>Workout Name</label>
        <input
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          disabled={started}
          placeholder="Example: Morning Running"
          style={styles.input}
        />

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={started}
          style={styles.input}
        >
          <option>Cardio</option>
          <option>Strength</option>
          <option>Yoga</option>
        </select>

        <label>Estimated Calories Per Minute</label>
        <input
          type="number"
          min="0.1"
          max="30"
          step="0.1"
          value={caloriesPerMinute}
          onChange={(e) => setCaloriesPerMinute(e.target.value)}
          disabled={started}
          style={styles.input}
        />

        <h1 style={styles.timer}>{formatTime()}</h1>

        <div style={styles.buttons}>
          {!started ? (
            <button onClick={startWorkout} style={styles.start}>
              Start Workout
            </button>
          ) : (
            <>
              <button
                onClick={() => setRunning(!running)}
                style={styles.pause}
                disabled={saving}
              >
                {running ? "Pause" : "Resume"}
              </button>

              <button
                onClick={stopWorkout}
                style={styles.stop}
                disabled={saving || running && seconds < 60}
              >
                {saving ? "Saving..." : "Stop & Save"}
              </button>
            </>
          )}
        </div>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <p>
          Estimated Calories:{" "}
          {Math.round((seconds / 60) * Number(caloriesPerMinute || 0))}
          {" "}kcal
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "650px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial",
    textAlign: "center"
  },
  card: {
    padding: "25px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "7px"
  },
  timer: {
    fontSize: "48px",
    margin: "20px"
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap"
  },
  start: {
    background: "#16a34a",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "7px"
  },
  pause: {
    background: "#d97706",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "7px"
  },
  stop: {
    background: "#dc2626",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "7px"
  },
  success: {
    color: "green"
  },
  error: {
    color: "red"
  }
};

export default WorkoutTimer;
