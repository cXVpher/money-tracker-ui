const mockDataValue = process.env.NEXT_PUBLIC_MOCK_DATA;
const apiBaseUrlValue = process.env.NEXT_PUBLIC_API_BASE_URL;

export const USE_MOCK_DATA =
  mockDataValue == null
    ? true
    : !["false", "0", "no", "off"].includes(mockDataValue.toLowerCase());

export const API_BASE_URL = (apiBaseUrlValue ?? "http://localhost:8080").replace(
  /\/$/,
  ""
);
