"use client";

import { useEffect, useState } from "react";

export function useHighestBid(carId: string) {
  const [highestBid, setHighestBid] = useState<number | null>(null);

  const fetchBid = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}/highest`
      );
      const data = await res.json();

      if (data.highestBid) {
        setHighestBid(data.highestBid.amount);
      } else {
        setHighestBid(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadBid = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cars/${carId}/highest`
        );
        const data = await res.json();

        if (data.highestBid) {
          setHighestBid(data.highestBid.amount);
        } else {
          setHighestBid(null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadBid();
  }, [carId]);

  return { highestBid, refreshBid: fetchBid };
}
