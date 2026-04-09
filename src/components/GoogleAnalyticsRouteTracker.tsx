import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalyticsRouteTracker() {
  const location = useLocation();
  const lastPathSent = useRef<string | null>(null);

  useEffect(() => {
    if (!MEASUREMENT_ID) return;

    const pagePath =
      location.pathname + location.search + (location.hash || "");

    if (lastPathSent.current === pagePath) return;
    lastPathSent.current = pagePath;

    const gtag = window.gtag;
    if (typeof gtag !== "function") return;

    gtag("config", MEASUREMENT_ID, {
      page_path: pagePath,
    });
  }, [location]);

  return null;
}
