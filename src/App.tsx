import "./App.css";

import { useMemo, useState } from "react";

import { ProductList } from "./components/ProductList";
import { SearchInput } from "./components/SearchInput";
import { useProducts } from "./hooks/useProducts";

export default function App() {
  const { products, loading, error, retry } = useProducts();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!products) return [];

    const normalizedSearch = search.toLowerCase();

    return products.filter((p) =>
      p.title.toLowerCase().includes(normalizedSearch),
    );
  }, [products, search]);

  if (error) {
    return (
      <div role="alert">
        <p>Erro ao carregar produtos.</p>
        <button onClick={retry}>Tentar novamente</button>
      </div>
    );
  }

  if (loading) {
    return <p aria-live="polite">Carregando...</p>;
  }

  return (
    <>
      <SearchInput onSearch={setSearch} />
      <ProductList products={filtered} />
    </>
  );
}
