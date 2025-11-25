import React from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryList() {
  const navigate = useNavigate();

  const categories = [
    { name: "Electronics", emoji: "📱" },
    { name: "Fashion", emoji: "👗" },
    { name: "Home & Kitchen", emoji: "🏡" },
    { name: "Sports", emoji: "🏀" },
    { name: "Beauty", emoji: "💄" },
    { name: "Books", emoji: "📚" },
  ];

  const handleClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <div
          key={cat.name}
          onClick={() => handleClick(cat.name)}
          className="bg-white p-4 rounded-xl shadow hover:shadow-lg 
                     text-center cursor-pointer transition hover:-translate-y-1 
                     font-semibold text-gray-700"
        >
          <div className="text-3xl mb-2">{cat.emoji}</div>
          {cat.name}
        </div>
      ))}
    </div>
  );
}
