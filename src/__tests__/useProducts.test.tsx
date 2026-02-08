// useProducts.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/Product";

const mockProducts: Product[] = [
  { id: "1", title: "Notebook", price: 5000 },
  { id: "2", title: "Mouse", price: 200 },
];

describe("useProducts", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("fetches products successfully", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => mockProducts,
    } as Response);

    const { result } = renderHook(() => useProducts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBe(false);
  });
});
