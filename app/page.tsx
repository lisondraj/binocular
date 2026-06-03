"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// The mobile view is authored at a 390px design width. Setting the root
// font-size to `100vw / 24.375` makes 1em === 16px at that width, so when the
// viewport grows or shrinks the entire layout scales as one — like a vector —
// because every dimension below is expressed in `em`.
const MOBILE_ROOT_FONT_SIZE = "calc(100vw / 24.375)";

type HeroImage = {
  src: string;
  alt: string;
  size: string;
  rotate: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
};

// Decorative images scattered around the hero. `size` is in `em` so they
// scale with the layout; larger ones read as "closer", smaller as "further".
// Bottom arc — evenly spaced, sits below the AI box without overlapping it.
const heroImages: HeroImage[] = [
  { src: "/images/kitchen.png", alt: "Kitchen", size: "6em", bottom: "4em", left: "-0.75em", rotate: "5deg" },
  { src: "/images/warehouse-1.png", alt: "Warehouse", size: "5.5em", bottom: "6.25em", left: "4.75em", rotate: "-4deg" },
  { src: "/images/robotics-lab.png", alt: "Robotics lab", size: "6.5em", bottom: "3.25em", left: "9.25em", rotate: "3deg" },
  { src: "/images/courtyard.png", alt: "Office courtyard", size: "5.75em", bottom: "6em", right: "4.75em", rotate: "6deg" },
  { src: "/images/warehouse-2.png", alt: "Warehouse", size: "6.25em", bottom: "4em", right: "-0.75em", rotate: "-6deg" },
] as const;

