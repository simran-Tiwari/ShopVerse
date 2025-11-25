import React, { useEffect, useState } from "react";

export default function BadgePopup({ badge }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!badge) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [badge]);

  if (!badge || !visible) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-linear-to-r from-indigo-500 to-teal-400 shadow-xl p-4 rounded-lg flex items-center animate-fade-in z-50 border border-gray-200">
      <img src={badge.icon} alt={badge.title} className="w-12 h-12" />
      <div className="ml-3">
        <p className="font-bold text-white">Badge Unlocked!</p>
        <p className="text-sm text-gray-100">{badge.title}</p>
      </div>
    </div>
  );
}
