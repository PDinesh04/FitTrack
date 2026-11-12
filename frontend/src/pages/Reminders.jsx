
import React, { useEffect, useState } from "react";
import api from "../services/api";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    message: "",
    reminder_type: "Workout",
    reminder_time: "07:00",
    reminder_date: new Date().toLocaleDateString("en-CA")
  });

  const fetchReminders = async () => {
    try {
      const response = await api.get("/reminders/");
      setReminders(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load reminders."
      );
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const createReminder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/reminders/", form);

      setMessage("Reminder created successfully!");

      setForm({
        title: "",
        message: "",
        reminder_type: "Workout",
        reminder_time: "07:00",
        reminder_date: new Date().toLocaleDateString("en-CA")
      });

      await fetchReminders();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to create reminder."
      );
    } finally {
      setLoading(false);
    }
  };

  const completeReminder = async (id) => {
    try {
      await api.patch(`/reminders/${id}`, {
        is_completed: true
      });

      await fetchReminders();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to update reminder."
      );
    }
  };

  const deleteReminder = async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      await fetchReminders();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to delete reminder."
      );
    }
  };

  return (
    <div style={styles.container}>
      <h1>In-App Reminders & Alerts 🔔</h1>
      <p>Schedule and manage your fitness reminders.</p>

      <div style={styles.card}>
        <h2>Create Reminder</h2>

        <form onSubmit={createReminder} style={styles.form}>
          <input
            name="title"
            placeholder="Reminder title"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <textarea
            name="message"
            placeholder="Reminder message"
            value={form.message}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Reminder Type</label>
          <select
            name="reminder_type"
            value={form.reminder_type}
            onChange={handleChange}
            style={styles.input}
          >
            <option>Workout</option>
            <option>Water</option>
            <option>Meal</option>
            <option>General</option>
          </select>

          <label>Reminder Time</label>
          <input
            type="time"
            name="reminder_time"
            value={form.reminder_time}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label>Reminder Date</label>
          <input
            type="date"
            name="reminder_date"
            value={form.reminder_date}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Saving..." : "Create Reminder"}
          </button>
        </form>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{String(error)}</p>}
      </div>

      <h2>My Reminders</h2>

      {reminders.length === 0 ? (
        <p>No reminders created yet.</p>
      ) : (
        <div style={styles.list}>
          {reminders.map((reminder) => (
            <div key={reminder.id} style={styles.reminder}>
              <div>
                <h3>{reminder.title}</h3>
                <p>{reminder.message}</p>
                <p>Type: {reminder.reminder_type}</p>
                <p>
                  Date: {reminder.reminder_date} |
                  Time: {reminder.reminder_time}
                </p>

                <strong
                  style={{
                    color: reminder.is_completed ? "green" : "#d97706"
                  }}
                >
                  {reminder.is_completed ? "Completed" : "Pending"}
                </strong>
              </div>

              <div style={styles.actions}>
                {!reminder.is_completed && (
                  <button
                    onClick={() => completeReminder(reminder.id)}
                    style={styles.completeButton}
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
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
    padding: "22px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    marginBottom: "30px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "7px",
    fontFamily: "Arial"
  },
  button: {
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer"
  },
  list: {
    display: "grid",
    gap: "15px"
  },
  reminder: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    padding: "18px",
    border: "1px solid #ddd",
    borderRadius: "10px"
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },
  completeButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  success: {
    color: "green"
  },
  error: {
    color: "red"
  }
};

export default Reminders;
