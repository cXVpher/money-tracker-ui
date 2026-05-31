const apiBaseUrlValue = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_BASE_URL = (apiBaseUrlValue ?? "http://localhost:8080").replace(
  /\/$/,
  ""
);

export const FRONTEND_API_BASE_URL = "/api";
