"use client";

import { useEffect, useState } from "react";

export type RangeFilter = {
  min: string | null;
  max: string | null;
};

export type FiltersState = {
  selectedCategory: string | null;
  selectedBrand: string[];
  selectedModel: string | null;
  selectedFuel: string | null;
  selectedColor: string | null;
  selectedBody: string | null;
  selectedSteering: string | null;
  selectedTransmission: string | null;
  selectedPrice: RangeFilter;
  selectedYear: RangeFilter;
  selectedMileage: RangeFilter;
  selectedEngine: RangeFilter;
  selectedSeats: RangeFilter;
  sortBy: string;
};

export type FiltersSetter = {
  setSelectedCategory: (v: string | null) => void;
  setSelectedBrand: (v: string[]) => void;
  setSelectedModel: (v: string | null) => void;
  setSelectedFuel: (v: string | null) => void;
  setSelectedColor: (v: string | null) => void;
  setSelectedBody: (v: string | null) => void;
  setSelectedSteering: (v: string | null) => void;
  setSelectedTransmission: (v: string | null) => void;
  setSelectedPrice: (v: RangeFilter) => void;
  setSelectedYear: (v: RangeFilter) => void;
  setSelectedMileage: (v: RangeFilter) => void;
  setSelectedEngine: (v: RangeFilter) => void;
  setSelectedSeats: (v: RangeFilter) => void;
  setSortBy: (v: string) => void;
};

const defaultRange = { min: null, max: null };

export const useFilterState = () => {
  const readInitial = (): Partial<FiltersState> => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("carFilters") || "{}");
    } catch {
      return {};
    }
  };

  const initial = readInitial();

  const [filters, setFilters] = useState<FiltersState>({
    selectedCategory: initial.selectedCategory ?? null,
    selectedBrand: Array.isArray(initial.selectedBrand)
      ? initial.selectedBrand
      : [],
    selectedModel: initial.selectedModel ?? null,
    selectedFuel: initial.selectedFuel ?? null,
    selectedColor: initial.selectedColor ?? null,
    selectedBody: initial.selectedBody ?? null,
    selectedSteering: initial.selectedSteering ?? null,
    selectedTransmission: initial.selectedTransmission ?? null,
    selectedPrice: initial.selectedPrice ?? defaultRange,
    selectedYear: initial.selectedYear ?? defaultRange,
    selectedMileage: initial.selectedMileage ?? defaultRange,
    selectedEngine: initial.selectedEngine ?? defaultRange,
    selectedSeats: initial.selectedSeats ?? defaultRange,
    sortBy: initial.sortBy ?? "newest",
  });

  const setter: FiltersSetter = {
    setSelectedCategory: (v) =>
      setFilters((p) => ({ ...p, selectedCategory: v })),
    setSelectedBrand: (v) => setFilters((p) => ({ ...p, selectedBrand: v })),
    setSelectedModel: (v) => setFilters((p) => ({ ...p, selectedModel: v })),
    setSelectedFuel: (v) => setFilters((p) => ({ ...p, selectedFuel: v })),
    setSelectedColor: (v) => setFilters((p) => ({ ...p, selectedColor: v })),
    setSelectedBody: (v) => setFilters((p) => ({ ...p, selectedBody: v })),
    setSelectedSteering: (v) =>
      setFilters((p) => ({ ...p, selectedSteering: v })),
    setSelectedTransmission: (v) =>
      setFilters((p) => ({ ...p, selectedTransmission: v })),
    setSelectedPrice: (v) => setFilters((p) => ({ ...p, selectedPrice: v })),
    setSelectedYear: (v) => setFilters((p) => ({ ...p, selectedYear: v })),
    setSelectedMileage: (v) =>
      setFilters((p) => ({ ...p, selectedMileage: v })),
    setSelectedEngine: (v) => setFilters((p) => ({ ...p, selectedEngine: v })),
    setSelectedSeats: (v) => setFilters((p) => ({ ...p, selectedSeats: v })),
    setSortBy: (v) => setFilters((p) => ({ ...p, sortBy: v })),
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = setTimeout(() => {
      localStorage.setItem("carFilters", JSON.stringify(filters));
    }, 200);
    return () => clearTimeout(id);
  }, [filters]);

  const [showMobile, setShowMobile] = useState(false);

  const clearAll = () => {
    setFilters({
      selectedCategory: null,
      selectedBrand: [],
      selectedModel: null,
      selectedFuel: null,
      selectedColor: null,
      selectedBody: null,
      selectedSteering: null,
      selectedTransmission: null,
      selectedPrice: defaultRange,
      selectedYear: defaultRange,
      selectedMileage: defaultRange,
      selectedEngine: defaultRange,
      selectedSeats: defaultRange,
      sortBy: "newest",
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("carFilters");
    }
  };

  return {
    filters,
    setter,
    clearAll,
    showMobile,
    openMobile: () => setShowMobile(true),
    closeMobile: () => setShowMobile(false),
  };
};
