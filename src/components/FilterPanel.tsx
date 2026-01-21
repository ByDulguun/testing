"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CarType } from "@/types/car";
import { BrandMultiSelect, FilterSelect, RangeSelect } from "@/functions";
import { FiX } from "react-icons/fi";
import {
  FiltersSetter,
  FiltersState,
  RangeFilter,
} from "@/hooks/useFilterState";
import { useFxRates } from "@/hooks/UseFXRates";
import { FormatMoney } from "@/lib/FormatMoney";

function convertMNT(
  amount: number,
  currency: string,
  rates?: Record<string, number> | null
) {
  if (!rates) return amount;

  const rate = rates[currency];
  if (!rate || rate <= 0) return amount;

  return amount * rate;
}
function priceBuckets(min: number, max: number) {
  const base = [
    0, 5_000_000, 10_000_000, 20_000_000, 30_000_000, 50_000_000, 75_000_000,
    100_000_000, 150_000_000, 200_000_000, 300_000_000, 400_000_000,
    500_000_000, 600_000_000, 700_000_000, 800_000_000, 900_000_000,
    1_000_000_000,
  ];

  const list = base.filter((v) => v >= min && v <= max);

  if (list.length === 0) return [min, max];

  const result = [...list];

  if (result[0] !== min) result.unshift(min);
  if (result[result.length - 1] !== max) result.push(max);

  return result;
}

function kmBuckets(min: number, max: number) {
  const base = [
    0, 10_000, 20_000, 50_000, 80_000, 100_000, 150_000, 200_000, 250_000,
    300_000, 400_000, 500_000,
  ];

  const list = base.filter((v) => v >= min && v <= max);
  if (list.length === 0) return [min, max];
  return list;
}

type Props = {
  cars: CarType[];
  filters: FiltersState;
  setter: FiltersSetter;
  clearAll: () => void;
  className?: string;
};

