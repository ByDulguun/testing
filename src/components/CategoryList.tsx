"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { categories } from "@/data/category";
import { CarType } from "@/types/car";

type Props = {
  cars: CarType[];
  selectedCategory: string | null;
  setSelectedCategory: (v: string | null) => void;
  setSelectedBrand: (v: string[]) => void;
};

export default function CategoryList({
  cars,
  selectedCategory,
  setSelectedCategory,
  setSelectedBrand,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-white rounded-md overflow-hidden mb-4">
      <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200">
        <p className="text-base font-semibold text-gray-800">
          {t("category.title")}
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="flex flex-wrap gap-4 py-4 px-4">
          {categories.map((cat) => {
            const count = cars.filter(
              (c) => c.bodyType?.toLowerCase() === cat.type.toLowerCase()
            ).length;

            const isActive =
              selectedCategory?.toLowerCase() === cat.type.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => {
                  const newValue =
                    selectedCategory === cat.type.toLowerCase()
                      ? null
                      : cat.type.toLowerCase();

                  setSelectedCategory(newValue);

                  if (newValue === null) {
                    setSelectedBrand([]);
                  }
                }}
                className={`flex cursor-pointer items-center w-fit px-2 py-2 rounded-md ${
                  isActive ? "border border-red-500" : "border border-gray-300"
                }`}
              >
                <Image src={cat.image} alt={cat.type} width={50} height={50} />
                <div className="text-base font-medium flex items-center gap-1">
                  <p>{t(`categories.${cat.type.toLowerCase()}`)}</p>
                  <p className="text-gray-500">({count})</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
