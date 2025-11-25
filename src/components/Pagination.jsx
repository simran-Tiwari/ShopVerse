import React from "react";

export default function Pagination({ hasMore, onLoadMore, loadingMore }) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={onLoadMore}
        disabled={loadingMore}
        className={`px-5 py-2 rounded-lg font-medium transition-colors ${
          loadingMore
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {loadingMore ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}
