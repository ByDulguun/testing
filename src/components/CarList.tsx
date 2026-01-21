"use client";

import { CarType } from "@/types/car";
import type { i18n as I18nType } from "i18next";
import { CarCard } from "./CarCard";

type Props = {
  cars: CarType[];
  convertPrice: (mntPrice: number) => number;
  targetCurrency: string;
  i18n: I18nType;
};

export default function CarList({
  cars,
  convertPrice,
  targetCurrency,
  i18n,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 transition-all">
      {cars.map((car, idx) => (
        <CarCard
          key={car.id}
          car={car}
          convertPrice={convertPrice}
          targetCurrency={targetCurrency}
          i18n={i18n}
          priority={idx === 0}
        />
      ))}
    </div>
  );
}
