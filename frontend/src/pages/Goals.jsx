
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Goals.css";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    goal_type: "Weight Loss",
    target_value: "",
    current_value: 0,
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get("/goals/");
      setGoals(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load goals.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createGoal = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/goals/", {
        goal_type: form.goal_type,
        target_value: Number(form.target_value),
        current_value: Number(form.current_value),
        deadline: form.deadline,
      });

      setForm({
        goal_type: "Weight Loss",
        target_value: "",
        current_value: 0,
        deadline: "",
      });

      await fetchGoals();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to create goal.");
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (goal) => {
    const value = window.prompt(
      `Enter current progress for ${goal.goal_type}:`,
      goal.current_value
    );

    if (value === null || value.trim() === "") return;

    const currentValue = Number(value);

    if (!Number.isFinite(currentValue) || currentValue < 0) {
      setError("Enter a valid progress value.");
      return;
    }

    try {
      setError("");

      await api.put(`/goals/${goal.id}`, {
        current_value: currentValue,
      });

      await fetchGoals();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update progress.");
    }
  };

  const deleteGoal = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) {
      return;
    }

    try {
      setError("");
      await api.delete(`/goals/${goalId}`);
      await fetchGoals();
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete goal.");
    }
  };

  const getPercentage = (goal) => {
    if (goal.target_value <= 0) return 0;

    return Math.min(
      100,
      Math.round((goal.current_value / goal.target_value) * 100)
    );
  };

  return (
    <div className="goals-page">
      <header className="goals-header">
        <h1>Workout Goals</h1>
        <p>Set your fitness targets and track your progress.</p>
      </header>

      {error && <p className="goals-error">{error}</p>}

      <section className="goal-form-card">
        <h2>Create New Goal</h2>

        <form onSubmit={createGoal}>
          <div className="goal-form-grid">
            <div>
              <label>Goal Type</label>
              <select
                name="goal_type"
                value={form.goal_type}
                onChange={handleChange}
                required
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Steps">Steps</option>
              </select>
            </div>

            <div>
              <label>Target Value</label>
              <input
                type="number"
                name="target_value"
                min="1"
                value={form.target_value}
                onChange={handleChange}
                placeholder="Enter target"
                required
              />
            </div>

            <div>
              <label>Current Value</label>
              <input
                type="number"
                name="current_value"
                min="0"
                value={form.current_value}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Goal"}
          </button>
        </form>
      </section>

      <section className="goals-list-section">
        <h2>My Goals</h2>

        {goals.length === 0 ? (
          <div className="goals-empty">
            <h3>No goals yet</h3>
            <p>Create your first fitness goal above.</p>
          </div>
        ) : (
          <div className="goals-grid">
            {goals.map((goal) => {
              const percentage = getPercentage(goal);
              const completed = percentage >= 100;

              return (
                <article className="goal-card" key={goal.id}>
                  <div className="goal-card-top">
                    <h3>{goal.goal_type}</h3>
                    <span className={completed ? "goal-completed" : "goal-active"}>
                      {completed ? "Completed" : "In Progress"}
                    </span>
                  </div>

                  <div className="goal-values">
                    <strong>
                      {goal.current_value} / {goal.target_value}
                    </strong>
                    <span>{percentage}%</span>
                  </div>

                  <div className="goal-progress-track">
                    <div
                      className="goal-progress-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="goal-deadline">
                    Deadline: {goal.deadline}
                  </p>

                  <div className="goal-actions">
                    <button onClick={() => updateProgress(goal)}>
                      Update Progress
                    </button>

                    <button
                      className="goal-delete-button"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Goals;
