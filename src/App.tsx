import "./App.css";

import { useState } from "react";

import { ProductList } from "./components/ProductList";
import { SearchInput } from "./components/SearchInput";
import { useProducts } from "./hooks/useProducts";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { products, loading } = useProducts({
    search,
    page,
  });

  return (
    <>
      <SearchInput onSearch={setSearch} />

      {loading && <p>Carregando...</p>}

      <ProductList products={products} />

      <button onClick={() => setPage((p) => p + 1)}>Próxima página</button>
    </>
  );
}
