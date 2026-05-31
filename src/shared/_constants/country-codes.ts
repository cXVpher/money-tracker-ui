export type CountryCode = {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
};

export const COUNTRY_CODES: CountryCode[] = [
  { code: "ID", dialCode: "62", flag: "🇮🇩", name: "Indonesia" },
  { code: "MY", dialCode: "60", flag: "🇲🇾", name: "Malaysia" },
  { code: "SG", dialCode: "65", flag: "🇸🇬", name: "Singapore" },
  { code: "TH", dialCode: "66", flag: "🇹🇭", name: "Thailand" },
  { code: "PH", dialCode: "63", flag: "🇵🇭", name: "Philippines" },
  { code: "VN", dialCode: "84", flag: "🇻🇳", name: "Vietnam" },
  { code: "JP", dialCode: "81", flag: "🇯🇵", name: "Japan" },
  { code: "KR", dialCode: "82", flag: "🇰🇷", name: "South Korea" },
  { code: "CN", dialCode: "86", flag: "🇨🇳", name: "China" },
  { code: "IN", dialCode: "91", flag: "🇮🇳", name: "India" },
  { code: "AU", dialCode: "61", flag: "🇦🇺", name: "Australia" },
  { code: "US", dialCode: "1", flag: "🇺🇸", name: "United States" },
  { code: "GB", dialCode: "44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "AE", dialCode: "971", flag: "🇦🇪", name: "UAE" },
  { code: "SA", dialCode: "966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "BN", dialCode: "673", flag: "🇧🇳", name: "Brunei" },
  { code: "MM", dialCode: "95", flag: "🇲🇲", name: "Myanmar" },
  { code: "KH", dialCode: "855", flag: "🇰🇭", name: "Cambodia" },
  { code: "LA", dialCode: "856", flag: "🇱🇦", name: "Laos" },
  { code: "TW", dialCode: "886", flag: "🇹🇼", name: "Taiwan" },
  { code: "HK", dialCode: "852", flag: "🇭🇰", name: "Hong Kong" },
  { code: "NZ", dialCode: "64", flag: "🇳🇿", name: "New Zealand" },
];

export const DEFAULT_COUNTRY_CODE = COUNTRY_CODES[0]; // Indonesia
