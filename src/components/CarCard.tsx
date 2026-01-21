"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { CarType } from "@/types/car";
import { FormatMoney } from "@/lib/FormatMoney";
import type { i18n as I18nType } from "i18next";
import { shimmer, toBase64, buildImgUrl } from "@/utils/image";

const SHIMMER_700_280_BASE64 = toBase64(shimmer(700, 280));

type Props = {
  car: CarType;
  convertPrice: (mntPrice: number) => number;
  targetCurrency: string;
  i18n: I18nType;
  priority?: boolean;
};

export const CarCard = React.memo(function CarCard({
  car,
  convertPrice,
  targetCurrency,
  i18n,
  priority = false,
}: Props) {
  const { t } = useTranslation();
  const totalImages = car.images?.length ?? 0;
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"" | "left" | "right">("");

  const targetW = 640;
  const targetH = 160;

  const currentImageUrl = useMemo(
    () => buildImgUrl(car.images?.[index]?.url, targetW, targetH),
    [car.images, index]
  );

  const handleChange = useCallback(
    (dir: 1 | -1) => {
      if (totalImages < 2) return;
      setLoading(true);
      setIndex((i) => (i + dir + totalImages) % totalImages);
    },
    [totalImages]
  );

  const message = t("showroom_detail.whatsapp_message", {
    year: car.year,
    brand: car.brand,
    model: car.model,
    price: FormatMoney(convertPrice(car.price), targetCurrency, i18n.language),
    link: typeof window !== "undefined" ? window.location.href : "",
  });

  const whatsappUrl = `https://wa.me/85263809242?text=${encodeURIComponent(
    message
  )}`;

  return (
    <Link href={`/showroom/${car.id}`} className="block group relative">
      <div className="rounded-sm overflow-hidden relative cursor-pointer transition-all">
        {/* IMAGE */}
        <div className="relative w-full h-40 overflow-hidden">
          <Image
            key={index}
            src={currentImageUrl}
            alt={`${car.brand} ${car.model}`}
            fill
            quality={70}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            onLoadingComplete={() => setLoading(false)}
            className={`object-cover transition-all duration-500 ease-[cubic-bezier(.25,.8,.25,1)]
              ${
                loading
                  ? direction === "right"
                    ? "translate-x-12 opacity-0"
                    : "-translate-x-12 opacity-0"
                  : "translate-x-0 opacity-100"
              }`}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${SHIMMER_700_280_BASE64}`}
          />

          {loading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* WhatsApp */}
          <button
            title="WhatsApp"
            onClick={(event) => {
              event.preventDefault();
              window.open(whatsappUrl, "_blank");
              event.stopPropagation();
            }}
            className="absolute right-1.5 bottom-2 translate-x-20 group-hover:translate-x-0 duration-200 bg-green-500 hover:bg-green-600 
                       text-white p-2 rounded-full transition z-30 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                d="M.057 24l1.687-6.163a11.93 11.93 0 01-1.62-6.03C.122 5.355 5.48 0 12.061 0 
                       18.64 0 24 5.356 24 11.967c0 6.61-5.36 11.966-11.939 11.966a11.95 
                       11.95 0 01-6.077-1.616L.057 24zm6.597-3.807c1.676.995 3.276 1.591 
                       5.392 1.591 5.448 0 9.886-4.429 9.886-9.867 0-5.438-4.438-9.866-9.886-9.866
                       -5.447 0-9.887 4.428-9.887 9.866 0 2.225.735 3.83 1.962 5.514l-.999 
                       3.648 3.532-.886zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149
                       -1.758-.868-2.031-.967-.272-.099-.47-.148-.669.148-.198.297-.768.967-.941 
                       1.165-.173.198-.347.223-.644.074-.297-.148-1.255-.463-2.39-1.475-.883-.788
                       -1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
                       .149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.074-.148-.669-1.611
                       -.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372
                       -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 
                       2.095 3.198 5.08 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118
                       .571-.085 1.758-.719 2.007-1.413.248-.694.248-1.289.173-1.413z"
              />
            </svg>
          </button>

          {/* Prev/Next */}
          {totalImages > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={(e) => {
                  e.preventDefault();
                  setDirection("left");
                  handleChange(-1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 
                           bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 
                           cursor-pointer -translate-x-20 group-hover:translate-x-0 duration-100"
              >
                <FaChevronLeft size={18} />
              </button>

              <button
                aria-label="Next image"
                onClick={(e) => {
                  e.preventDefault();
                  setDirection("right");
                  handleChange(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 
                           bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 
                           cursor-pointer translate-x-20 group-hover:translate-x-0 duration-100"
              >
                <FaChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* TEXT */}
        <div className="py-2">
          <div className="flex gap-2">
            <p className="group-hover:text-[#E10600] font-semibold">
              {car.year} {car.brand}
            </p>
            <p className="group-hover:text-[#E10600] font-semibold">
              {car.model}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-base text-gray-500">
              {car.mileage.toString()}km | {car.fuelType} | {car.bodyType} |{" "}
              {(car as CarType).engineCapacity} |{" "}
              {t(`colors.${car.color.toLowerCase()}`)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
});
