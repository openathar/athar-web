/**
 * Base URL of the public API, called directly from the browser (see
 * CorsConfig in api-service). Overridable at build time for local dev
 * (`NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`); defaults to
 * production so a plain `next build` always points at the real API.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.openathar.org";
