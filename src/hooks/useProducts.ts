// hooks/useProducts.ts
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
    setLoading(true);

    fetch(`/api/products?search=${search}&page=${page}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []); // ❌ dependency array errado

  return { products, loading };
}
