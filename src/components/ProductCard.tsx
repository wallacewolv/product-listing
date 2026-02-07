import type { Product } from "../types";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        {product.discountPercentage > 0 && (
          <span className="discount-badge">
            -{product.discountPercentage.toFixed(0)}%
          </span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-brand">{product.brand}</p>

        <div className="product-rating">
          {"⭐".repeat(Math.round(product.rating))}
          <span>({product.rating.toFixed(1)})</span>
        </div>

        <div className="product-pricing">
          {product.discountPercentage > 0 ? (
            <>
              <span className="price-original">
                ${product.price.toFixed(2)}
              </span>
              <span className="price-discount">
                ${discountedPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="price">${product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="in-stock">Em estoque ({product.stock})</span>
          ) : (
            <span className="out-of-stock">Fora de estoque</span>
          )}
        </div>
      </div>
    </article>
  );
}
