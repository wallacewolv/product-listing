// useProducts.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "../hooks/useProducts";

test("should fetch products", async () => {
  const { result } = renderHook(() => useProducts());

  await waitFor(() => {
    expect(result.current.products.length).toBeGreaterThan(0);
  });
});
