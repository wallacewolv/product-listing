import type { Product } from "../types/Product";
import { formatPrice } from "../utils/price";

export function ProductList({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p aria-live="polite">Nenhum produto encontrado</p>;
  }

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.title} - {formatPrice(p.price)}
        </li>
      ))}
    </ul>
  );
}
