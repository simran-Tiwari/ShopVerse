export default function Badges({ badges = [] }) {
  if (!badges.length) return <p className="text-gray-500">No badges earned yet</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {badges.map(b => (
        <div
          key={b.id}
          className="bg-white p-4 rounded-lg shadow hover:scale-105 transform transition-all flex flex-col items-center"
        >
          <div className="w-16 h-16 mb-2">{b.icon || "🏅"}</div>
          <div className="text-sm font-medium">{b.title}</div>
          {b.earnedAt && (
            <div className="text-xs text-gray-400 mt-1">Earned on {new Date(b.earnedAt).toLocaleDateString()}</div>
          )}
        </div>
      ))}
    </div>
  );
}
