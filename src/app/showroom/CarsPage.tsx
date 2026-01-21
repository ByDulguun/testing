"use client";

import { useTranslation } from "react-i18next";
import { useCars } from "@/hooks/useCars";
import { useFxRates } from "@/hooks/UseFXRates";

import { LuFilter } from "react-icons/lu";
import { IoClose, IoSearch } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useFilterState } from "@/hooks/useFilterState";
import FilterPanel from "@/components/FilterPanel";
import CategoryList from "@/components/CategoryList";
import BrandChips from "@/components/BrandChips";
import ActiveFilters from "@/components/ActiveFilters";
import EmptyState from "@/components/EmptyState";
import CarList from "@/components/CarList";
import SortSelect from "@/components/SortSelect";
import { useFilteredCars } from "@/hooks/useFilteredCars";

export default function CarsPage() {
  const { t, i18n } = useTranslation();
  const { cars, loading, fetchMore, loadingMore, hasMore } = useCars(16);
  const rates = useFxRates();

  const { filters, setter, clearAll, showMobile, openMobile, closeMobile } =
    useFilterState();

  const { filteredCars, convertPrice, targetCurrency, query } = useFilteredCars(
    {
      cars,
      filters,
      rates,
      i18n,
    }
  );

  if (!cars) return null;

  return (
    <main className="min-h-screen w-full bg-gray-50 flex justify-center overflow-x-clip ">
      <div className="w-full flex flex-col md:flex-row h-full relative max-w-screen-2xl">
        <aside className="hidden md:hidden xl:block sticky top-0  border-r border-[#c6c6c6] bg-white p-5 shrink-0">
          <FilterPanel
            cars={cars}
            filters={filters}
            setter={setter}
            clearAll={clearAll}
          />
        </aside>

        <button
          aria-label={t("filters.title")}
          onClick={openMobile}
          className="fixed xl:hidden bottom-6 right-6 bg-[#E10600] text-white p-4 rounded-md z-40 cursor-pointer"
        >
          <LuFilter size={22} />
        </button>

        {showMobile && (
          <div className="fixed inset-0 z-40 bg-black/50 flex justify-end">
            <div className="w-fit bg-white h-full p-5 overflow-y-auto shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700 text-lg"></h2>
                <button
                  aria-label={t("filters.reset")}
                  onClick={closeMobile}
                  className="text-gray-600 cursor-pointer"
                >
                  <IoClose size={24} />
                </button>
              </div>

              <FilterPanel
                cars={cars}
                filters={filters}
                setter={setter}
                clearAll={clearAll}
                className="w-full md:w-[260px]"
              />

              <button
                onClick={closeMobile}
                className="w-full mt-5 py-2 bg-[#E10600] text-white rounded-lg font-medium cursor-pointer"
              >
                {t("filters.apply")}
              </button>
            </div>
          </div>
        )}

        <section className="flex-1 px-3 sm:px-5 lg:px-8 py-6 h-full">
          <div className="mx-auto w-full space-y-6">
            <CategoryList
              cars={cars}
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={setter.setSelectedCategory}
              setSelectedBrand={setter.setSelectedBrand}
            />

            {filters.selectedCategory && (
              <BrandChips
                cars={cars}
                selectedCategory={filters.selectedCategory}
                selectedBrand={filters.selectedBrand}
                setSelectedBrand={setter.setSelectedBrand}
              />
            )}

            {query && (
              <div className="mb-4 w-full bg-white p-4 flex justify-between items-center">
                <p className="text-gray-700 text-base sm:text-base flex items-center gap-1">
                  <IoSearch />
                  <strong>Search results:</strong> {query}
                </p>

                <button
                  onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.delete("query");
                    window.location.href = `/showroom?${params.toString()}`;
                  }}
                  className="text-red-600 font-medium hover:underline text-base flex items-center gap-1"
                >
                  <IoIosArrowBack />
                  <p>Back</p>
                </button>
              </div>
            )}

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              setter={setter}
              clearAll={clearAll}
            />

            {/* Sort + List */}
            <SortSelect
              value={filters.sortBy}
              onChange={setter.setSortBy}
              count={filteredCars.length}
            />

            {loading ? (
              <div className="py-10 text-center text-gray-500">
                {t("cars.loading")}
              </div>
            ) : filteredCars.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <CarList
                  cars={filteredCars}
                  convertPrice={convertPrice}
                  targetCurrency={targetCurrency}
                  i18n={i18n}
                />

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      disabled={loadingMore}
                      onClick={fetchMore}
                      className="px-6 py-2.5 bg-[#E10600] text-white rounded-lg hover:bg-[#00908b] transition font-medium"
                    >
                      {loadingMore ? t("cars.loading") : t("cars.show_more")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
