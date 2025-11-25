
import React, { useEffect } from "react";

export default function RewardToast({ title, message, onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-amber-400 text-black p-4 rounded-xl shadow-lg flex flex-col gap-1 animate-fade-in border border-amber-500">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs">{message}</div>
        <div className="mt-1 text-right">
          <button
            onClick={onClose}
            className="text-xs underline hover:text-black/70 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
