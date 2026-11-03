
import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  workout_name: "",
  category: "Cardio",
  duration: "",
  calories_burned: "",
  workout_date: new Date().toISOString().split("T")[0],
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/workouts/");
      setWorkouts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setError(
        err.response?.data?.detail || "Unable to load workouts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      workout_date: new Date().toISOString().split("T")[0],
    });
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    const workoutData = {
      workout_name: form.workout_name.trim(),
      category: form.category,
      duration: Number(form.duration),
      calories_burned: Number(form.calories_burned),
      workout_date: form.workout_date,
    };

    try {
      if (editingId !== null) {
        await api.put(`/workouts/${editingId}`, workoutData);
      } else {
        await api.post("/workouts/", workoutData);
      }

      resetForm();
      await fetchWorkouts();
    } catch (err) {
      console.error("Error saving workout:", err);

      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to save workout. Please check the entered values."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (workout) => {
    setEditingId(workout.id);

    setForm({
      workout_name: workout.workout_name || "",
      category: workout.category || "Cardio",
      duration: workout.duration ?? "",
      calories_burned: workout.calories_burned ?? "",
      workout_date: workout.workout_date
        ? String(workout.workout_date).split("T")[0]
        : new Date().toISOString().split("T")[0],
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (workoutId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/workouts/${workoutId}`);

      if (editingId === workoutId) {
        resetForm();
      }

      await fetchWorkouts();
    } catch (err) {
      console.error("Error deleting workout:", err);

      setError(
        err.response?.data?.detail || "Unable to delete workout."
      );
    }
  };

  const categories = [
    "All",
    ...new Set(
      workouts.map((workout) => workout.category).filter(Boolean)
    ),
  ];

  const filteredWorkouts = workouts.filter((workout) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (workout.workout_name || "").toLowerCase().includes(searchText) ||
      (workout.category || "").toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All" ||
      workout.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalCalories = filteredWorkouts.reduce(
    (total, workout) => total + Number(workout.calories_burned || 0),
    0
  );

  const totalDuration = filteredWorkouts.reduce(
    (total, workout) => total + Number(workout.duration || 0),
    0
  );

  return (
    <div className="workouts-page">
      <div className="workouts-header">
        <div>
          <h1>Workout Management</h1>
          <p>Track your workouts and manage your fitness history.</p>
        </div>

        <button
          type="button"
          className="workout-refresh-button"
          onClick={fetchWorkouts}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="workout-error">
          {error}
        </div>
      )}

      <div className="workout-form-card">
        <h2>
          {editingId !== null ? "Edit Workout" : "Add New Workout"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="workout-form-grid">
            <div className="workout-field">
              <label htmlFor="workout_name">Workout Name</label>

              <input
                id="workout_name"
                name="workout_name"
                type="text"
                placeholder="Example: Running"
                value={form.workout_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="workout-field">
              <label htmlFor="category">Category</label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="Cardio">Cardio</option>
                <option value="Strength">Strength</option>
                <option value="Yoga">Yoga</option>
                <option value="Cycling">Cycling</option>
                <option value="Swimming">Swimming</option>
                <option value="Walking">Walking</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="workout-field">
              <label htmlFor="duration">Duration (minutes)</label>

              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="45"
                value={form.duration}
                onChange={handleChange}
                required
              />
            </div>

            <div className="workout-field">
              <label htmlFor="calories_burned">Calories Burned</label>

              <input
                id="calories_burned"
                name="calories_burned"
                type="number"
                min="0"
                placeholder="300"
                value={form.calories_burned}
                onChange={handleChange}
                required
              />
            </div>

            <div className="workout-field">
              <label htmlFor="workout_date">Workout Date</label>

              <input
                id="workout_date"
                name="workout_date"
                type="date"
                value={form.workout_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="workout-form-actions">
            <button
              type="submit"
              className="workout-submit-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                ? "Update Workout"
                : "Add Workout"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="workout-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="workout-summary-grid">
        <div className="workout-summary-card">
          <span>Total Workouts</span>
          <h2>{filteredWorkouts.length}</h2>
        </div>

        <div className="workout-summary-card">
          <span>Calories Burned</span>
          <h2>{totalCalories} kcal</h2>
        </div>

        <div className="workout-summary-card">
          <span>Total Duration</span>
          <h2>{totalDuration} min</h2>
        </div>
      </div>

      <div className="workout-history-card">
        <div className="workout-history-header">
          <div>
            <h2>Workout History</h2>
            <p>Search and manage your completed workouts.</p>
          </div>
        </div>

        <div className="workout-filter-row">
          <input
            type="text"
            placeholder="Search workout..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="workout-loading">Loading workouts...</p>
        ) : filteredWorkouts.length === 0 ? (
          <div className="workout-empty-state">
            <h3>No workouts found</h3>
            <p>Add a workout or change your search filters.</p>
          </div>
        ) : (
          <div className="workout-table-wrapper">
            <table className="workout-table">
              <thead>
                <tr>
                  <th>Workout</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Calories</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredWorkouts.map((workout) => (
                  <tr key={workout.id}>
                    <td>{workout.workout_name}</td>

                    <td>
                      <span className="workout-category-badge">
                        {workout.category}
                      </span>
                    </td>

                    <td>{workout.duration} min</td>

                    <td>{workout.calories_burned} kcal</td>

                    <td>
                      {workout.workout_date
                        ? String(workout.workout_date).split("T")[0]
                        : "-"}
                    </td>

                    <td>
                      <div className="workout-action-buttons">
                        <button
                          type="button"
                          className="workout-edit-button"
                          onClick={() => handleEdit(workout)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="workout-delete-button"
                          onClick={() => handleDelete(workout.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
