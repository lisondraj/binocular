"use client";

import Link from "next/link";
import { MOBILE_ROOT_FONT_SIZE } from "@/lib/mobile-layout";

type MobileNavBarProps = {
  /** When true, logo and header fill are always visible (e.g. /book). */
  staticNav?: boolean;
  showLogo?: boolean;
  /** Hero intro fade — nav row appears with the rest of the hero UI. */
  showNav?: boolean;
  /** /main2 — chevron menu + detached dropdown panel. */
  isMain2?: boolean;
  menuOpen?: boolean;
  onMenuToggle?: () => void;
};

export function MobileNavBar({
  staticNav = false,
  showLogo = false,
  showNav = true,
  isMain2 = false,
  menuOpen = false,
  onMenuToggle,
}: MobileNavBarProps) {
  const isMain2PastHero = isMain2 && showLogo;
  const expanded =
    staticNav || (isMain2 ? menuOpen || isMain2PastHero : showLogo);
  const logoVisible =
    staticNav || (isMain2 ? menuOpen || isMain2PastHero : showLogo);
  const navVisible = staticNav || showNav;
  const logoClassName = `mobile-nav-logo mobile-nav-logo-link${
    logoVisible ? " is-visible" : ""
  }`;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navRow = (
    <div
      className={`mobile-nav${
        staticNav || isMain2 ? " mobile-nav--static" : " hero-intro-fade"
      }${isMain2 ? " mobile-nav--main2" : ""}${
        isMain2PastHero ? " mobile-nav--main2-past-hero" : ""
      }${navVisible ? " is-visible" : ""}${expanded ? " is-expanded" : ""}`}
    >
      {staticNav ? (
        <Link href="/" className={logoClassName} aria-hidden={!logoVisible}>
          Binocular
        </Link>
      ) : (
        <button
          type="button"
          className={logoClassName}
          aria-hidden={!logoVisible}
          aria-label="Back to top"
          onClick={scrollToTop}
        >
          Binocular
        </button>
      )}

      <button
        type="button"
        className={`mobile-nav-menu${menuOpen ? " is-open" : ""}`}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMain2 ? menuOpen : undefined}
        onClick={isMain2 ? onMenuToggle : undefined}
      >
        {isMain2 ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        ) : (
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
        )}
      </button>
    </div>
  );

  if (isMain2) {
    return (
      <div
        className={`main2-nav-anchor${menuOpen ? " is-menu-open" : ""}`}
        style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
      >
        {navRow}
        {menuOpen ? (
          <nav className="main2-nav-menu-panel" aria-label="Navigation">
            <button type="button" className="main2-nav-menu-panel__link">
              Host
            </button>
            <Link
              href="/book"
              className="main2-nav-menu-panel__link"
              onClick={() => onMenuToggle?.()}
            >
              Book
            </Link>
          </nav>
        ) : null}
      </div>
    );
  }

  return (
    <div style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}>{navRow}</div>
  );
}
