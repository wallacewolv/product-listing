import { render, screen } from "@testing-library/react";

import { ProductList } from "../components/ProductList";

import type { Product } from "../types/Product";

describe("ProductList", () => {
  const products: Product[] = [
    { id: "1", title: "Notebook", price: 10000 },
    { id: "2", title: "Celular", price: 1500 },
  ];

  test("renders empty state", () => {
    render(<ProductList products={[]} />);
    expect(screen.getByText(/nenhum produto/i)).toBeInTheDocument();
  });

  describe("render", () => {
    it("should render the product list", () => {
      render(<ProductList products={products} />);

      expect(screen.getByText(/Notebook/i)).toBeInTheDocument();
      expect(screen.getByText(/Celular/i)).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("must have aria-label in the list", () => {
      render(<ProductList products={products} />);

      expect(
        screen.getByRole("list", { name: /lista de produtos/i }),
      ).toBeInTheDocument();
    });
  });
});
