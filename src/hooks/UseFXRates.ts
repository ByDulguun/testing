import { useEffect, useState } from "react";

export function useFxRates() {
  const [rates, setRates] = useState<{
    USD: number;
    RUB: number;
    KZT: number;
  } | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rates`);
        const data = await res.json();
        console.log(data.rates);

        setRates(data.rates);
      } catch {
        setRates(null);
      }
    };
    fetchRates();
  }, []);

  return rates;
}
