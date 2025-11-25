
import React, { useEffect, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";
import Badges from "../components/Badges";
import { RewardToast } from "../components/RewardToast";

export default function SalesAchievements({ vendorId }) {
  const [vendor, setVendor] = useState(null);
  const [badges, setBadges] = useState([]);
  const [toast, setToast] = useState(null);

  // Keep track of badges already shown in a toast
  const shownBadgeIds = useRef(new Set());

  useEffect(() => {
    if (!vendorId) return;
    const dref = doc(db, "vendors", vendorId);
    const unsub = onSnapshot(dref, snap => setVendor(snap.data()));
    return () => unsub();
  }, [vendorId]);

  useEffect(() => {
    if (!vendor) return;

    const list = [];
    if ((vendor.sales || 0) > 1000)
      list.push({
        id: "v-top-seller",
        title: "Top Seller",
        icon: "🔥",
        earnedAt: vendor.topSellerAt || new Date(),
      });
    if ((vendor.rating || 0) >= 4.5)
      list.push({
        id: "v-5star",
        title: "High Rated",
        icon: "⭐",
        earnedAt: vendor.highRatedAt || new Date(),
      });

    setBadges(list);

    // Show toast for new badges
    list.forEach(b => {
      if (!shownBadgeIds.current.has(b.id)) {
        shownBadgeIds.current.add(b.id);
        setToast({ title: `Achievement Unlocked!`, message: `${b.icon} ${b.title}` });
        setTimeout(() => setToast(null), 8000);
      }
    });
  }, [vendor]);

  return (
    <div>
      <h4 className="font-semibold mb-2">Achievements</h4>
      {badges.length === 0 ? (
        <p className="text-gray-500">No achievements yet</p>
      ) : (
        <Badges badges={badges} />
      )}

      {toast && (
        <RewardToast
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
