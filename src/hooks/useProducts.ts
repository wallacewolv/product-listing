import { useEffect, useState } from "react";
import type { Product } from "../types/Product";

interface Params {
  search: string;
  page: number;
}

export function useProducts({ search, page }: Params) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const response = await fetch(
        `/api/products?search=${search}&page=${page}`,
      );
      const data = await response.json();

      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [search, page]);

  return { products, loading };
}
