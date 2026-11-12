
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token =
        response.data?.access_token || response.data?.token;

      if (!token) {
        setError("Login response did not contain a token.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-logo">💪</div>

        <h1>FitTrack</h1>
        <p className="auth-subtitle">
          Your fitness journey starts here.
        </p>

        <h2>Welcome Back!</h2>
        <p className="auth-description">
          Sign in to continue your fitness journey.
        </p>

        {error && (
          <p className="error-message">{String(error)}</p>
        )}

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
