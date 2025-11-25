
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

function monthLabel(i) {
  const d = new Date();
  d.setMonth(d.getMonth() - (5 - i));
  return d.toLocaleString("default", { month: "short" });
}

export default function SalesAnalytics() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [labels, setLabels] = useState(Array.from({ length: 6 }, (_, i) => monthLabel(i)));
  const [salesData, setSalesData] = useState([0, 0, 0, 0, 0, 0]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    let unsubProducts;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const q = query(collection(db, "products"), where("vendorId", "==", user.uid));
      unsubProducts = onSnapshot(q, (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Top products by sales
        const top = list.sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 5);
        setTopProducts(top);

        // Monthly sales aggregation
        const months = [0, 0, 0, 0, 0, 0];
        list.forEach((p) => {
          if (Array.isArray(p.salesByMonth)) {
            p.salesByMonth.slice(-6).forEach((v, idx) => {
              months[idx] += v;
            });
          } else {
            months[months.length - 1] += p.sales || 0;
          }
        });
        setSalesData(months);
      });
    });

    return () => {
      if (unsubProducts) unsubProducts();
      unsubAuth();
      if (chartRef.current) chartRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Revenue",
            data: salesData,
            borderColor: "#6366F1",
            backgroundColor: "rgba(99,102,241,0.2)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => chartRef.current && chartRef.current.destroy();
  }, [labels, salesData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue chart */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Revenue (last 6 months)</h3>
        <canvas ref={canvasRef} height="150" />
      </div>

      {/* Top products */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Top products</h3>
        <ul className="space-y-3">
          {topProducts.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <img
                src={p.imageUrl || "https://via.placeholder.com/50"}
                className="h-12 w-12 object-cover rounded"
                alt={p.name}
              />
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">Sales: {p.sales || 0}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

