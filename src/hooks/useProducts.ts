import { useEffect, useState } from "react";

import type { Product } from "../types/Product";
import type { Params } from "../types/Params";
import { buildProductUrl } from "../utils/products-url";

export function useProducts({ search, page }: Params) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const response = await fetch(buildProductUrl(search, page));

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!cancelled) {
          setProducts(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [search, page]);

  return { products, loading };
}
