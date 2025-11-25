
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const col = collection(db, "users", user.uid, "notifications");
    const q = query(col, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(arr);
      setUnreadCount(arr.filter((n) => !n.read).length);
    });

    return () => unsub();
  }, [user]);

  async function markAllRead() {
    if (!user || !notifications.length) return;
    // best-effort: mark each unread notification as read
    await Promise.all(
      notifications
        .filter((n) => !n.read)
        .map((n) => updateDoc(doc(db, "users", user.uid, "notifications", n.id), { read: true }))
    );
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
