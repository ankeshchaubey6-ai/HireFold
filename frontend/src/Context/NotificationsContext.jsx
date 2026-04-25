import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * NotificationsContext
 * --------------------
 * Centralized notification system for HireFold
 * - Supports Candidate & Recruiter
 * - LocalStorage backed
 * - Read / Unread support
 */

const NotificationsContext = createContext();

const STORAGE_KEY = "hirefold_notifications";

/* ================= ROLES ================= */
export const NOTIFICATION_ROLES = {
  CANDIDATE: "CANDIDATE",
  RECRUITER: "RECRUITER",
};

/* ================= TYPES ================= */
export const NOTIFICATION_TYPES = {
  INTERVIEW_SCHEDULED: "INTERVIEW_SCHEDULED",
  INTERVIEW_CANCELLED: "INTERVIEW_CANCELLED",
  INTERVIEW_COMPLETED: "INTERVIEW_COMPLETED",
  FEEDBACK_AVAILABLE: "FEEDBACK_AVAILABLE",
};

export const NotificationsProvider = ({ children }) => {
  /* ================= LOAD ================= */
  const [notifications, setNotifications] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(STORAGE_KEY)) ||
        []
      );
    } catch {
      return [];
    }
  });

  /* ================= PERSIST ================= */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notifications)
    );
  }, [notifications]);

  /* ================= CREATE ================= */
  const notify = ({
    role,
    title,
    message,
    type,
    meta = {},
  }) => {
    const notification = {
      id: crypto.randomUUID(),
      role,
      title,
      message,
      type,
      meta,
      read: false,
      createdAt: Date.now(),
    };

    setNotifications((prev) => [
      notification,
      ...prev,
    ]);
  };

  /* ================= ACTIONS ================= */
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const clearAll = (role) => {
    setNotifications((prev) =>
      prev.filter((n) => n.role !== role)
    );
  };

  /* ================= SELECTORS ================= */
  const getForRole = (role) =>
    notifications.filter((n) => n.role === role);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,

        // actions
        notify,
        markAsRead,
        clearAll,

        // selectors
        getForRole,

        // enums
        NOTIFICATION_ROLES,
        NOTIFICATION_TYPES,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationsContext);
