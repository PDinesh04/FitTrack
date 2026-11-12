
import React, { useEffect, useState } from "react";
import api from "../services/api";

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const fetchExercises = async () => {
    try {
      setError("");

      const response = await api.get("/exercises/", {
        params: {
          search: search || undefined,
          category: category || undefined
        }
      });

      setExercises(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load exercises."
      );
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [search, category]);

  return (
    <div style={styles.container}>
      <h1>Exercise Library</h1>
      <p>Explore exercises and find activities for your fitness goals.</p>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        >
          <option value="">All Categories</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="Yoga">Yoga</option>
        </select>
      </div>

      {error && <p style={styles.error}>{String(error)}</p>}

      {exercises.length === 0 ? (
        <p>No exercises found.</p>
      ) : (
        <div style={styles.grid}>
          {exercises.map((exercise) => (
            <div key={exercise.id} style={styles.card}>
              <h3>{exercise.name}</h3>
              <p>{exercise.description || "No description available"}</p>
              <span style={styles.category}>
                {exercise.category}
              </span>
              <p>Duration: {exercise.duration} minutes</p>
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
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  filters: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    margin: "25px 0"
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    flex: "1",
    minWidth: "200px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "18px"
  },
  category: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "5px 10px",
    borderRadius: "15px"
  },
  error: {
    color: "red"
  }
};

export default ExerciseLibrary;
