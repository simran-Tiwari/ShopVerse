import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function NotificationsPage() {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, [user]);

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view notifications.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-6 px-3">
      <h2 className="text-2xl font-semibold mb-5">🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet...</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 bg-white rounded-lg shadow mb-3 border border-gray-200"
          >
            <p className="font-semibold text-lg">{n.title}</p>
            <p className="text-gray-600 mt-1">{n.message}</p>
            <small className="text-xs text-gray-400 block mt-2">
              {new Date(n.timestamp).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}
