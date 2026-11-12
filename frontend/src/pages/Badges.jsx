
import React, { useEffect, useState } from "react";
import api from "../services/api";

function Badges() {
  const [badges, setBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBadges = async () => {
    try {
      setError("");

      // Update streak before checking badge eligibility
      await api.get("/streak/me");

      // Check and award eligible badges
      await api.post("/badges/check");

      const [earnedResponse, allResponse] = await Promise.all([
        api.get("/badges/me"),
        api.get("/badges/all")
      ]);

      setBadges(earnedResponse.data);
      setAllBadges(allResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load achievement badges."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  if (loading) return <p>Loading badges...</p>;

  if (error) {
    return <p style={styles.error}>{String(error)}</p>;
  }

  const earnedIds = badges.map((item) => item.badge_id);

  return (
    <div style={styles.container}>
      <h1>Achievement Badges 🏆</h1>
      <p>Complete fitness milestones and unlock achievements.</p>

      <h2>Your Earned Badges ({badges.length})</h2>

      {badges.length === 0 ? (
        <p>You haven't earned any badges yet. Keep working out!</p>
      ) : (
        <div style={styles.grid}>
          {badges.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.icon}>
                {item.badge?.icon || "🏅"}
              </div>
              <h3>{item.badge?.name || "Achievement"}</h3>
              <p>{item.badge?.description}</p>
            </div>
          ))}
        </div>
      )}

      <h2>All Available Badges</h2>

      <div style={styles.grid}>
        {allBadges.map((badge) => {
          const earned = earnedIds.includes(badge.id);

          return (
            <div
              key={badge.id}
              style={{
                ...styles.card,
                opacity: earned ? 1 : 0.5
              }}
            >
              <div style={styles.icon}>
                {badge.icon || "🏅"}
              </div>
              <h3>{badge.name}</h3>
              <p>{badge.description}</p>
              <strong>
                {earned ? "Unlocked ✓" : "Not unlocked"}
              </strong>
            </div>
          );
        })}
      </div>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    margin: "20px 0 35px"
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "22px",
    textAlign: "center"
  },
  icon: {
    fontSize: "45px"
  },
  error: {
    color: "red",
    textAlign: "center"
  }
};

export default Badges;
