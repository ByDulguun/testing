"use client";

import { CarType } from "@/types/car";
import React from "react";

type Props = {
  cars: CarType[];
  selectedCategory: string | null;
  selectedBrand: string[] | string; // incoming can be string
  setSelectedBrand: (v: string[]) => void;
};

export default function BrandChips({
  cars,
  selectedCategory,
  selectedBrand,
  setSelectedBrand,
}: Props) {
  // SAFELY convert to array
  const safeSelected = Array.isArray(selectedBrand) ? selectedBrand : [];

  // Collect all brands matching the selected category
  const brandCountMap: Record<string, number> = {};

  cars.forEach((c) => {
    if (c.category === selectedCategory) {
      brandCountMap[c.brand] = (brandCountMap[c.brand] || 0) + 1;
    }
  });

  const brandEntries = Object.entries(brandCountMap);

  if (brandEntries.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap my-4">
      {brandEntries.map(([brandName, count]) => {
        const active = safeSelected.includes(brandName);

        return (
          <button
            key={brandName}
            onClick={() => {
              if (active) {
                // remove brand
                setSelectedBrand(safeSelected.filter((b) => b !== brandName));
              } else {
                // add brand
                setSelectedBrand([...safeSelected, brandName]);
              }
            }}
            className={`px-3 py-1 rounded-full border text-sm transition
              ${
                active
                  ? "bg-[#E10600] text-white border-[#E10600]"
                  : "bg-white text-gray-800 border-gray-400"
              }
            `}
          >
            {brandName} ({count})
          </button>
        );
      })}
    </div>
  );
}
