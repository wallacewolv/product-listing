import "./App.css";

import { useState } from "react";

import { ProductList } from "./components/ProductList";
import { SearchInput } from "./components/SearchInput";
import type { Product } from "./types/Product";

export default function App({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <SearchInput onSearch={setSearch} />
      <ProductList products={filtered} />
    </>
  );
}
