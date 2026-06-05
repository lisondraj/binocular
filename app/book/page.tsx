import { FourthSection } from "@/components/fourth-section";
import { MobileNavBar } from "@/components/mobile-nav-bar";
import { MOBILE_ROOT_FONT_SIZE } from "@/lib/mobile-layout";

export default function BookPage() {
  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden", maxWidth: "100%" }}>
      <section className="desktop-view">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "1rem",
            padding: "2rem",
          }}
        >
          <h1 style={{ fontSize: "3.5rem", letterSpacing: "-0.02em" }}>
            Book
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#444" }}>
            Open on mobile for the full booking experience.
          </p>
        </div>
      </section>

      <section
        className="mobile-view book-page"
        style={{
          position: "relative",
          fontSize: MOBILE_ROOT_FONT_SIZE,
          overflowX: "hidden",
          maxWidth: "100%",
        }}
      >
        <MobileNavBar staticNav />
        <FourthSection className="fourth-section--standalone" />
        <footer
          className="mobile-site-footer"
          style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
        >
          <div className="mobile-site-footer__box">
            <p className="mobile-site-footer__wordmark">BINOCULAR</p>
          </div>
        </footer>
      </section>
    </main>
  );
}
