import { useState, useCallback, useEffect, useRef } from "react";
import type { Product, SearchParams } from "../types";
import { api } from "../services/api";

interface UseProductSearchReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  search: (params: SearchParams) => void;
  clearError: () => void;
}

export function useProductSearch(): UseProductSearchReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Rastreia se componente está montado
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      api.cancelAll(); // Cancela requests ao desmontar
    };
  }, []);

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      // Lógica de busca baseada nos parâmetros
      if (params.category && params.category !== "all") {
        response = await api.getProductsByCategory(params.category);
      } else if (params.query) {
        response = await api.searchProducts(params.query);
      } else {
        response = await api.getProducts();
      }

      // Filtragem client-side (API do DummyJSON não suporta todos os filtros)
      let filteredProducts = response.products;

      // Filtro de preço
      if (params.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price >= params.minPrice!,
        );
      }
      if (params.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p) => p.price <= params.maxPrice!,
        );
      }

      // Ordenação
      if (params.sortBy) {
        filteredProducts.sort((a, b) => {
          const aVal = a[params.sortBy!];
          const bVal = b[params.sortBy!];

          if (typeof aVal === "string" && typeof bVal === "string") {
            return params.order === "desc"
              ? bVal.localeCompare(aVal)
              : aVal.localeCompare(bVal);
          }

          return params.order === "desc"
            ? (bVal as number) - (aVal as number)
            : (aVal as number) - (bVal as number);
        });
      }

      // Só atualiza state se componente ainda está montado
      if (isMountedRef.current) {
        setProducts(filteredProducts);
        setTotalProducts(filteredProducts.length);
      }
    } catch (err) {
      // Ignora erros de abort
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      if (isMountedRef.current) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar produtos",
        );
        setProducts([]);
        setTotalProducts(0);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    products,
    loading,
    error,
    totalProducts,
    search,
    clearError,
  };
}
