"use client";

// import { LanguageContext } from "@/context/LanguageContext";
import Image from "next/image";
import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { GrLanguage } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useCars } from "@/hooks/useCars";
import { BsWhatsapp } from "react-icons/bs";
import RegisterPage from "@/components/Register";
import LoginPage from "@/components/Login";
import { useAuthContext } from "@/context/AuthContext";
import VerifyEmailPage from "./VerifyEmail";
import ForgotPasswordPage from "./ForgotPassword";
import UserProfilePage from "./UserProfile";
import { FaRegUser } from "react-icons/fa";

export const Header: React.FC = () => {
  // const { changeLanguage, language } = useContext(LanguageContext);
  const { cars } = useCars();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user } = useAuthContext();

  const [ready, setReady] = useState(false);
  const [openLang, setOpenLang] = useState(false);

  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const [shown, setShown] = useState<[boolean, string, string | null]>([
    false,
    "",
    null,
  ]);

  const searchRefDesktop = useRef<HTMLDivElement>(null);
  const searchRefMobile = useRef<HTMLDivElement>(null);

  const weblogo =
    "https://res.cloudinary.com/dlt1zyjia/image/upload/v1764310149/header_logo_nmftlr.png";

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(lang).then(() => setReady(true));
  }, [i18n]);

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        searchRefDesktop.current &&
        !searchRefDesktop.current.contains(e.target as Node) &&
        searchRefMobile.current &&
        !searchRefMobile.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const brands = Array.from(new Set(cars.map((c) => c.brand)));
  const models = Array.from(new Set(cars.map((c) => c.model)));

  const filteredBrands = useMemo(() => {
    if (!query) return [];
    return brands.filter((b) => b.toLowerCase().includes(query.toLowerCase()));
  }, [query, brands]);

  const brandModels = useMemo(() => {
    const map: Record<string, string[]> = {};
    brands.forEach((b) => {
      const brandCars = cars.filter(
        (c) => c.brand.toLowerCase() === b.toLowerCase(),
      );
      map[b] = Array.from(new Set(brandCars.map((c) => c.model)));
    });
    return map;
  }, [brands, cars]);

  const filteredModels = useMemo(() => {
    if (!query) return [];
    return models.filter((m) => m.toLowerCase().includes(query.toLowerCase()));
  }, [query, models]);

  const handleSearch = (term?: string) => {
    const q = (term || query).trim();
    if (!q) return;

    const updated = [q, ...recentSearches.filter((r) => r !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    setShowSuggestions(false);
    setQuery("");
    router.push(`/showroom?query=${encodeURIComponent(q)}`);
  };

  const openRegister = () => setShown([true, "register", null]);
  const openLogin = () => setShown([true, "login", null]);

  const renderSuggestions = () => (
    <div className="absolute top-11 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-40">
      {!query && recentSearches.length > 0 && (
        <div className="p-2 border-b border-gray-200">
          <div className="flex justify-between items-center mb-1 px-2">
            <p className="text-base xl:text-sm text-gray-500">
              {t("menu.recent_searches")}
            </p>
            <button
              onMouseDown={() => {
                setRecentSearches([]);
                localStorage.removeItem("recentSearches");
              }}
              className="text-base xl:text-[12px] text-red-500 hover:text-red-600"
            >
              {t("menu.clear")}
            </button>
          </div>
          {recentSearches.map((r) => (
            <button
              key={r}
              onMouseDown={() => handleSearch(r)}
              className="flex justify-between w-full px-3 py-1.5 hover:bg-gray-100 text-base"
            >
              {r}
              <FiSearch size={14} className="text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {/* Brands */}
      {filteredBrands.length > 0 && (
        <div className="p-2 border-b border-gray-200">
          <p className="text-xs text-gray-500 px-2 mb-1">{t("menu.brands")}</p>
          {filteredBrands.map((b) => (
            <div key={b} className="mb-2">
              <button
                onMouseDown={() => handleSearch(b)}
                className="block w-full text-left px-3 py-1.5 font-medium hover:bg-gray-100 text-base text-[#E10600]"
              >
                {b}
              </button>

              {brandModels[b]?.length > 0 && (
                <div className="ml-4 border-l pl-2 border-gray-200">
                  {brandModels[b].map((m) => (
                    <button
                      key={m}
                      onMouseDown={() => handleSearch(m)}
                      className="block w-full text-left px-3 py-1 text-base text-gray-600 hover:bg-gray-100"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Models */}
      {filteredModels.length > 0 && (
        <div className="p-2">
          <p className="text-xs text-gray-500 px-2 mb-1">{t("menu.models")}</p>
          {filteredModels.map((m) => (
            <button
              key={m}
              onMouseDown={() => handleSearch(m)}
              className="block w-full text-left px-3 py-1.5 hover:bg-gray-100 text-base"
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Empty */}
      {query && filteredBrands.length === 0 && filteredModels.length === 0 && (
        <p className="text-gray-500 text-base p-3 text-center">
          {t("menu.no_results")}
        </p>
      )}
    </div>
  );

  if (!ready) return null;

  return (
    <header className="mx-auto grid h-fit border-b border-b-gray-300">
      {shown[0] && shown[1] === "register" && (
        <RegisterPage setShown={setShown} />
      )}
      {shown[0] && shown[1] === "login" && <LoginPage setShown={setShown} />}
      {shown[0] && shown[1] === "verify" && (
        <VerifyEmailPage setShown={setShown} email={shown[2]} />
      )}
      {shown[0] && shown[1] === "forgot" && (
        <ForgotPasswordPage setShown={setShown} />
      )}
      {shown[0] && shown[1] === "profile" && (
        <UserProfilePage
          setShown={(v: [boolean, string]) => setShown([v[0], v[1], null])}
        />
      )}

      <div className="flex justify-between items-center px-4 gap-2">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src={weblogo}
            alt="logo"
            // fill
            priority
            className="object-contain"
            sizes="180"
            width={180}
            height={60}
          />
        </div>

        <div
          ref={searchRefDesktop}
          className="relative border hidden xl:flex flex-1 border-gray-300 rounded-md px-4 py-2 items-center bg-white"
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setTimeout(() => setShowSuggestions(true), 10)}
            placeholder={t("search.placeholder")}
            className="w-full outline-none text-base"
          />

          <button
            onClick={() => handleSearch()}
            className="text-gray-600 hover:text-[#E10600]"
          >
            <FiSearch size={18} />
          </button>

          {showSuggestions && renderSuggestions()}
        </div>

        <div className=" flex items-center gap-6">
          {user ? (
            <div
              className="font-medium text-gray-700 cursor-pointer"
              onClick={() => setShown([true, "profile", null])}
            >
              <p className="hidden xl:block">{user.email}</p>
              <FaRegUser size={24} className="visible xl:hidden" />
            </div>
          ) : (
            <div className="flex gap-2">
              <button className="cursor-pointer" onClick={openLogin}>
                {t("menu.login")}
              </button>
              <p className="hidden xl:flex">/</p>
              <button
                className="cursor-pointer hidden xl:flex"
                onClick={openRegister}
              >
                {t("menu.register")}
              </button>
            </div>
          )}

          <a
            title="WhatsApp"
            href="https://api.whatsapp.com/send?phone=85263809242"
            target="_blank"
            className="flex items-center gap-2"
            rel="noopener"
          >
            <p className="text-green-600 hidden xl:flex">WhatsApp</p>
            <BsWhatsapp color="green" size={24} />
          </a>

          <div className="relative">
            <button
              onClick={() => setOpenLang(!openLang)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <GrLanguage size={20} />
              {/* <span>{language.toUpperCase()}</span> */}
            </button>

            {/* {openLang && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 rounded shadow z-40">
                {["en", "mn", "ru", "kk"].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => {
                      changeLanguage(lng);
                      setOpenLang(false);
                    }}
                    className={`block w-full text-left px-3 py-1 text-base ${
                      language === lng ? "bg-gray-200" : "hover:bg-gray-100"
                    }`}
                  >
                    {lng === "en"
                      ? t("lang.english")
                      : lng === "mn"
                        ? t("lang.mongolian")
                        : lng === "ru"
                          ? t("lang.russian")
                          : t("lang.kazakh")}
                  </button>
                ))}
              </div>
            )} */}
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
      </div>

      {/* SEARCH MOBILE */}
      <div
        ref={searchRefMobile}
        className="border min-w-[300px] flex xl:hidden border-gray-300 rounded-md px-4 mx-3 py-2 mb-4 items-center mt-2 relative bg-white"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => setTimeout(() => setShowSuggestions(true), 10)}
          placeholder={t("search.placeholder")}
          className="w-full outline-none text-base"
        />

        <button
          onClick={() => handleSearch()}
          className="text-gray-600 hover:text-[#E10600]"
        >
          <FiSearch size={18} />
        </button>

        {showSuggestions && renderSuggestions()}
      </div>

      {/* MOBILE DRAWER FIXED + NO BLACK BARS */}
    </header>
  );
};
