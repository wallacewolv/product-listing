import type { Product } from "../types";
import { ProductCard } from "./ProductCard";
import "./ProductGrid.css";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) {
    return (
      <div className="product-grid-status">
        <div className="loading-spinner">Carregando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid-status">
        <div className="error-message">❌ {error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid-status">
        <div className="empty-state">
          Nenhum produto encontrado. Tente ajustar os filtros.
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
