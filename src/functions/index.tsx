"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";

export type Option = { label: string; value: string | null };

export type RangeSelectProps = {
  minValue: string | null;
  maxValue: string | null;

  /** ✅ Шинэ — тусдаа Min / Max options */
  minOptions?: Option[];
  maxOptions?: Option[];

  /** ❗Хуучин "options" байвал түүнийг fallback болгон ашиглана */
  options?: Option[];

  onMinChange: (value: string | null) => void;
  onMaxChange: (value: string | null) => void;

  minPlaceholder: string;
  maxPlaceholder: string;
};

export type FilterSelectProps = {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
};

// --------------------------------------------------
// Shared Dropdown
// --------------------------------------------------
function SingleSelectDropdown({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  options: Option[];
  placeholder: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected?.label || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer">
        <Button
          type="button"
          variant="outline"
          className={`w-full bg-white border border-gray-300 rounded-lg px-3 py-2 
            flex justify-between items-center text-sm sm:text-base 
            text-gray-800 focus:ring-1 focus:ring-[#E10600]/40 transition
            ${className || ""}`}
        >
          <span className="truncate">{displayLabel}</span>
          <FiChevronDown
            className={`transition-transform ${
              open ? "rotate-180" : ""
            } text-gray-600`}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="w-(--radix-popover-trigger-width) p-0 mt-1 bg-white 
        border border-gray-200 rounded-lg shadow-lg animate-fadeIn 
        max-h-64 overflow-auto z-50 cursor-pointer"
      >
        <Command>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.value ?? opt.label}
                onSelect={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="px-3 py-2 cursor-pointer text-sm sm:text-base"
              >
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// --------------------------------------------------
// UPDATED RangeSelect with dynamic min/max options
// --------------------------------------------------
export function RangeSelect({
  minValue,
  maxValue,
  minOptions,
  maxOptions,
  options, // fallback
  onMinChange,
  onMaxChange,
  minPlaceholder,
  maxPlaceholder,
}: RangeSelectProps) {
  const finalMinOptions = minOptions || options || [];
  const finalMaxOptions = maxOptions || options || [];

  return (
    <div className="flex sm:flex md:flex xl:flex gap-2">
      <SingleSelectDropdown
        value={minValue}
        onChange={onMinChange}
        options={finalMinOptions}
        placeholder={minPlaceholder}
        className="flex-1"
      />

      <SingleSelectDropdown
        value={maxValue}
        onChange={onMaxChange}
        options={finalMaxOptions}
        placeholder={maxPlaceholder}
        className="flex-1"
      />
    </div>
  );
}

// --------------------------------------------------
// FilterSelect
// --------------------------------------------------
export function FilterSelect({ options, value, onChange }: FilterSelectProps) {
  const placeholder =
    options.find((opt) => opt.value === value)?.label ||
    options[0]?.label ||
    "";

  return (
    <SingleSelectDropdown
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
    />
  );
}

// --------------------------------------------------
// Brand Multi Select
// --------------------------------------------------
export function BrandMultiSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const displayLabel =
    value.length > 0
      ? value
          .map((v) => options.find((o) => o.value === v)?.label || v)
          .join(", ")
      : label;

  const toggle = (val: string) => {
    if (val === "") return onChange([]);
    if (value.includes(val)) return onChange(value.filter((x) => x !== val));
    return onChange([...value, val]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2
          flex justify-between items-center text-sm sm:text-base text-gray-800"
        >
          <span className="truncate">{displayLabel}</span>

          <FiChevronDown
            className={`transition-transform ${
              open ? "rotate-180" : ""
            } text-gray-600`}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="w-(--radix-popover-trigger-width)
        p-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg
        max-h-72 overflow-auto cursor-pointer"
      >
        <Command>
          <CommandGroup>
            {options.map((opt) => {
              const active = value.includes(opt.value);
              return (
                <CommandItem
                  key={opt.value}
                  onSelect={() => toggle(opt.value)}
                  className={`px-3 py-2 text-sm sm:text-base cursor-pointer ${
                    active ? "font-medium" : ""
                  }`}
                >
                  {opt.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
