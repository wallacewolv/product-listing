import { useEffect, useState } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

interface Props {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebouncedValue(value, 300);

  useEffect(() => {
    if (!debouncedValue) return;
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div role="search">
      <label htmlFor="product-search">Buscar produtos</label>
      <input
        id="product-search"
        placeholder="Buscar"
        type="text"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
