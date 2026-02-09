import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import { ProductList } from "../components/ProductList";

describe("ProductList (fetch based)", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls API with correct query", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => [],
    } as Response);

    render(<ProductList query="note" />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/products?search=note");
    });
  });

  it("renders products returned by the API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => [
        { id: 1, name: "Notebook" },
        { id: 2, name: "Celular" },
      ],
    } as Response);

    render(<ProductList query="prod" />);

    expect(await screen.findByText("Notebook")).toBeInTheDocument();
    expect(await screen.findByText("Celular")).toBeInTheDocument();
  });

  it("renders empty list when API returns no products", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => [],
    } as Response);

    render(<ProductList query="nothing" />);

    await waitFor(() => {
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });
  });
});
