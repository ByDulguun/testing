"use client";

import { useDeferredValue, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FiltersState } from "./useFilterState";
import { CarType } from "@/types/car";
import type { i18n as I18nType } from "i18next";

type Rates = {
  USD: number;
  RUB: number;
  KZT: number;
};

type Props = {
  cars: CarType[];
  filters: FiltersState;
  rates: Rates | null;
  i18n: I18nType;
};

export const useFilteredCars = ({ cars, filters, rates, i18n }: Props) => {
  const searchParams = useSearchParams();
  const query = (searchParams.get("query") || "").toLowerCase();
  const deferredQuery = useDeferredValue(query);

  const langToCurrency: Record<string, "MNT" | "USD" | "RUB" | "KZT"> = {
    mn: "MNT",
    en: "USD",
    ru: "RUB",
    kk: "KZT",
  };

  const targetCurrency =
    langToCurrency[i18n.language as keyof typeof langToCurrency] || "MNT";

  const convertPrice = (mntPrice: number) => {
    if (!rates) return mntPrice;
    switch (targetCurrency) {
      case "USD":
        return mntPrice * rates.USD;
      case "RUB":
        return mntPrice * rates.RUB;
      case "KZT":
        return mntPrice * rates.KZT;
      default:
        return mntPrice;
    }
  };

  const filteredCars = useMemo(() => {
    if (!cars?.length) return [] as CarType[];
    let result = [...cars];

    const {
      selectedCategory,
      selectedBrand,
      selectedModel,
      selectedFuel,
      selectedColor,
      selectedBody,
      selectedSteering,
      selectedTransmission,
      selectedPrice,
      selectedYear,
      selectedMileage,
      selectedEngine,
      selectedSeats,
    } = filters;

    if (deferredQuery) {
      result = result.filter(
        (c) =>
          c.brand.toLowerCase().includes(deferredQuery) ||
          c.model.toLowerCase().includes(deferredQuery)
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (c) => c.bodyType?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (Array.isArray(selectedBrand) && selectedBrand.length > 0) {
      const lowerBrands = selectedBrand.map((b) => String(b).toLowerCase());
      result = result.filter((c) =>
        lowerBrands.includes(c.brand.toLowerCase())
      );
    }

    if (selectedModel) {
      const lower = selectedModel.toLowerCase();
      result = result.filter((c) => c.model?.toLowerCase() === lower);
    }

    if (selectedFuel) {
      const lower = selectedFuel.toLowerCase();
      result = result.filter((c) => c.fuelType?.toLowerCase() === lower);
    }

    if (selectedColor) {
      const lower = selectedColor.toLowerCase();
      result = result.filter((c) => c.color?.toLowerCase() === lower);
    }

    if (selectedBody) {
      const lower = selectedBody.toLowerCase();
      result = result.filter((c) => c.bodyType?.toLowerCase() === lower);
    }

    if (selectedSteering) {
      const lower = selectedSteering.toLowerCase();
      result = result.filter((c) => (c.steering || "").toLowerCase() === lower);
    }

    if (selectedTransmission) {
      const lower = selectedTransmission.toLowerCase();
      result = result.filter(
        (c) => (c.transmission || "").toLowerCase() === lower
      );
    }

    if (selectedPrice.min || selectedPrice.max) {
      const min = Number(selectedPrice.min ?? 0);
      const max = Number(selectedPrice.max ?? 999999999);
      result = result.filter((c) => c.price >= min && c.price <= max);
    }

    if (selectedYear.min || selectedYear.max) {
      const min = Number(selectedYear.min ?? 1900);
      const max = Number(selectedYear.max ?? 3000);
      result = result.filter((c) => c.year >= min && c.year <= max);
    }

    if (selectedMileage.min || selectedMileage.max) {
      const min = Number(selectedMileage.min ?? 0);
      const max = Number(selectedMileage.max ?? 999999999);
      result = result.filter((c) => c.mileage >= min && c.mileage <= max);
    }

    if (selectedEngine.min || selectedEngine.max) {
      const min = Number(selectedEngine.min ?? 0);
      const max = Number(selectedEngine.max ?? 999999999);
      result = result.filter((c) => {
        const ec = Number(c.engineCapacity) || Number(c.engineCc) || 0;
        return ec >= min && ec <= max;
      });
    }

    if (selectedSeats.min || selectedSeats.max) {
      const min = Number(selectedSeats.min ?? 0);
      const max = Number(selectedSeats.max ?? 99);
      result = result.filter((c) => {
        const seats = Number(c.seats || 0);
        return seats >= min && seats <= max;
      });
    }

    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => b.year - a.year);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "mileage-low":
        result.sort((a, b) => a.mileage - b.mileage);
        break;
    }

    return result;
  }, [cars, filters, deferredQuery]);

  return {
    filteredCars,
    convertPrice,
    targetCurrency,
    query,
  };
};
