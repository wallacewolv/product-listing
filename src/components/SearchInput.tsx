import { useEffect, useState } from "react";

interface Props {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!value) return;

    const timeout = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <div>
      <label htmlFor="product-search">Buscar produtos</label>
      <input
        id="product-search"
        type="text"
        placeholder="Buscar"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
