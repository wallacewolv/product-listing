import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useProducts } from "../hooks/useProducts";

const mockProducts = [{ id: 1, title: "Mouse", price: 100 }];

beforeEach(() => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue(mockProducts),
  } as unknown);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useProducts", () => {
  test("refetches products when search changes", async () => {
    const { rerender } = renderHook(
      ({ search }) => useProducts({ search, page: 1 }),
      {
        initialProps: { search: "" },
      },
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    rerender({ search: "mouse" });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
