"use client";

import { useRef, useState } from "react";
import {
  COUNTRY_CODES,
  DEFAULT_COUNTRY_CODE,
  type CountryCode,
} from "@/shared/_constants/country-codes";
import { cn } from "@/shared/_utils/cn";

type PhoneInputProps = {
  /** Just the local number, without country dial code */
  value: string;
  /** Called with the local number */
  onChange: (localNumber: string) => void;
  /** Called with the full number including dial code (e.g. "6285873427") */
  onFullNumberChange?: (fullNumber: string) => void;
  /** Selected country code */
  countryCode?: CountryCode;
  /** Called when country changes */
  onCountryChange?: (country: CountryCode) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  onBlur?: () => void;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

export function PhoneInput({
  value,
  onChange,
  onFullNumberChange,
  countryCode,
  onCountryChange,
  placeholder = "85873427",
  className,
  id,
  onBlur,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    countryCode ?? DEFAULT_COUNTRY_CODE
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeCountry = countryCode ?? selectedCountry;

  const filteredCountries = COUNTRY_CODES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleCountrySelect(country: CountryCode) {
    setSelectedCountry(country);
    onCountryChange?.(country);
    setIsDropdownOpen(false);
    setSearchQuery("");

    // Notify parent of full number change
    if (value) {
      onFullNumberChange?.(`${country.dialCode}${value}`);
    }
  }

  function handleLocalNumberChange(localNumber: string) {
    // Only allow digits
    const digitsOnly = localNumber.replace(/\D/g, "");
    onChange(digitsOnly);
    onFullNumberChange?.(`${activeCountry.dialCode}${digitsOnly}`);
  }

  function handleDropdownToggle() {
    setIsDropdownOpen((prev) => {
      const next = !prev;
      if (next) {
        // Focus search input after opening
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else {
        setSearchQuery("");
      }
      return next;
    });
  }

  // Close dropdown when clicking outside
  function handleBlur(event: React.FocusEvent) {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setIsDropdownOpen(false);
      setSearchQuery("");
      onBlur?.();
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)} onBlur={handleBlur}>
      <div
        className={cn(
          "flex h-11 w-full items-stretch overflow-hidden rounded-md border border-input bg-transparent text-sm shadow-xs transition-colors",
          "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          ariaInvalid && "border-destructive ring-3 ring-destructive/20"
        )}
      >
        {/* Country code trigger */}
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 border-r border-input bg-accent/40 px-2.5 text-sm transition-colors hover:bg-accent/70 focus:outline-none"
          onClick={handleDropdownToggle}
          aria-label="Pilih kode negara"
          tabIndex={0}
        >
          <span className="text-base leading-none">{activeCountry.flag}</span>
          <span className="font-medium text-foreground">+{activeCountry.dialCode}</span>
          <svg
            className={cn(
              "h-3 w-3 text-muted-foreground transition-transform duration-200",
              isDropdownOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Phone number input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder}
          value={value}
          onChange={(event) => handleLocalNumberChange(event.target.value)}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
        />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-[260px] overflow-hidden rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-150">
          {/* Search */}
          <div className="border-b border-border p-2">
            <input
              ref={searchInputRef}
              type="text"
              className="w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring/50"
              placeholder="Cari negara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Country list */}
          <div className="max-h-48 overflow-y-auto overscroll-contain">
            {filteredCountries.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                Tidak ditemukan
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-accent/70",
                    activeCountry.code === country.code && "bg-accent font-medium"
                  )}
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="shrink-0 text-muted-foreground">+{country.dialCode}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
