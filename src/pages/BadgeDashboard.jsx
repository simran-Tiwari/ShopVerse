import React, { useEffect, useState } from "react";
import { BADGES } from "../utils/badges";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BadgeDashboard() {
  const [userBadges, setUserBadges] = useState([]);

  // Fetch earned badges once
  useEffect(() => {
    async function fetchBadges() {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const badges = docSnap.data().badges || [];
          setUserBadges(badges);
        }
      } catch (error) {
        console.error("Failed to fetch badges:", error);
      }
    }

    fetchBadges();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Your Badges</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {BADGES.map((b) => {
          const unlocked = userBadges.includes(b.id);

          return (
            <div
              key={b.id}
              className={`flex flex-col items-center p-3 border rounded-lg transition-transform duration-200 hover:scale-105 hover:shadow-lg ${
                unlocked ? "bg-white" : "bg-gray-100"
              }`}
              title={b.name}
            >
              <img
                src={b.icon}
                alt={b.name}
                className={`w-20 h-20 object-contain transition-opacity duration-300 ${
                  unlocked ? "opacity-100" : "opacity-40"
                }`}
                onError={(e) =>
                  (e.target.src =
                    "https://img.icons8.com/ios-glyphs/96/000000/question-mark.png")
                }
              />
              <span
                className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                  unlocked ? "text-black" : "text-gray-400"
                }`}
              >
                {b.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
