import React, { useEffect, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function BadgeListener({ onNewBadge }) {
  const seenBadgesRef = useRef(new Set());

  useEffect(() => {
    let unsubscribe = () => {};

    const authUnsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const uid = user.uid;
      const userDocRef = doc(db, "users", uid);

      // Listen to the badges array
      unsubscribe = onSnapshot(
        userDocRef,
        (snapshot) => {
          const badges = snapshot.data()?.badges || [];
          badges.forEach((badgeId) => {
            if (!seenBadgesRef.current.has(badgeId)) {
              seenBadgesRef.current.add(badgeId);
              onNewBadge(badgeId); // Notify parent about new badge
            }
          });
        },
        (error) => {
          console.error("BadgeListener snapshot error:", error);
        }
      );
    });

    return () => {
      unsubscribe();
      authUnsub();
    };
  }, [onNewBadge]);

  return null;
}
