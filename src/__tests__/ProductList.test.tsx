import { render, screen } from "@testing-library/react";
import { ProductList } from "../components/ProductList";

test("renders products", () => {
  render(<ProductList products={[]} />);
  expect(screen.getByText("Notebook")).toBeInTheDocument();
});
