

import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export default function Leaderboard() {
  const db = getFirestore();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadLeaderboard() {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const sorted = list.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
      setUsers(sorted);
    }
    loadLeaderboard();
  }, [db]);

  const medalColors = ["text-yellow-500", "text-gray-400", "text-yellow-800"];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-6 font-bold text-center">Top Buyers Leaderboard</h1>
      <table className="w-full border-collapse border rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-indigo-100 text-gray-700">
            <th className="p-3 border">Rank</th>
            <th className="p-3 border">User</th>
            <th className="p-3 border">Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={u.id}
              className={`text-center ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} ${
                i < 3 ? "font-semibold" : ""
              }`}
            >
              <td className={`border p-2 ${medalColors[i] || ""}`}>
                {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
              </td>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2 text-indigo-600 font-medium">₹{u.totalSpent || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No users found yet.</p>
      )}
    </div>
  );
}

