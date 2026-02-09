export function SearchInput({ onSearch }: { onSearch: (v: string) => void }) {
  return (
    <input
      type="text"
      placeholder="Buscar produtos"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
