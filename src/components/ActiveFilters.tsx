"use client";

import React from "react";
import { FiX } from "react-icons/fi";
import { FiltersSetter, FiltersState } from "@/hooks/useFilterState";
import { useTranslation } from "react-i18next";
import { useFxRates } from "@/hooks/UseFXRates";
import { FormatMoney } from "@/lib/FormatMoney";

type Props = {
  filters: FiltersState;
  setter: FiltersSetter;
  clearAll: () => void;
};

// Convert MNT → Currency (USD, RUB, KZT)
function convertMNT(
  amount: number,
  currency: string,
  rates: { USD: number; RUB: number; KZT: number } | null
) {
  if (!rates) return amount;

  switch (currency) {
    case "USD":
      return amount * rates.USD;
    case "RUB":
      return amount * rates.RUB;
    case "KZT":
      return amount * rates.KZT;
    default:
      return amount; // MNT
  }
}

export default function ActiveFilters({ filters, setter, clearAll }: Props) {
  const { i18n } = useTranslation();
  const rates = useFxRates();

  const currency =
    i18n.language === "en"
      ? "USD"
      : i18n.language === "ru"
      ? "RUB"
      : i18n.language === "kz"
      ? "KZT"
      : "MNT";

  const selectedBrand = Array.isArray(filters.selectedBrand)
    ? filters.selectedBrand
    : [];

  const {
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

  const hasFilters =
    selectedBrand.length > 0 ||
    selectedModel ||
    selectedFuel ||
    selectedColor ||
    selectedBody ||
    selectedSteering ||
    selectedTransmission ||
    selectedPrice.min ||
    selectedPrice.max ||
    selectedYear.min ||
    selectedYear.max ||
    selectedMileage.min ||
    selectedMileage.max ||
    selectedEngine.min ||
    selectedEngine.max ||
    selectedSeats.min ||
    selectedSeats.max;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* CLEAR ALL */}
      <button
        onClick={clearAll}
        className="flex items-center gap-1 bg-gray-300 px-3 py-1 rounded-full text-sm text-gray-800"
      >
        Clear All
        <FiX size={14} />
      </button>

      {/* BRAND */}
      {selectedBrand.map((brand) => (
        <button
          key={brand}
          onClick={() =>
            setter.setSelectedBrand(selectedBrand.filter((b) => b !== brand))
          }
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          {brand}
          <FiX size={12} />
        </button>
      ))}

      {/* MODEL */}
      {selectedModel && (
        <button
          onClick={() => setter.setSelectedModel(null)}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Model: {selectedModel}
          <FiX size={12} />
        </button>
      )}

      {/* COLOR */}
      {selectedColor && (
        <button
          onClick={() => setter.setSelectedColor(null)}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Color: {selectedColor}
          <FiX size={12} />
        </button>
      )}

      {/* FUEL */}
      {selectedFuel && (
        <button
          onClick={() => setter.setSelectedFuel(null)}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Fuel: {selectedFuel}
          <FiX size={12} />
        </button>
      )}

      {/* BODY */}
      {selectedBody && (
        <button
          onClick={() => setter.setSelectedBody(null)}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Body: {selectedBody}
          <FiX size={12} />
        </button>
      )}

      {/* STEERING */}
      {selectedSteering && (
        <button
          onClick={() => setter.setSelectedSteering(null)}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Steering: {selectedSteering}
          <FiX size={12} />
        </button>
      )}

      {/* TRANSMISSION */}
      {selectedTransmission && (
        <button
          onClick={() => setter.setSelectedTransmission(null)}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          {selectedTransmission}
          <FiX size={12} />
        </button>
      )}

      {/* PRICE RANGE (FX formatted) */}
      {(selectedPrice.min || selectedPrice.max) && (
        <button
          onClick={() => setter.setSelectedPrice({ min: null, max: null })}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Price:{" "}
          {selectedPrice.min
            ? FormatMoney(
                convertMNT(Number(selectedPrice.min), currency, rates),
                currency,
                i18n.language
              )
            : "0"}{" "}
          -{" "}
          {selectedPrice.max
            ? FormatMoney(
                convertMNT(Number(selectedPrice.max), currency, rates),
                currency,
                i18n.language
              )
            : "∞"}
          <FiX size={12} />
        </button>
      )}

      {/* YEAR RANGE */}
      {(selectedYear.min || selectedYear.max) && (
        <button
          onClick={() => setter.setSelectedYear({ min: null, max: null })}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Year: {selectedYear.min ?? "0"} - {selectedYear.max ?? "∞"}
          <FiX size={12} />
        </button>
      )}

      {/* MILEAGE */}
      {(selectedMileage.min || selectedMileage.max) && (
        <button
          onClick={() => setter.setSelectedMileage({ min: null, max: null })}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Km: {selectedMileage.min ?? "0"} - {selectedMileage.max ?? "∞"}
          <FiX size={12} />
        </button>
      )}

      {/* ENGINE CC */}
      {(selectedEngine.min || selectedEngine.max) && (
        <button
          onClick={() => setter.setSelectedEngine({ min: null, max: null })}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Eng.cc: {selectedEngine.min ?? "0"} - {selectedEngine.max ?? "∞"}
          <FiX size={12} />
        </button>
      )}

      {/* SEATS */}
      {(selectedSeats.min || selectedSeats.max) && (
        <button
          onClick={() => setter.setSelectedSeats({ min: null, max: null })}
          className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border text-sm"
        >
          Seats: {selectedSeats.min ?? "0"} - {selectedSeats.max ?? "∞"}
          <FiX size={12} />
        </button>
      )}
    </div>
  );
}
