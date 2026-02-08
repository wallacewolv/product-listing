import "./App.css";

import { ProductList } from "./components/ProductList";
import { useProducts } from "./hooks/useProducts";

export default function App() {
  const { products, loading, error, retry } = useProducts();

  if (loading) return <p>Carregando...</p>;
  if (error) return <button onClick={retry}>Erro. Tentar novamente</button>;

  return <ProductList products={products} />;
}
