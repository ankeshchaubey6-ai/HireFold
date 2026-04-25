import React from "react";

 
import {
  useNotifications,
  NOTIFICATION_ROLES,
} from "../../Context/NotificationsContext";

import "../../Styles/sectionSurface.css";

const Notifications = () => {
  const {
    getForRole,
    markAsRead,
    clearAll,
  } = useNotifications();

  const notifications = getForRole(
    NOTIFICATION_ROLES.RECRUITER
  );

  return (
    <>
    

      <main className="page" style={{ padding: "24px" }}>
        <section className="section-surface">
          <h2 className="section-title">
            Notifications
          </h2>

          {notifications.length === 0 && (
            <p className="muted-text">
              No notifications yet.
            </p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-card ${
                n.read ? "read" : "unread"
              }`}
              onClick={() => markAsRead(n.id)}
              style={{
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "12px",
                cursor: "pointer",
                background: n.read
                  ? "var(--surface-muted)"
                  : "var(--surface)",
              }}
            >
              <h4>{n.title}</h4>
              <p>{n.message}</p>
              <span className="muted-text">
                {new Date(
                  n.createdAt
                ).toLocaleString()}
              </span>
            </div>
          ))}

          {notifications.length > 0 && (
            <button
              className="btn-secondary"
              onClick={() =>
                clearAll(
                  NOTIFICATION_ROLES.RECRUITER
                )
              }
            >
              Clear All
            </button>
          )}
        </section>
      </main>
    </>
  );
};

export default Notifications;
