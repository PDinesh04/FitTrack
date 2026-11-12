
import React, { useEffect, useState } from "react";
import api from "../services/api";

function Streak() {
  const [streak, setStreak] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/streak/me")
      .then((response) => setStreak(response.data))
      .catch(() => setError("Failed to load streak"));
  }, []);

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>🔥 Workout Streak</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Current Streak: {streak?.current_streak ?? 0} Days</h2>
      <h2>Longest Streak: {streak?.longest_streak ?? 0} Days</h2>
    </div>
  );
}

export default Streak;
