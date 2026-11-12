
import React, { useEffect, useState } from "react";
import api from "../services/api";

function Nutrition() {
  const [meals, setMeals] = useState([]);
  const [summary, setSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  const [form, setForm] = useState({
    meal_type: "Breakfast",
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMeals = async () => {
    try {
      const [mealResponse, summaryResponse] = await Promise.all([
        api.get("/meals/"),
        api.get("/meals/daily-summary")
      ]);

      setMeals(mealResponse.data);
      setSummary(summaryResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load meal information."
      );
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const addMeal = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/meals/", {
        ...form,
        calories: Number(form.calories),
        protein: Number(form.protein || 0),
        carbs: Number(form.carbs || 0),
        fats: Number(form.fats || 0)
      });

      setForm({
        meal_type: "Breakfast",
        food_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: ""
      });

      await fetchMeals();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to add meal."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (id) => {
    try {
      await api.delete(`/meals/${id}`);
      await fetchMeals();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete meal.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Nutrition & Meal Tracking</h1>
      <p>Track your daily food intake and nutrition.</p>

      <h2>Today's Nutrition Summary</h2>

      <div style={styles.grid}>
        <SummaryCard title="Calories" value={summary.calories ?? 0} />
        <SummaryCard title="Protein (g)" value={summary.protein ?? 0} />
        <SummaryCard title="Carbs (g)" value={summary.carbs ?? 0} />
        <SummaryCard title="Fats (g)" value={summary.fats ?? 0} />
      </div>

      <h2>Add a Meal</h2>

      <form onSubmit={addMeal} style={styles.form}>
        <select
          name="meal_type"
          value={form.meal_type}
          onChange={handleChange}
          style={styles.input}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snacks</option>
        </select>

        <input
          name="food_name"
          placeholder="Food name"
          value={form.food_name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={form.calories}
          onChange={handleChange}
          min="0"
          required
          style={styles.input}
        />

        <input
          type="number"
          name="protein"
          placeholder="Protein (g)"
          value={form.protein}
          onChange={handleChange}
          min="0"
          style={styles.input}
        />

        <input
          type="number"
          name="carbs"
          placeholder="Carbs (g)"
          value={form.carbs}
          onChange={handleChange}
          min="0"
          style={styles.input}
        />

        <input
          type="number"
          name="fats"
          placeholder="Fats (g)"
          value={form.fats}
          onChange={handleChange}
          min="0"
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Saving..." : "Add Meal"}
        </button>
      </form>

      {error && <p style={styles.error}>{String(error)}</p>}

      <h2>Meal History</h2>

      {meals.length === 0 ? (
        <p>No meals recorded yet.</p>
      ) : (
        <div style={styles.list}>
          {meals.map((meal) => (
            <div key={meal.id} style={styles.meal}>
              <div>
                <h3>{meal.food_name}</h3>
                <p>{meal.meal_type}</p>
                <p>Calories: {meal.calories} kcal</p>
                <p>
                  Protein: {meal.protein}g | Carbs: {meal.carbs}g |
                  Fats: {meal.fats}g
                </p>
              </div>

              <button
                onClick={() => deleteMeal(meal.id)}
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

function SummaryCard({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "30px"
  },
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textAlign: "center"
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    marginBottom: "30px"
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "7px"
  },
  button: {
    padding: "12px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer"
  },
  list: {
    display: "grid",
    gap: "15px"
  },
  meal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "18px"
  },
  deleteButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  error: {
    color: "red"
  }
};

export default Nutrition;
