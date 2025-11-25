

import React, { useState, useEffect } from "react";
import { requestFCMPermissionAndGetToken, listenToForegroundMessages } from "../utils/fcm";

export default function NotificationPrompt() {
  const [enabled, setEnabled] = useState(() => {
    return localStorage.getItem("push-enabled") === "true";
  });

  async function enableNotifications() {
    const token = await requestFCMPermissionAndGetToken();
    
    if (token) {
      setEnabled(true);
      localStorage.setItem("push-enabled", "true");
      console.log("FCM Token:", token);
    } else {
      alert("Notification permissions denied.");
    }
  }

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = listenToForegroundMessages((payload) => {
      new Notification(payload.notification?.title, {
        body: payload.notification?.body,
        icon: "/notification-icon.png"
      });
    });

    return () => unsubscribe?.();
  }, [enabled]);

  // Don't show prompt again once enabled
  if (enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-xl p-4 rounded-2xl border w-72 animate-fade-in">
      <h4 className="font-semibold text-lg">🔔 Stay Updated</h4>
      <p className="text-gray-600 text-sm mt-1">
        Enable push notifications to get offers, order updates & alerts.
      </p>

      <button
        onClick={enableNotifications}
        className="mt-3 w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        Enable Notifications
      </button>
    </div>
  );
}
