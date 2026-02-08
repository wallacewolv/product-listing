import type { Product } from "../types/Product";
import { formatPrice } from "../utils/price";

export function ProductList({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p aria-live="polite">Nenhum produto encontrado</p>;
  }

  return (
    <ul aria-label="Lista de produtos">
      {products.map(({ id, title, price }) => (
        <li key={id}>
          {title} - {formatPrice(price)}
        </li>
      ))}
    </ul>
  );
}
