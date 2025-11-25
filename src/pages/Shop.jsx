
import React, { useEffect, useMemo, useState } from "react";
import useProducts from "../utils/useProducts";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import QuickViewModal from "../components/QuickViewModal";
import Pagination from "../components/Pagination";

export default function Shop({ setLatestReward, setLatestBadge }) {
  const { products, vendors, loading, hasMore, loadMore } = useProducts({ pageSize: 12 });

  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [selectedVendors, setSelectedVendors] = useState(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const toggleVendor = (id) => {
    const next = new Set(selectedVendors);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedVendors(next);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedVendors.size && !selectedVendors.has(p.vendorId)) return false;
      if ((p.price || 0) < minPrice || (p.price || 0) > maxPrice) return false;
      if ((p.rating || 0) < minRating) return false;
      return true;
    });
  }, [products, searchQuery, selectedVendors, minPrice, maxPrice, minRating]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await loadMore();
    setLoadingMore(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1">
        <ProductFilters
          query={searchQuery}
          setQuery={setSearchQuery}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minRating={minRating}
          setMinRating={setMinRating}
          vendors={vendors}
          selectedVendors={selectedVendors}
          toggleVendor={toggleVendor}
        />
      </div>

      <section className="col-span-1 lg:col-span-3">
        {loading ? (
          <div>Loading products...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={() => setQuickViewProduct(product)}
                  setLatestReward={setLatestReward}
                  setLatestBadge={setLatestBadge}
                />
              ))}
            </div>

            <Pagination hasMore={hasMore} onLoadMore={handleLoadMore} loadingMore={loadingMore} />
          </>
        )}

        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            allProducts={products}
          />
        )}
      </section>
    </div>
  );
}
