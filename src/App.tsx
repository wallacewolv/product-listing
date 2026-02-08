import "./App.css";

import { ProductList } from "./components/ProductList";
import { useProducts } from "./hooks/useProducts";

export default function App() {
  const { data, loading } = useProducts();

  if (loading) return <span>Loading...</span>;

  return <ProductList products={data} />;
}