const upRightArrow = (
  <svg
    style={{ width: "1.125em", height: "1.125em" }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const HERO_PROMPT =
  "Show me top 50 of the nearest listings with a dishwasher, stairs, and a dog. Budget $500";

const MENTION_OPTIONS = [
  "Astra Robotics",
  "Dr. Simon's Lab",
  "My Project 1",
  "Dr. Frank's Lab",
] as const;

const SELECTED_MENTION = MENTION_OPTIONS.length - 1;
const SELECTED_LABEL = MENTION_OPTIONS[SELECTED_MENTION];

type PromptPhase = "at" | "menu" | "chip" | "typing" | "done";

const INTRO_UI_DELAY = 200;
const INTRO_FADE_MS = 1200;
const INTRO_GAP_MS = 400;

// @ icon for the "Dr. Frank's Lab" context chip.
const labIcon = (
  <svg
    className="hero-prompt-chip-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
  </svg>
);

const upArrow = (
  <svg
    style={{ width: "0.9em", height: "0.9em" }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

export default function Home() {
  const [showLogo, setShowLogo] = useState(false);
  const [showHeroUi, setShowHeroUi] = useState(false);
  const [showHeroPrompt, setShowHeroPrompt] = useState(false);
  const [promptAnimReady, setPromptAnimReady] = useState(false);
  const [promptPhase, setPromptPhase] = useState<PromptPhase>("at");
  const [atChar, setAtChar] = useState("");
  const [menuHighlight, setMenuHighlight] = useState(0);
  const [typed, setTyped] = useState("");
  const [revealedImageCount, setRevealedImageCount] = useState(0);
  const [submitPressed, setSubmitPressed] = useState(false);
  const [scrollUnlocked, setScrollUnlocked] = useState(false);

  const promptWrapRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const promptMetricsRef = useRef({ naturalTop: 0, maxTravel: 0 });

  const introFade = (step: number) =>
    INTRO_UI_DELAY + step * (INTRO_FADE_MS + INTRO_GAP_MS);

  // Page load: nav + copy + buttons → AI box → prompt animation
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    schedule(() => setShowHeroUi(true), INTRO_UI_DELAY);
    schedule(() => setShowHeroPrompt(true), introFade(1));
    schedule(
      () => setPromptAnimReady(true),
      introFade(1) + INTRO_FADE_MS + 200,
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  // @ types in → mention menu → chip → prompt typing (after AI box fade-in)
  useEffect(() => {
    if (!promptAnimReady) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    schedule(() => setAtChar("@"), 320);

    const menuOpen = 800;
    const menuStart = 1350;
    const menuStep = 400;

    schedule(() => setPromptPhase("menu"), menuOpen);

    MENTION_OPTIONS.forEach((_, i) => {
      schedule(() => setMenuHighlight(i), menuStart + i * menuStep);
    });

    const selectAt =
      menuStart + (MENTION_OPTIONS.length - 1) * menuStep + menuStep * 0.55;

    schedule(() => {
      setMenuHighlight(SELECTED_MENTION);
      setPromptPhase("chip");
    }, selectAt);

    schedule(() => {
      setRevealedImageCount(0);
      setPromptPhase("typing");
    }, selectAt + 450);

    return () => timers.forEach(clearTimeout);
  }, [promptAnimReady]);

  useEffect(() => {
    if (promptPhase !== "typing") return;

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(HERO_PROMPT.slice(0, i));
      if (i >= HERO_PROMPT.length) {
        clearInterval(id);
        setPromptPhase("done");
      }
    }, 45);
    return () => clearInterval(id);
  }, [promptPhase]);

  // After full text: simulate submit click, unlock scrolling, then reveal
  // the scattered images one by one.
  useEffect(() => {
    if (promptPhase !== "done") return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setSubmitPressed(true), 600));
    timers.push(
      setTimeout(() => {
        setSubmitPressed(false);
        setScrollUnlocked(true);
      }, 780),
    );

    heroImages.forEach((_, i) => {
      timers.push(
        setTimeout(() => setRevealedImageCount(i + 1), 950 + i * 220),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [promptPhase]);

  // Lock page scroll until the submit button has been pressed.
  useEffect(() => {
    if (scrollUnlocked) return;

    const { documentElement, body } = document;
    const prevHtml = documentElement.style.overflow;
    const prevBody = body.style.overflow;
    window.scrollTo(0, 0);
    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      documentElement.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [scrollUnlocked]);

  useEffect(() => {
    const onScroll = () => {
      // Fade in once the user scrolls roughly past the hero.
      setShowLogo(window.scrollY > window.innerHeight * 0.6);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Move the AI box down with scroll after submit — cached layout + rAF keeps
  // it smooth (no React re-render per scroll frame).
  useEffect(() => {
    const wrap = promptWrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const section = secondSectionRef.current;
      if (!section) return;

      wrap.style.transform = "translate3d(0, 0, 0)";
      const naturalTop = wrap.getBoundingClientRect().top + window.scrollY;
      const boxHeight = wrap.offsetHeight;
      const sectionBottom =
        section.getBoundingClientRect().bottom + window.scrollY;
      const rootFontSize = window.innerWidth / 24.375;
      const bottomPadding = rootFontSize * 2;
      const finalTop = sectionBottom - bottomPadding - boxHeight;

      promptMetricsRef.current = {
        naturalTop,
        maxTravel: Math.max(0, finalTop - naturalTop),
      };
    };

    let frame = 0;

    const applyShift = (shift: number) => {
      wrap.style.transform =
        shift > 0 ? `translate3d(0, ${shift}px, 0)` : "translate3d(0, 0, 0)";
    };

    const update = () => {
      if (!scrollUnlocked) {
        applyShift(0);
        return;
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { maxTravel } = promptMetricsRef.current;
        const maxScroll = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        applyShift(progress * maxTravel);
      });
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      applyShift(0);
    };
  }, [scrollUnlocked, revealedImageCount]);

  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden", maxWidth: "100%" }}>
      {/* Desktop view — shown at iPad width (1024px) and above. */}
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
            hello
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#444" }}>
            Desktop view — Geist Mono headings, Inter body.
          </p>
        </div>
      </section>

      {/* iPhone / mobile view — shown below iPad width. Its container is capped
          at the iPad width so even the largest iPhones are contained. Every
          size is in `em` so the whole view scales uniformly with the width. */}
      <section
        className="mobile-view"
        style={{
          position: "relative",
          fontSize: MOBILE_ROOT_FONT_SIZE,
          overflowX: "hidden",
          maxWidth: "100%",
        }}
      >
        {/* Header fill — white background + thin bottom line, appears with the
            BINOCULAR logo once scrolled beyond the hero. */}
        <div
          aria-hidden
          className={`mobile-nav-bg${showLogo ? " is-visible" : ""}`}
          style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
        />

        {/* Mobile nav — logo fades in past hero; menu always visible. */}
        <div
          className={`mobile-nav hero-intro-fade${showHeroUi ? " is-visible" : ""}`}
          style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
        >
          <span
            className={`mobile-nav-logo${showLogo ? " is-visible" : ""}`}
            aria-hidden={!showLogo}
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

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "var(--ipad-width)",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "0.75em",
            padding: "1.5em",
            textAlign: "center",
          }}
        >
          {/* Scattered decorative images — square, rounded, behind the text. */}
          <div
            aria-hidden
            className="hero-intro-images"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            {heroImages.map((img, i) => {
              const imgStyle: CSSProperties & { "--base-rotate": string } = {
                position: "absolute",
                top: "top" in img ? img.top : undefined,
                bottom: "bottom" in img ? img.bottom : undefined,
                left: "left" in img ? img.left : undefined,
                right: "right" in img ? img.right : undefined,
                width: img.size,
                height: img.size,
                objectFit: "cover",
                borderRadius: "1em",
                "--base-rotate": img.rotate,
                boxShadow: "0 0.85em 2.25em rgba(0, 0, 0, 0.28)",
              };

              return (
                <img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  className={`hero-image-rise${i < revealedImageCount ? " is-visible" : ""}`}
                  style={imgStyle}
                />
              );
            })}
          </div>

          <div
            className={`hero-intro-content hero-intro-fade${showHeroUi ? " is-visible" : ""}`}
          >
          <h1
            className="hero-title"
            style={{
              fontSize: "3em",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="hero-title-word">BINOCULAR</span>
          </h1>
          <p
            className="hero-description"
            style={{
              fontFamily: "var(--font-suisse), system-ui, sans-serif",
              fontSize: "2.35em",
              fontWeight: 300,
              textAlign: "left",
              width: "100%",
            }}
          >
            We’re building a marketplace for embodied AI.
          </p>
          <div
            className="hero-actions"
            style={{
              alignSelf: "flex-start",
              display: "flex",
              gap: "0.75em",
            }}
          >
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5em",
                padding: "0.75em 1.25em",
                border: "0.0625em solid #000000",
                borderRadius: "0.5em",
                background: "#000000",
                color: "#ffffff",
                fontFamily: "var(--font-suisse), system-ui, sans-serif",
                fontSize: "0.95em",
                fontWeight: 300,
                cursor: "pointer",
              }}
            >
              Host
              {upRightArrow}
            </button>
            <button
              type="button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5em",
                padding: "0.75em 1.25em",
                border: "0.0625em solid #000000",
                borderRadius: "0.5em",
                background: "none",
                color: "#000000",
                fontFamily: "var(--font-suisse), system-ui, sans-serif",
                fontSize: "0.95em",
                fontWeight: 300,
                cursor: "pointer",
              }}
            >
              Book
              {upRightArrow}
            </button>
          </div>
          </div>

          {/* Scroll-driven wrapper — pins the AI box on screen as you scroll,
              then lets it settle near the bottom of the second section. */}
          <div
            ref={promptWrapRef}
            style={{
              alignSelf: "stretch",
              width: "100%",
              marginTop: "1.5em",
              position: "relative",
              zIndex: 2,
              willChange: scrollUnlocked ? "transform" : "auto",
            }}
          >
          {/* Frosted-glass prompt card — backdrop blur + dark overlay, with a
              typing animation, blinking caret, and a circular send button. */}
          <div
            className={`hero-prompt-card hero-intro-fade${showHeroPrompt ? " is-visible" : ""}`}
            style={{
              position: "relative",
              zIndex: 1,
              padding: "1em 1.15em 0.85em",
              borderRadius: "1.25em",
              background: "rgba(30, 27, 24, 0.45)",
              backdropFilter: "blur(1em)",
              WebkitBackdropFilter: "blur(1em)",
              border: "0.0625em solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 1em 2.5em rgba(0, 0, 0, 0.25)",
              textAlign: "left",
              fontFamily: "var(--font-suisse), system-ui, sans-serif",
            }}
          >
            <p className="hero-prompt-text">
              {/* Full final layout always present — locks box size from first @. */}
              <span className="hero-prompt-layout" aria-hidden>
                <span className="hero-prompt-chip">
                  {labIcon}
                  {SELECTED_LABEL}
                </span>
                {HERO_PROMPT}
              </span>

              <span className="hero-prompt-live">
                {promptPhase === "at" || promptPhase === "menu" ? (
                  <span className="hero-prompt-at-wrap">
                    <span className="hero-prompt-at">{atChar}</span>
                    {promptPhase === "menu" && (
                      <ul className="hero-prompt-menu" role="listbox">
                        {MENTION_OPTIONS.map((label, i) => (
                          <li
                            key={label}
                            role="option"
                            aria-selected={i === menuHighlight}
                            className={
                              i === menuHighlight
                                ? "hero-prompt-menu-item is-highlighted"
                                : "hero-prompt-menu-item"
                            }
                          >
                            {label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </span>
                ) : (
                  <span className="hero-prompt-chip">
                    {labIcon}
                    {SELECTED_LABEL}
                  </span>
                )}

                {(promptPhase === "typing" || promptPhase === "done") && (
                  <>
                    <span className="hero-prompt-typed">{typed}</span>
                    {promptPhase !== "done" && (
                      <span className="type-caret" aria-hidden />
                    )}
                    <span className="hero-prompt-reserve">
                      {HERO_PROMPT.slice(typed.length)}
                    </span>
                  </>
                )}

                {promptPhase !== "done" && promptPhase !== "typing" && (
                  <span className="type-caret" aria-hidden />
                )}
              </span>
            </p>

            <button
              type="button"
              aria-label="Send"
              className={`hero-prompt-send${submitPressed ? " is-pressed" : ""}`}
              style={{
                position: "absolute",
                bottom: "0.85em",
                right: "1.15em",
                fontSize: "inherit",
                width: "1.8em",
                height: "1.8em",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: "none",
                background: "#ffffff",
                color: "#000000",
                cursor: "pointer",
              }}
            >
              {upArrow}
            </button>
          </div>
          </div>
        </div>

        {/* Second section — full-height white. */}
        <div
          ref={secondSectionRef}
          style={{
            position: "relative",
            zIndex: 0,
            minHeight: "100vh",
            backgroundColor: "#ffffff",
          }}
        />
      </section>
    </main>
  );
}
