
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await API.post("/auth/register", form);
      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-logo">💪</div>

        <h1>FitTrack</h1>
        <p className="auth-subtitle">
          Start your fitness journey today.
        </p>

        <h2>Create Account</h2>
        <p className="auth-description">
          Join FitTrack and achieve your fitness goals.
        </p>

        <label>Username</label>
        <input
          name="username"
          type="text"
          placeholder="Enter username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          required
        />

        <label>Email Address</label>
        <input
          name="email"
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Minimum 8 characters"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          minLength={8}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>

        {message && (
          <p className="auth-description">{message}</p>
        )}

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
