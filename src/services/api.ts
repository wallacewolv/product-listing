export async function getProducts() {
  const res = await fetch("/api/products");
  return res.json();
}
