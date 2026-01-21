// hooks/useCars.ts
import { useState, useEffect, useCallback } from "react";
import { CarType } from "@/types/car";

export const useCars = (pageSize: number = 16) => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingCarById, setLoadingCarById] = useState(false);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cars?limit=${pageSize}`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();

      setCars(data.cars || []);
      setNextCursor(data.nextCursor ?? null);
      setHasMore(Boolean(data.hasMore));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || !nextCursor) return;
    setLoadingMore(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cars?limit=${pageSize}&lastVisible=${nextCursor}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      setCars((prev) => [...prev, ...(data.cars || [])]);
      setNextCursor(data.nextCursor ?? null);
      setHasMore(Boolean(data.hasMore));
    } catch {
      setError("Error while loading more cars");
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, nextCursor, pageSize]);

  const getCarById = useCallback(
    async (id: string): Promise<CarType | null> => {
      try {
        setLoadingCarById(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) return null;
        return await res.json();
      } catch {
        setError("Error fetching car");
        return null;
      } finally {
        setLoadingCarById(false);
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cars?limit=${pageSize}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch cars");
        }
        const data = await res.json();
        if (cancelled) return;

        setCars(data.cars || []);
        setNextCursor(data.nextCursor ?? null);
        setHasMore(Boolean(data.hasMore));
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to fetch cars");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [pageSize]);

  return {
    cars,
    loading,
    fetchMore,
    getCarById,
    hasMore,
    error,
    refetch: fetchCars,
    loadingMore,
    loadingCarById,
  };
};
