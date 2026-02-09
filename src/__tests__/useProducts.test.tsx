import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "../hooks/useProducts";

describe("useProducts", () => {
  test("refetches products when search changes", async () => {
    const { result, rerender } = renderHook(
      ({ search }) => useProducts({ search, page: 1 }),
      {
        initialProps: { search: "" },
      },
    );

    rerender({ search: "mouse" });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
