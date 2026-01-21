"use client";

import { useCars } from "@/hooks/useCars";
import { CarType } from "@/types/car";
import Image, { ImageProps } from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFxRates } from "@/hooks/UseFXRates";
import { FormatMoney } from "@/lib/FormatMoney";
import { MdOutlineAccessTime } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { GrNotes } from "react-icons/gr";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useHighestBid } from "@/hooks/useHighestBid";
import BidModal from "@/components/BidModal";
import { CarCard } from "@/components/CarCard";

/* -------------------- Utilities -------------------- */
function isCloudinary(src: string) {
  try {
    const u = new URL(src);
    return u.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

const DPR = 1;
function cldUrl(src: string, w: number, h: number, q = 60) {
  if (!src || !isCloudinary(src)) return src;
  const hasQuery = src.includes("?");
  const qp = `f=auto&q=${q}&fit=crop&w=${w}&h=${h}&dpr=${DPR}`;
  return `${src}${hasQuery ? "&" : "?"}${qp}`;
}

type SafeImageProps = Omit<ImageProps, "src"> & {
  src: string;
  alt: string;
  fallbackSrc?: string;
  cldSize?: { w: number; h: number } | null;
  forceLowResAfterMs?: number;
};

function SafeImage({
  src,
  fallbackSrc = "https://placehold.co/800x508/png?text=No+Image",
  cldSize,
  forceLowResAfterMs = 3000,
  ...rest
}: SafeImageProps) {
  const [err, setErr] = useState(false);
  const [useLowRes, setUseLowRes] = useState(false);

  useEffect(() => {
    if (!forceLowResAfterMs) return;
    const id = setTimeout(() => setUseLowRes(true), forceLowResAfterMs);
    return () => clearTimeout(id);
  }, [src, forceLowResAfterMs]);

  const isCld = isCloudinary(src);
  const finalSrc = err
    ? fallbackSrc
    : cldSize
      ? cldUrl(src, cldSize.w, cldSize.h, useLowRes ? 50 : 60)
      : src;

  return (
    <Image
      {...rest}
      src={finalSrc}
      unoptimized={!isCld}
      onError={() => setErr(true)}
      alt={rest.alt || "Car Image"}
    />
  );
}

/* -------------------- Countdown -------------------- */
function Countdown({ expiryTime }: { expiryTime: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = new Date(expiryTime).getTime() - now;
  if (diff <= 0) return <span>Expired</span>;
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff / 36e5) % 24);
  const m = Math.floor((diff / 6e4) % 60);
  const s = Math.floor((diff / 1e3) % 60);
  return (
    <span aria-live="polite" className=" flex items-center gap-2">
      <div className="bg-white w-[50px] h-fit rounded-sm  text-center grid items-center">
        <p className="font-semibold text-black">{d}</p>
        <p className="text-base text-gray-500">days</p>
      </div>
      <div className="bg-white w-[50px] h-fit rounded-sm  text-center grid items-center">
        <p className="font-semibold text-black">{h}</p>
        <p className="text-base text-gray-500">hours</p>
      </div>
      <div className="bg-white w-[50px] h-fit rounded-sm  text-center grid items-center">
        <p className="font-semibold text-black">{m}</p>
        <p className="text-base text-gray-500">mins</p>
      </div>
      <div className="bg-white w-[50px] h-fit rounded-sm   text-center grid items-center">
        <p className="font-semibold text-black">{s}</p>
        <p className="text-base text-gray-500">secs</p>
      </div>
    </span>
  );
}

/* -------------------- Skeleton -------------------- */
function CarDetailSkeleton() {
  return (
    <main className="min-h-screen flex flex-col gap-8 animate-pulse py-24">
      <div className="px-40 grid h-fit gap-2">
        <div className="w-full max-w-md h-8 bg-gray-300 rounded-md" />
        <div className="w-full max-w-sm h-6 bg-gray-300 rounded-md" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full pt-2 ">
        <div className="w-[800px] h-[500px] bg-gray-200 rounded-xl" />
        <div className="flex flex-col gap-2">
          <div className="w-[350px] h-[250px] bg-gray-200 rounded-lg" />
          <div className="w-[350px] h-[250px] bg-gray-200 rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-[350px] h-[250px] bg-gray-200 rounded-lg" />
          <div className="w-[350px] h-[250px] bg-gray-200 rounded-lg" />
        </div>
      </div>
      <section className="px-10 md:px-40 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full h-[280px] bg-gray-200 rounded-lg" />
          ))}
        </div>
      </section>
    </main>
  );
}
function formatHKD(dateString: string) {
  const date = new Date(dateString);

  // Convert to Hong Kong Time
  const hktDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }),
  );

  const year = hktDate.getFullYear();
  const month = hktDate.getMonth() + 1;
  const day = hktDate.getDate();

  const hours = String(hktDate.getHours()).padStart(2, "0"); // 24-hour format
  const minutes = String(hktDate.getMinutes()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes} (HKD)`;
}

/* -------------------- Main Page -------------------- */
export default function CarDetailPage() {
  const { id } = useParams();
  const { cars, getCarById, loadingCarById } = useCars();
  const [car, setCar] = useState<CarType | null>(null);

  const fetchedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const { t, i18n } = useTranslation();
  const rates = useFxRates();
  const [activeIndex, setActiveIndex] = useState(0);
  const totalImages = car?.images.length ?? 0;
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };
  const [showBid, setShowBid] = useState(false);
  const { highestBid, refreshBid } = useHighestBid(car?.id || "");

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalImages);
  };

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

  useEffect(() => {
    if (fetchedRef.current || !id) return;
    fetchedRef.current = true;
    (async () => {
      try {
        const data = await getCarById(id as string);
        setCar(data);
      } catch (e) {
        console.error("Failed fetching car:", e);
      }
    })();
  }, [id, getCarById]);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang).finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [i18n]);

  const relatedCars = useMemo(() => {
    if (!car || !cars?.length) return [] as CarType[];
    return cars
      .filter(
        (c) =>
          c.id !== car.id &&
          (c.brand === car.brand || c.bodyType === car.bodyType),
      )
      .slice(0, 4);
  }, [cars, car]);

  useEffect(() => {
    if (!car?.images?.length) return;
    if (typeof window === "undefined" || !("Image" in window)) return;

    const preloadList = car.images.slice(1, 5).map((i) => i.url);
    preloadList.forEach((u) => {
      const img = new window.Image();
      img.src = isCloudinary(u) ? cldUrl(u, 800, 508, 55) : u;
    });
  }, [car]);

  if (loadingCarById || !ready) return <CarDetailSkeleton />;
  if (!car)
    return (
      <main className="min-h-screen flex justify-center items-center text-gray-500">
        {t("cars.no_results_title")}
      </main>
    );

  const message = t("showroom_detail.whatsapp_message", {
    year: car.year,
    brand: car.brand,
    model: car.model,
    price: FormatMoney(convertPrice(car.price), targetCurrency, i18n.language),
    link: typeof window !== "undefined" ? window.location.href : "",
  });

  const whatsappUrl = `https://wa.me/85263809242?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <main className="bg-[#f0f2f3] py-12 grid gap-10 w-full relative px-10 md:px-40 ">
      <div className="w-full bg-white rounded-md h-fit px-4 py-4 flex">
        <div className="flex1 max-w-[600px] ">
          <div className="bg-white  p-6 ">
            <h2 className="font-semibold text-xl mb-4">Auction Information</h2>

            {/* Time Left */}
            <div className="flex items-center gap-3 bg-[#E10600] text-white w-fit py-2 px-4 rounded-md mb-3">
              <MdOutlineAccessTime />
              <span>Time left:</span>
              <Countdown expiryTime={car.expiryTime} />
            </div>

            {/* Submission deadline */}
            <div className="flex items-center gap-2 text-gray-800 mb-4">
              <MdOutlineAccessTime size={20} />
              <p className="font-medium">Submission deadline</p>
              <p className="font-semibold">{formatHKD(car.expiryTime)}</p>
            </div>

            {/* Car Title */}
            <p className="font-semibold text-2xl mt-4">
              {car.year} {car.brand} {car.model}
            </p>

            {/* Main Image + Gallery */}
            <div className="mt-4">
              <div className="relative w-fit group overflow-hidden">
                {/* MAIN IMAGE */}
                <SafeImage
                  src={car.images[activeIndex]?.url || ""}
                  alt="Main car image"
                  width={650}
                  height={450}
                  quality={70}
                />

                {/* LEFT BUTTON */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 group-hover:translate-x-0 transition duration-200 cursor-pointer -translate-x-20 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-2 rounded-full shadow"
                >
                  <FiChevronLeft size={24} />
                </button>

                {/* RIGHT BUTTON */}
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 group-hover:translate-x-0 transition translate-x-20 duration-200 cursor-pointer -translate-y-1/2 bg-white/70 hover:bg-white text-black p-2 rounded-full shadow"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>

              <div className="flex flex-wrap  gap-4 mt-3">
                {car.images.map((img, idx) => (
                  <button
                    key={img.public_id}
                    onClick={() => setActiveIndex(idx)}
                    className={`border  cursor-pointer w-fit ${
                      idx === activeIndex
                        ? "border-[#E10600] scale-105"
                        : "border-gray-300"
                    } transition`}
                  >
                    <SafeImage
                      src={img.url}
                      alt="thumbnail"
                      width={80}
                      height={80}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 grid h-fit gap-2 px-4 bg-white p-6">
          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <BsCash color="green" size={22} />
            <p className="font-medium">Starting Price</p>
            <p className="font-semibold text-lg">
              {FormatMoney(
                convertPrice(car.price),
                targetCurrency,
                i18n.language,
              )}
            </p>
          </div>

          <h3 className="font-semibold text-lg flex items-center gap-1">
            <GrNotes /> Specifications
          </h3>

          {/* Main Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3 pb-4 border-b">
            <SpecItem label="Mileage" value={`${car.mileage} km`} />
            <SpecItem label="Year" value={car.year} />
            <SpecItem label="Engine Size" value={`${car.engineCapacity} cc`} />
            <SpecItem label="Transmission" value={car.bodyType} />
            <SpecItem label="Drive" value={car.bodyType} />
            <SpecItem label="Fuel" value={car.fuelType} />
          </div>

          {/* Extra details */}
          <div className="mt-4 space-y-3">
            <DetailRow label="Ref No" value={car.vin} />
            <DetailRow label="Chassis No" value={car.bodyType} />
            <DetailRow label="Registration Year" value={car.year} />
            <DetailRow label="Color" value={car.color} />
            <DetailRow label="Steering" value={car.bodyType} />
            <DetailRow label="Seats" value={car.bodyType} />
          </div>
        </div>
        <div className="flex-1">
          {/* Highest Bid */}
          <div className="flex items-center gap-2 mb-2">
            <p className="font-medium">Highest Bid:</p>
            <p className="font-semibold text-lg">
              {highestBid
                ? FormatMoney(
                    convertPrice(highestBid),
                    targetCurrency,
                    i18n.language,
                  )
                : "No bids yet"}
            </p>
          </div>

          <button
            onClick={() => setShowBid(true)}
            className="bg-[#E10600] text-white px-4 py-2 rounded-md"
          >
            Place Bid
          </button>
          {showBid && car.id && (
            <BidModal
              carId={car.id}
              onClose={() => setShowBid(false)}
              onSuccess={refreshBid}
            />
          )}
        </div>
      </div>
      {relatedCars.length > 0 && (
        <section className="">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {t("showroom_detail.related_cars")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedCars.map((rc) => (
              <CarCard
                key={rc.id}
                car={rc}
                convertPrice={convertPrice}
                targetCurrency={targetCurrency}
                i18n={i18n}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
function SpecItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-base text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="flex justify-between text-gray-800 border-b pb-2">
      <p>{label}</p>
      <p className="font-semibold">{value || "N/A"}</p>
    </div>
  );
}
