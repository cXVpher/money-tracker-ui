import "server-only";

const apiBaseUrlValue = process.env.API_BASE_URL;

export const API_BASE_URL = (apiBaseUrlValue ?? "http://localhost:8080").replace(
  /\/$/,
  ""
);
