"use client";

import { useCallback, useState } from "react";
import {
  formatLocationLabel,
  reverseGeocode,
  type LocationLabel,
} from "@/lib/reverse-geocode";

type LocationStatus = "inactive" | "loading" | "active";

export function Main2LocationSelector() {
  const [status, setStatus] = useState<LocationStatus>("inactive");
  const [location, setLocation] = useState<LocationLabel | null>(null);

  const requestLocation = useCallback(() => {
    if (status === "loading" || typeof navigator === "undefined") return;

    if (!navigator.geolocation) {
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const result = await reverseGeocode(
          position.coords.latitude,
          position.coords.longitude,
        );

        if (!result) {
          setStatus("inactive");
          return;
        }

        setLocation(result);
        setStatus("active");
      },
      () => {
        setStatus("inactive");
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000,
      },
    );
  }, [status]);

  const label =
    status === "active" && location
      ? formatLocationLabel(location)
      : "Location";

  return (
    <button
      type="button"
      className={`main2-location-selector${
        status === "active" ? " is-active" : ""
      }${status === "loading" ? " is-loading" : ""}`}
      onClick={requestLocation}
      disabled={status === "loading"}
      aria-label={
        status === "active" && location
          ? `Location: ${formatLocationLabel(location)}`
          : "Set your location"
      }
    >
      <svg
        className="main2-location-selector__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 21s6-5.33 6-10a6 6 0 1 0-12 0c0 4.67 6 10 6 10z" />
        <circle cx="12" cy="11" r="2.25" />
      </svg>
      <span className="main2-location-selector__label">{label}</span>
    </button>
  );
}
