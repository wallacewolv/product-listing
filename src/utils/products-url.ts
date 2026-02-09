export function buildProductUrl(search: string, page: number) {
  const params = new URLSearchParams({
    search,
    page: String(page),
  });

  return `/api/products${params.toString()}`;
}
