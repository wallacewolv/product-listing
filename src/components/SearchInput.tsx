import { useEffect, useState } from "react";

interface Props {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <label>
      Buscar
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar produto"
      />
    </label>
  );
}
