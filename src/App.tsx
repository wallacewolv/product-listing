import { useState, useCallback, useEffect, useMemo } from "react";
import { AutoComplete } from "./components/AutoComplete";
import { FilterPanel } from "./components/FilterPanel";
import { ProductGrid } from "./components/ProductGrid";
import { useProductSearch } from "./hooks/useProductSearch";
import { useDebounce } from "./hooks/useDebounce";
import type { SearchParams, Filters } from "./types";
import "./App.css";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "title",
    order: "asc",
  });

  const { products, loading, error, totalProducts, search } =
    useProductSearch();

  const debounceOptions = useMemo(() => ({ maxWait: 2000 }), []);

  // ✅ FIX: Função com tipo explícito
  const handleSearch = useCallback(
    (params: SearchParams) => {
      search(params);
    },
    [search],
  );

  const debouncedSearch = useDebounce(handleSearch, 500, debounceOptions);

  useEffect(() => {
    const params: SearchParams = {
      query: searchQuery,
      category: filters.category !== "all" ? filters.category : undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy: filters.sortBy,
      order: filters.order,
    };

    debouncedSearch.execute(params);
  }, [searchQuery, filters, debouncedSearch]);

  useEffect(() => {
    search({ query: "" });
  }, [search]);

  const handleSearchSelect = useCallback(
    (value: string) => {
      setSearchQuery(value);
      search({
        query: value,
        category: filters.category !== "all" ? filters.category : undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sortBy: filters.sortBy,
        order: filters.order,
      });
    },
    [filters, search],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛒 Product Listing</h1>
        <div className="search-container">
          <AutoComplete
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={handleSearchSelect}
            placeholder="Buscar produtos..."
          />
        </div>
        <div className="results-count">
          {!loading && `${totalProducts} produtos encontrados`}
        </div>
      </header>

      <div className="app-body">
        <FilterPanel onFilterChange={setFilters} />
        <main className="main-content">
          <ProductGrid products={products} loading={loading} error={error} />
        </main>
      </div>
    </div>
  );
}
