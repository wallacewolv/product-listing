import { useEffect, useState } from "react";

import type { Product } from "../types/Product";
import { getProducts } from "../services/api";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError(false);
      const { products } = await getProducts();
      setProducts(products);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { products, loading, error, retry: load };
}
