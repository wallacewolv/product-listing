import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
};

type Props = {
  query: string;
};

export function ProductList({ query }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products?search=${query}`)
      .then((res) => res.json())
      .then(setProducts);
  }, [query]);

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
