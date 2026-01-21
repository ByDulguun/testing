"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useTranslation } from "react-i18next";

type Option = { value: string; label: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  count: number;
};

export default function SortSelect({ value, onChange, count }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const options: Option[] = [
    { value: "newest", label: t("sort.newest") },
    { value: "price-low", label: t("sort.price_low") },
    { value: "price-high", label: t("sort.price_high") },
    { value: "mileage-low", label: t("sort.mileage_low") },
  ];

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || options[0].label;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
      <p className="text-gray-600 text-base">{t("cars.found", { count })}</p>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="w-48 bg-white border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center text-base text-gray-800 hover:border-[#15151E] focus:ring-2 focus:ring-[#15151E]/40 transition cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {selectedLabel}
          <FiChevronDown
            size={16}
            className={`transition-transform ${
              open ? "rotate-180 text-[#15151E]" : "text-gray-500"
            }`}
          />
        </button>

        {open && (
          <ul
            title="ul"
            role="listbox"
            className="absolute right-0 z-10 w-48 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-auto animate-fadeIn"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-base cursor-pointer hover:bg-[#15151E]/10 ${
                  opt.value === value
                    ? "text-[#15151E] font-medium"
                    : "text-gray-700"
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
