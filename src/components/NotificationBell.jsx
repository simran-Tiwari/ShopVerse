
import React, { useState } from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  function toggle() {
    setOpen((v) => !v);
    if (!open) {
      markAllRead().catch(() => {});
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative p-2 rounded hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-bounce"
            title={`${unreadCount} unread`}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="font-semibold">Notifications</div>
            <button
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => nav("/notifications")}
            >
              View all
            </button>
          </div>

          <div className="max-h-64 overflow-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-gray-500">No notifications</div>
            )}

            {notifications.slice(0, 8).map((n) => (
              <div key={n.id} className={`p-3 border-b ${n.read ? "" : "bg-gray-50"}`}>
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-gray-600">{n.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
