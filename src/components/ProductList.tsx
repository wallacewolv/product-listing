export function ProductList({ products }: any) {
  return (
    <ul>
      {products.map((p: any) => (
        <li key={p.id}>
          {p.title} - {p.price}
        </li>
      ))}
    </ul>
  );
}
