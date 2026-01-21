"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Image
        src="/empty.png"
        alt="no results"
        width={120}
        height={120}
        className="opacity-80 mb-4"
      />
      <h3 className="text-gray-700 font-semibold text-lg mb-2">
        {t("cars.no_results_title")}
      </h3>
      <p className="text-gray-500 text-base max-w-[300px]">
        {t("cars.no_results_text")}
      </p>
    </div>
  );
}
