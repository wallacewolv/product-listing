import { useEffect, useState } from "react";
import { getProducts } from "../services/api";

export function useProducts() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProducts().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
