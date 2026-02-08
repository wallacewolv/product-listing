import type { Product } from "../types/Product";

export interface GetProductsResponse {
  products: Product[];
}

export async function getProducts(): Promise<GetProductsResponse> {
  const res = await fetch("https://dummyjson.com/products");

  if (!res.ok) {
    throw new Error("Error ao buscar produtos");
  }

  return res.json();
}
