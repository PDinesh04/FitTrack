
import React, { useEffect, useState } from "react";
import api from "../services/api";

function WorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduled_date: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPlans = async () => {
    try {
      const response = await api.get("/workout-plans/");
      setPlans(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load workout plans.");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/workout-plans/", form);
      setForm({ title: "", description: "", scheduled_date: "" });
      await fetchPlans();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create plan.");
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id) => {
    try {
      await api.delete(`/workout-plans/${id}`);
      fetchPlans();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete plan.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Workout Plans</h1>
      <p>Plan and schedule your fitness activities.</p>

      <form onSubmit={addPlan} style={styles.form}>
        <input
          name="title"
          placeholder="Workout title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="scheduled_date"
          value={form.scheduled_date}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Workout Plan"}
        </button>
      </form>

      {error && <p style={styles.error}>{String(error)}</p>}

      <h2>Your Scheduled Workouts</h2>

      {plans.length === 0 ? (
        <p>No workout plans found. Add your first plan above.</p>
      ) : (
        <div style={styles.list}>
          {plans.map((plan) => (
            <div key={plan.id} style={styles.card}>
              <div>
                <h3>{plan.title}</h3>
                <p>{plan.description || "No description"}</p>
                <strong>{plan.scheduled_date}</strong>
              </div>

              <button
                type="button"
                onClick={() => deletePlan(plan.id)}
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
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "30px"
  },
  list: {
    display: "grid",
    gap: "15px"
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    border: "1px solid #ddd",
    borderRadius: "10px"
  },
  deleteButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  error: {
    color: "red"
  }
};

export default WorkoutPlans;
