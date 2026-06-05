import { MOBILE_ROOT_FONT_SIZE } from "@/lib/mobile-layout";

type MobileNavBarProps = {
  /** When true, logo and header fill are always visible (e.g. /book). */
  staticNav?: boolean;
  showLogo?: boolean;
};

export function MobileNavBar({
  staticNav = false,
  showLogo = true,
}: MobileNavBarProps) {
  const logoVisible = staticNav || showLogo;

  return (
    <>
      <div
        aria-hidden
        className={`mobile-nav-bg${logoVisible ? " is-visible" : ""}`}
        style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
      />
      <div
        className={`mobile-nav${
          staticNav ? " mobile-nav--static" : " hero-intro-fade is-visible"
        }`}
        style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
      >
        <span
          className={`mobile-nav-logo${logoVisible ? " is-visible" : ""}`}
          aria-hidden={!logoVisible}
        >
          BINOCULAR
        </span>

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
    </>
  );
}
