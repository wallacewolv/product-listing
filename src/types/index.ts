export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchParams {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortBy;
  order?: Order;
}

export type Order = "asc" | "desc";

export type SortBy = "price" | "rating" | "title";

export interface ApiError {
  message: string;
  status?: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface Filters {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: SortBy;
  order: Order;
}
