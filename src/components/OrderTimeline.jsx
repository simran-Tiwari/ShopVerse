
import React from "react";

export default function OrderTimeline({ history = [] }) {
  const orderStages = [
    { key: "processing", label: "Processing" },
    { key: "picked", label: "Picked up" },
    { key: "shipped", label: "Shipped" },
    { key: "out_for_delivery", label: "Out for delivery" },
    { key: "delivered", label: "Delivered" }
  ];

  const latestIndex = Math.max(
    ...history.map(h => orderStages.findIndex(s => s.key === h.status)),
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-5 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Order Timeline</h3>

      <ol className="relative border-l-2 border-gray-200">
        {orderStages.map((stage, idx) => {
          const done = idx <= latestIndex;
          const event = history.find(h => h.status === stage.key);

          return (
            <li key={stage.key} className="mb-10 ml-6 relative">
              <span className={`absolute -left-4 top-1 flex items-center justify-center w-8 h-8 rounded-full text-white font-bold shadow-md
                ${done ? "bg-indigo-600" : "bg-gray-300 text-gray-600"}`}>
                {done ? "✓" : idx + 1}
              </span>

              <h4 className={`text-sm font-semibold mb-1 ${done ? "text-gray-900" : "text-gray-500"}`}>
                {stage.label}
              </h4>

              {event && (
                <p className="text-xs text-gray-500">
                  {new Date(event.at?.toDate?.() || event.at).toLocaleString()}
                  {event.note ? ` — ${event.note}` : ""}
                </p>
              )}

              {idx < orderStages.length - 1 && (
                <span className={`absolute left-0 top-8 w-0.5 h-full 
                  ${done ? "bg-indigo-600" : "bg-gray-300"}`}/>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
