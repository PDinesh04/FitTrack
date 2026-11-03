
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications/");
      setNotifications(response.data);
    } catch (err) {
      console.error("Notifications error:", err);
      setError(
        err.response?.data?.detail ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notification) => {
    try {
      // This endpoint must exist in your backend.
      await api.put(`/notifications/${notification.id}/read`);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? { ...item, is_read: true }
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to mark notification as read."
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your fitness activities.</p>
        </div>

        <div className="notification-count">
          {unreadCount} unread
        </div>
      </div>

      {error && (
        <p className="notifications-error">{error}</p>
      )}

      {loading ? (
        <div className="notifications-empty">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <div className="notification-empty-icon">🔔</div>
          <h3>No notifications</h3>
          <p>Your fitness updates will appear here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              className={`notification-item ${
                notification.is_read ? "read" : "unread"
              }`}
              key={notification.id}
            >
              <div className="notification-icon">🔔</div>

              <div className="notification-content">
                <h3>
                  {notification.title || "Fitness Notification"}
                </h3>

                <p>
                  {notification.message ||
                    notification.content ||
                    "You have a new fitness update."}
                </p>

                <span className="notification-date">
                  {notification.created_at
                    ? new Date(
                        notification.created_at
                      ).toLocaleString()
                    : ""}
                </span>
              </div>

              {!notification.is_read && (
                <button
                  className="mark-read-button"
                  onClick={() => markAsRead(notification)}
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
