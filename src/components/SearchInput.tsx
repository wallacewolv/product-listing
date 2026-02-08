import { useEffect, useState } from "react";

interface Props {
  onSearch: (value: string) => void;
}

export function SearchInput({ onSearch }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    onSearch(value);
  }, [value, onSearch]);

  return (
    <input
      placeholder="Buscar produto"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
