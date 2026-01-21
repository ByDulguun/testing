"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CarType } from "@/types/car";

type FavoriteContextType = {
  favorites: CarType[];
  toggleFavorite: (car: CarType) => void;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<CarType[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        const parsed: CarType[] = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
    } catch (err) {
      console.error("Failed to parse favorites:", err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites, loaded]);

  const toggleFavorite = (car: CarType) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === car.id);
      return exists ? prev.filter((f) => f.id !== car.id) : [...prev, car];
    });
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoriteContext);
  if (!ctx)
    throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