export default function FilterPanel({
  cars,
  filters,
  setter,
  clearAll,
  className,
}: Props) {
  const { t, i18n } = useTranslation();
  const rates = useFxRates();

  // LANGUAGE → CURRENCY
  const currency = useMemo(() => {
    if (i18n.language === "en") return "USD";
    if (i18n.language === "ru") return "RUB";
    if (i18n.language === "kz") return "KZT";
    return "MNT";
  }, [i18n.language]);

  // BRAND
  const brandOptions = useMemo(
    () => Array.from(new Set(cars.map((c) => c.brand))).sort(),
    [cars]
  );

  const safeBrands = useMemo(
    () => (Array.isArray(filters.selectedBrand) ? filters.selectedBrand : []),
    [filters.selectedBrand]
  );

  const modelOptions = useMemo(() => {
    const list =
      safeBrands.length > 0
        ? cars.filter((c) => safeBrands.includes(c.brand))
        : cars;

    return Array.from(new Set(list.map((c) => c.model))).sort();
  }, [cars, safeBrands]);

  // PRICE LIST
  const priceList = useMemo(() => {
    return cars
      .map((c) => Number(c.price))
      .filter((v) => !isNaN(v))
      .sort((a, b) => a - b);
  }, [cars]);

  const priceBucketList = useMemo(() => {
    if (priceList.length === 0) return [];
    return priceBuckets(priceList[0], priceList[priceList.length - 1]);
  }, [priceList]);

  const minPriceOptions = priceBucketList.map((mnt) => ({
    value: String(mnt), // filtering uses MNT
    label: FormatMoney(
      convertMNT(mnt, currency, rates),
      currency,
      i18n.language
    ),
  }));

  const maxPriceOptions = [...priceBucketList]
    .filter((v) => v >= Number(filters.selectedPrice.min || 0))
    .reverse()
    .map((mnt) => ({
      value: String(mnt),
      label: FormatMoney(
        convertMNT(mnt, currency, rates),
        currency,
        i18n.language
      ),
    }));

  // KM
  const kmList = useMemo(() => {
    return cars
      .map((c) => Number(c.mileage))
      .filter((v) => !isNaN(v))
      .sort((a, b) => a - b);
  }, [cars]);

  const kmBucketList = useMemo(() => {
    if (kmList.length === 0) return [];
    return kmBuckets(kmList[0], kmList[kmList.length - 1]);
  }, [kmList]);

  const kmOptions = kmBucketList.map((km) => ({
    value: String(km),
    label: km.toLocaleString() + " km",
  }));

  // STATIC OPTIONS
  const yearOptions = [
    { label: "2000", value: "2000" },
    { label: "2005", value: "2005" },
    { label: "2010", value: "2010" },
    { label: "2015", value: "2015" },
    { label: "2020", value: "2020" },
    { label: "2024", value: "2024" },
  ];

  const engineCcOptions = [
    { label: "1000", value: "1000" },
    { label: "1500", value: "1500" },
    { label: "2000", value: "2000" },
    { label: "2500", value: "2500" },
    { label: "3000", value: "3000" },
  ];

  const seatOptions = [
    { label: "2", value: "2" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
  ];

  // RANGE SETTER
  const setRange =
    (key: keyof FiltersState) =>
    (update: (prev: RangeFilter) => RangeFilter) => {
      const prev = filters[key] as RangeFilter;
      const next = update(prev);

      const fn = setter[
        ("set" +
          key.charAt(0).toUpperCase() +
          key.slice(1)) as keyof FiltersSetter
      ] as (v: RangeFilter) => void;
      fn(next);
    };

  return (
    <div className={`flex flex-col gap-5 ${className ?? ""}`}>
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="text-lg font-semibold">{t("filters.title")}</h3>

        <button
          onClick={clearAll}
          className="flex items-center gap-1 cursor-pointer text-[#E10600]"
        >
          <FiX size={16} />
          {t("filters.reset")}
        </button>
      </div>

      <div className="grid gap-4">
        <BrandMultiSelect
          label={t("filters.select_brand")}
          value={safeBrands}
          onChange={setter.setSelectedBrand}
          options={[
            { label: t("filters.all"), value: "" },
            ...brandOptions.map((b) => ({ label: b, value: b })),
          ]}
        />

        <FilterSelect
          value={filters.selectedModel}
          onChange={setter.setSelectedModel}
          options={[
            { label: t("filters.model"), value: null },
            ...modelOptions.map((m) => ({ label: m, value: m })),
          ]}
        />

        {/* YEAR */}
        <RangeSelect
          minPlaceholder={t("filters.min_year")}
          maxPlaceholder={t("filters.max_year")}
          minValue={filters.selectedYear.min}
          maxValue={filters.selectedYear.max}
          onMinChange={(v) =>
            setRange("selectedYear")((p) => ({ ...p, min: v }))
          }
          onMaxChange={(v) =>
            setRange("selectedYear")((p) => ({ ...p, max: v }))
          }
          minOptions={yearOptions}
          maxOptions={yearOptions}
        />

        {/* PRICE */}
        <RangeSelect
          minPlaceholder={t("filters.min_price")}
          maxPlaceholder={t("filters.max_price")}
          minValue={filters.selectedPrice.min}
          maxValue={filters.selectedPrice.max}
          onMinChange={(v) =>
            setRange("selectedPrice")((p) => ({ ...p, min: v }))
          }
          onMaxChange={(v) =>
            setRange("selectedPrice")((p) => ({ ...p, max: v }))
          }
          minOptions={minPriceOptions}
          maxOptions={maxPriceOptions}
        />

        {/* KM */}
        <RangeSelect
          minPlaceholder={t("filters.min_km")}
          maxPlaceholder={t("filters.max_km")}
          minValue={filters.selectedMileage.min}
          maxValue={filters.selectedMileage.max}
          onMinChange={(v) =>
            setRange("selectedMileage")((p) => ({ ...p, min: v }))
          }
          onMaxChange={(v) =>
            setRange("selectedMileage")((p) => ({ ...p, max: v }))
          }
          minOptions={kmOptions}
          maxOptions={[...kmOptions].reverse()}
        />

        {/* TRANSMISSION */}
        <FilterSelect
          value={filters.selectedTransmission}
          onChange={setter.setSelectedTransmission}
          options={[
            { label: t("filters.transmission"), value: null },
            { label: t("filters.automatic"), value: "automatic" },
            { label: t("filters.manual"), value: "manual" },
          ]}
        />

        {/* ENGINE */}
        <RangeSelect
          minPlaceholder={t("filters.min_engine")}
          maxPlaceholder={t("filters.max_engine")}
          minValue={filters.selectedEngine.min}
          maxValue={filters.selectedEngine.max}
          onMinChange={(v) =>
            setRange("selectedEngine")((p) => ({ ...p, min: v }))
          }
          onMaxChange={(v) =>
            setRange("selectedEngine")((p) => ({ ...p, max: v }))
          }
          minOptions={engineCcOptions}
          maxOptions={engineCcOptions}
        />

        {/* COLOR */}
        <FilterSelect
          value={filters.selectedColor}
          onChange={setter.setSelectedColor}
          options={[
            { label: t("filters.color"), value: null },
            ...Array.from(new Set(cars.map((c) => c.color))).map((c) => ({
              label: c,
              value: c,
            })),
          ]}
        />

        {/* FUEL */}
        <FilterSelect
          value={filters.selectedFuel}
          onChange={setter.setSelectedFuel}
          options={[
            { label: t("filters.fuel"), value: null },
            { label: t("filters.fuel_gasoline"), value: "gasoline" },
            { label: t("filters.fuel_diesel"), value: "diesel" },
            { label: t("filters.fuel_hybrid"), value: "hybrid" },
            { label: t("filters.fuel_electric"), value: "electric" },
          ]}
        />

        {/* SEATS */}
        <RangeSelect
          minPlaceholder={t("filters.min_seats")}
          maxPlaceholder={t("filters.max_seats")}
          minValue={filters.selectedSeats.min}
          maxValue={filters.selectedSeats.max}
          onMinChange={(v) =>
            setRange("selectedSeats")((p) => ({ ...p, min: v }))
          }
          onMaxChange={(v) =>
            setRange("selectedSeats")((p) => ({ ...p, max: v }))
          }
          minOptions={seatOptions}
          maxOptions={seatOptions}
        />
      </div>
    </div>
  );
}
