import type { ProductsResponse, Category } from "../types";

const BASE_URL = "https://dummyjson.com";

// Abort controllers para cancelar requests
const abortControllers = new Map<string, AbortController>();

interface ApiError {
  message: string;
  status?: number;
}

class ApiService {
  private async fetch<T>(endpoint: string, requestId?: string): Promise<T> {
    // Cancela request anterior com mesmo ID
    if (requestId && abortControllers.has(requestId)) {
      abortControllers.get(requestId)?.abort();
    }

    // Cria novo controller
    const controller = new AbortController();
    if (requestId) {
      abortControllers.set(requestId, controller);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Remove controller após sucesso
      if (requestId) {
        abortControllers.delete(requestId);
      }

      return data;
    } catch (error) {
      // Não propaga erro de abort (é cancelamento intencional)
      if (error instanceof Error && error.name === "AbortError") {
        console.log(`Request ${requestId} cancelled`);
        throw error;
      }

      const apiError: ApiError = {
        message: error instanceof Error ? error.message : "Unknown error",
      };
      throw apiError;
    }
  }

  // Busca todos os produtos com paginação
  async getProducts(skip = 0, limit = 30): Promise<ProductsResponse> {
    return this.fetch<ProductsResponse>(
      `/products?limit=${limit}&skip=${skip}`,
      "products-list",
    );
  }

  // Busca por query
  async searchProducts(query: string): Promise<ProductsResponse> {
    if (!query.trim()) {
      return this.getProducts();
    }

    return this.fetch<ProductsResponse>(
      `/products/search?q=${encodeURIComponent(query)}`,
      "products-search",
    );
  }

  // Busca por categoria
  async getProductsByCategory(category: string): Promise<ProductsResponse> {
    return this.fetch<ProductsResponse>(
      `/products/category/${encodeURIComponent(category)}`,
      "products-category",
    );
  }

  // ✅ FIX: Lista todas as categorias (retorna array de objetos)
  async getCategories(): Promise<Category[]> {
    return this.fetch<Category[]>("/products/categories");
  }

  // Autocomplete - busca sugestões
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      const response = await this.searchProducts(query);
      // Extrai títulos únicos
      return Array.from(new Set(response.products.map((p) => p.title))).slice(
        0,
        5,
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return [];
      }
      throw error;
    }
  }

  // Cancela todos os requests pendentes
  cancelAll() {
    abortControllers.forEach((controller) => controller.abort());
    abortControllers.clear();
  }
}

export const api = new ApiService();
