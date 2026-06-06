"use client";

import Link from "next/link";
import { MOBILE_ROOT_FONT_SIZE } from "@/lib/mobile-layout";

type MobileNavBarProps = {
  /** When true, logo and header fill are always visible (e.g. /book). */
  staticNav?: boolean;
  showLogo?: boolean;
  /** Hero intro fade — nav row appears with the rest of the hero UI. */
  showNav?: boolean;
};

export function MobileNavBar({
  staticNav = false,
  showLogo = false,
  showNav = true,
}: MobileNavBarProps) {
  const logoVisible = staticNav || showLogo;
  const expanded = staticNav || showLogo;
  const navVisible = staticNav || showNav;
  const logoClassName = `mobile-nav-logo mobile-nav-logo-link${
    logoVisible ? " is-visible" : ""
  }`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`mobile-nav${
        staticNav ? " mobile-nav--static" : " hero-intro-fade"
      }${navVisible ? " is-visible" : ""}${expanded ? " is-expanded" : ""}`}
      style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
    >
      {staticNav ? (
        <Link
          href="/"
          className={logoClassName}
          aria-hidden={!logoVisible}
        >
          BINOCULAR
        </Link>
      ) : (
        <button
          type="button"
          className={logoClassName}
          aria-hidden={!logoVisible}
          aria-label="Back to top"
          onClick={scrollToTop}
        >
          BINOCULAR
        </button>
      )}

      <button
        type="button"
        className="mobile-nav-menu"
        aria-label="Open navigation menu"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
  );
}
