import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ProductFilters({
  query,
  setQuery,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  vendors,
  selectedVendors,
  toggleVendor,
  sortOrder,
  setSortOrder,
  suggestions,
  applySuggestion
}) {

  const [openSection, setOpenSection] = useState({
    search: true,
    price: true,
    rating: true,
    vendors: true,
    sort: true
  });

  const toggleSection = (key) =>
    setOpenSection(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside className="bg-white p-4 rounded-lg shadow-md space-y-4 w-full">
      <h3 className="font-semibold text-xl">Filters</h3>

      {/* Search */}
      <div>
        <button className="w-full flex justify-between items-center font-semibold mb-2"
          onClick={() => toggleSection("search")}>
          Search
          {openSection.search ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openSection.search && (
          <>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full p-2 border rounded focus:ring-indigo-400"
            />

            {query !== "" && suggestions.length > 0 && (
              <ul className="border rounded p-2 mt-2 bg-gray-50 cursor-pointer">
                {suggestions.map((s, i) => (
                  <li key={i} className="py-1 hover:bg-gray-200 px-2 rounded"
                    onClick={() => applySuggestion(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Sort */}
      <div>
        <button className="w-full flex justify-between items-center font-semibold mb-2"
          onClick={() => toggleSection("sort")}>
          Sort by
          {openSection.sort ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openSection.sort && (
          <select
            className="w-full p-2 border rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">None</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
            <option value="rating">Rating</option>
          </select>
        )}
      </div>

      {/* Price */}
      <div>
        <button className="w-full flex justify-between items-center font-semibold mb-2"
          onClick={() => toggleSection("price")}>
          Price
          {openSection.price ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openSection.price && (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 p-2 border rounded"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 p-2 border rounded"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <button className="w-full flex justify-between items-center font-semibold mb-2"
          onClick={() => toggleSection("rating")}>
          Rating
          {openSection.rating ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openSection.rating && (
          <select
            className="w-full p-2 border rounded"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value={0}>Any</option>
            <option value={1}>1★ & up</option>
            <option value={2}>2★ & up</option>
            <option value={3}>3★ & up</option>
            <option value={4}>4★ & up</option>
          </select>
        )}
      </div>

      {/* Vendors */}
      <div>
        <button className="w-full flex justify-between items-center font-semibold mb-2"
          onClick={() => toggleSection("vendors")}>
          Vendors
          {openSection.vendors ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openSection.vendors && (
          <div className="max-h-40 overflow-auto flex flex-col gap-1">
            {vendors.map((v) => (
              <label key={v.id} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={selectedVendors.has(v.id)}
                  onChange={() => toggleVendor(v.id)}
                  className="accent-indigo-600"
                />
                <span>{v.shopName || v.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
