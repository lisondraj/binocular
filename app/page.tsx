"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

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
const LISTING_CARDS = [
  {
    title: "Warehouse loft",
    distanceMi: 0.8,
    rating: 4.9,
    sqFt: 4200,
    hosts: [
      { initials: "MR", gradient: "135deg, #5c7cfa 0%, #364fc7 100%" },
      { initials: "KL", gradient: "135deg, #e64980 0%, #c2255c 100%" },
    ],
    image: "/images/warehouse-1.png",
    alt: "Warehouse loft interior",
  },
  {
    title: "Kitchen",
    distanceMi: 1.2,
    rating: 4.7,
    sqFt: 1850,
    hosts: [
      { initials: "JS", gradient: "135deg, #38d9a9 0%, #12b886 100%" },
      { initials: "AN", gradient: "135deg, #fcc419 0%, #f59f00 100%" },
    ],
    image: "/images/kitchen.png",
    alt: "Kitchen",
  },
  {
    title: "Garden terrace",
    distanceMi: 2.1,
    rating: 4.8,
    sqFt: 960,
    hosts: [
      { initials: "DF", gradient: "135deg, #748ffc 0%, #5c7cfa 100%" },
      { initials: "RP", gradient: "135deg, #da77f2 0%, #9c36b5 100%" },
    ],
    image: "/images/courtyard.png",
    alt: "Garden terrace",
  },
] as const;

const formatSqFt = (sqFt: number) =>
  `${sqFt.toLocaleString("en-US")} sq ft`;

/** Pin element inside second section at its current viewport position. */
const anchorToSecondSection = (
  el: HTMLElement,
  section: HTMLElement,
  zIndex?: number,
) => {
  const sectionRect = section.getBoundingClientRect();
  const rect = el.getBoundingClientRect();

  el.style.position = "absolute";
  el.style.top = `${rect.top - sectionRect.top}px`;
  el.style.bottom = "auto";
  el.style.left = `${rect.left - sectionRect.left}px`;
  el.style.right = "auto";
  el.style.width = `${rect.width}px`;
  el.style.height = `${rect.height}px`;
  el.style.transform = "none";
  if (zIndex !== undefined) {
    el.style.zIndex = String(zIndex);
  }
};

/** Kitchen is the middle listing card — index 1 in LISTING_CARDS. */
const KITCHEN_LISTING_INDEX = 1;

/** Extra copy shown only on the expanded Kitchen overlay. */
const KITCHEN_EXPANDED_DETAILS = {
  availability: "Mon–Fri · 12–3 PM",
  pricePerHour: "$42/hr",
  reviewCount: 128,
  amenities: [
    "Dishwasher",
    "Stairs access",
    "Dog-friendly",
    "Wi-Fi",
  ] as const,
};

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
  "Show me top 3 of the nearest listings with a dishwasher, stairs, and a dog. Budget $500";

const FOLLOWUP_PROMPT =
  "Which one is available Mon-Fri from 12-3 PM?";

const MENTION_OPTIONS = [
  "Astra Robotics",
  "Dr. Simon's Lab",
  "My Project 1",
  "Dr. Frank's Lab",
] as const;

const SELECTED_MENTION = MENTION_OPTIONS.length - 1;
const SELECTED_LABEL = MENTION_OPTIONS[SELECTED_MENTION];

type PromptPhase =
  | "at"
  | "menu"
  | "chip"
  | "typing"
  | "done"
  | "followup-ready"
  | "followup-typing"
  | "followup-done";

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
  const [promptAtBottom, setPromptAtBottom] = useState(false);
  const [revealedListingCount, setRevealedListingCount] = useState(0);
  const [kitchenCardFocused, setKitchenCardFocused] = useState(false);
  const [kitchenCardExpanded, setKitchenCardExpanded] = useState(false);
  const [sectionTwoComplete, setSectionTwoComplete] = useState(false);
  const [kitchenAnchoredInThird, setKitchenAnchoredInThird] = useState(false);
  const [kitchenGlideStarted, setKitchenGlideStarted] = useState(false);
  const [promptFlowHeight, setPromptFlowHeight] = useState(0);

  const promptWrapRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const thirdSectionRef = useRef<HTMLDivElement>(null);
  const promptScrollRef = useRef({
    initialTop: 0,
    left: 0,
    width: 0,
    targetTop: 0,
    scrollEnd: 1,
    pinned: false,
    // Once the box reaches the bottom it stays there — scroll-up can't move it.
    lockedAtBottom: false,
    // After first listing card: absolute in section two (scrolls with page).
    lockedInSection: false,
    // Captured before scroll unlock so pin uses pre-submit viewport position.
    prePinTop: 0,
    prePinLeft: 0,
    prePinWidth: 0,
  });
  const listingRevealStartedRef = useRef(false);
  const listingsReplayStartedRef = useRef(false);
  const followupPromptTriggeredRef = useRef(false);
  const listingStackRef = useRef<HTMLDivElement>(null);
  const listingInnerRef = useRef<HTMLDivElement>(null);
  const kitchenSlotRef = useRef<HTMLDivElement>(null);
  const kitchenOverlayRef = useRef<HTMLDivElement>(null);
  // Stored snapshot so useLayoutEffect can apply coords after portal commits.
  const kitchenFromRef = useRef<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const kitchenTargetRef = useRef<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const kitchenGlideRef = useRef({
    settledTop: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const sectionTwoCompleteRef = useRef(false);
  const kitchenGlideLockedRef = useRef(false);
  const kitchenAnchoredInThirdRef = useRef(false);
  const kitchenGlideStartedRef = useRef(false);
  const kitchenGlideMaxProgressRef = useRef(0);

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
    if (promptPhase !== "typing" && promptPhase !== "followup-typing") return;

    const text =
      promptPhase === "typing" ? HERO_PROMPT : FOLLOWUP_PROMPT;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setPromptPhase(
          promptPhase === "typing" ? "done" : "followup-done",
        );
      }
    }, 45);
    return () => clearInterval(id);
  }, [promptPhase]);

  // Brief caret after chip, then type the follow-up question.
  useEffect(() => {
    if (promptPhase !== "followup-ready") return;

    const timer = setTimeout(() => setPromptPhase("followup-typing"), 400);
    return () => clearTimeout(timer);
  }, [promptPhase]);

  // After all listing cards: hold 2s, clear prompt, show caret beside chip.
  // Only once — listing replay in section two must not retype the follow-up.
  useEffect(() => {
    if (revealedListingCount < LISTING_CARDS.length) return;
    if (followupPromptTriggeredRef.current) return;

    followupPromptTriggeredRef.current = true;

    const timer = setTimeout(() => {
      setTyped("");
      setPromptPhase("followup-ready");
    }, 2000);

    return () => clearTimeout(timer);
  }, [revealedListingCount]);

  // After full text: simulate submit click, unlock scrolling, then reveal
  // the scattered images one by one.
  useEffect(() => {
    if (promptPhase !== "done") return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setSubmitPressed(true), 600));
    timers.push(
      setTimeout(() => {
        setSubmitPressed(false);
        const wrap = promptWrapRef.current;
        if (wrap) {
          const rect = wrap.getBoundingClientRect();
          promptScrollRef.current.prePinTop = rect.top;
          promptScrollRef.current.prePinLeft = rect.left;
          promptScrollRef.current.prePinWidth = rect.width;
        }
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

  // Follow-up submit → fade others, then overlay Kitchen card expands.
  useEffect(() => {
    if (promptPhase !== "followup-done") return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setSubmitPressed(true), 650));
    timers.push(setTimeout(() => setSubmitPressed(false), 950));
    timers.push(setTimeout(() => setKitchenCardFocused(true), 1050));

    timers.push(
      setTimeout(() => {
        const slot = kitchenSlotRef.current;
        const wrap = promptWrapRef.current;
        const stack = listingStackRef.current;

        if (!slot || !wrap || !stack) {
          setKitchenCardExpanded(true);
          return;
        }

        // Snapshot coords before any DOM change.
        const from = slot.getBoundingClientRect();
        const stackRect = stack.getBoundingClientRect();
        const promptCard = wrap.querySelector<Element>(".hero-prompt-card");
        const boxRect =
          promptCard?.getBoundingClientRect() ?? wrap.getBoundingClientRect();

        const rootEm = window.innerWidth / 24.375;
        const padV = rootEm * 0.55;

        const nav = document.querySelector(".mobile-nav");
        const navBg = document.querySelector(".mobile-nav-bg");
        const navBottom = Math.max(
          nav?.getBoundingClientRect().bottom ?? 0,
          navBg?.getBoundingClientRect().bottom ?? 0,
        );

        const targetTop = Math.max(navBottom + padV, stackRect.top + padV);
        const targetBottom = stackRect.bottom - padV;
        const targetLeft = boxRect.left;
        const targetWidth = boxRect.width;
        const targetHeight = Math.max(0, targetBottom - targetTop);

        const section = secondSectionRef.current;
        const sectionRect = section?.getBoundingClientRect() ?? {
          top: 0,
          left: 0,
        };

        // Section-two coords — overlay scrolls with section two after expand.
        kitchenFromRef.current = {
          top: from.top - sectionRect.top,
          left: from.left - sectionRect.left,
          width: from.width,
          height: from.height,
        };
        kitchenTargetRef.current = {
          top: targetTop - sectionRect.top,
          left: targetLeft - sectionRect.left,
          width: targetWidth,
          height: targetHeight,
        };

        // Mount the portal overlay. React commits as a microtask, then
        // useLayoutEffect fires synchronously — ref is guaranteed set there.
        setKitchenCardExpanded(true);
      }, 2000),
    );

    return () => timers.forEach(clearTimeout);
  }, [promptPhase]);

  // After the portal commits to the DOM, useLayoutEffect fires synchronously
  // (before paint), so kitchenOverlayRef.current is guaranteed to be set.
  // We position the overlay at 'from' with no transition, then in the next
  // rAF we enable the transition and set the target coords.
  useLayoutEffect(() => {
    if (!kitchenCardExpanded) return;
    const overlay = kitchenOverlayRef.current;
    const from = kitchenFromRef.current;
    const target = kitchenTargetRef.current;
    if (!overlay || !from || !target) return;

    // Synchronously place at 'from' before first paint (absolute in section two).
    overlay.style.transition = "none";
    overlay.style.position = "absolute";
    overlay.style.top = `${from.top}px`;
    overlay.style.left = `${from.left}px`;
    overlay.style.width = `${from.width}px`;
    overlay.style.height = `${from.height}px`;
    overlay.style.zIndex = "11";
    overlay.style.margin = "0";
    overlay.style.transform = "none";

    let completeTimer: ReturnType<typeof setTimeout> | undefined;
    const onExpandComplete = () => {
      const rect = overlay.getBoundingClientRect();
      kitchenGlideRef.current = {
        settledTop: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
      setSectionTwoComplete(true);
    };

    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.target !== overlay || e.propertyName !== "height") return;
      onExpandComplete();
    };

    // Next frame: browser has painted at 'from', now animate to target.
    const id = requestAnimationFrame(() => {
      void overlay.offsetWidth; // force layout so transition fires
      const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
      overlay.style.transition = [
        `top 1.35s ${ease}`,
        `left 1.35s ${ease}`,
        `width 1.35s ${ease}`,
        `height 1.35s ${ease}`,
      ].join(", ");
      overlay.style.top = `${target.top}px`;
      overlay.style.left = `${target.left}px`;
      overlay.style.width = `${target.width}px`;
      overlay.style.height = `${target.height}px`;

      overlay.addEventListener("transitionend", onTransitionEnd);
      completeTimer = setTimeout(onExpandComplete, 1500);
    });

    return () => {
      cancelAnimationFrame(id);
      overlay.removeEventListener("transitionend", onTransitionEnd);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [kitchenCardExpanded]);

  useEffect(() => {
    sectionTwoCompleteRef.current = sectionTwoComplete;
  }, [sectionTwoComplete]);

  const isSectionTwoFullyOffscreen = () => {
    const sec2 = secondSectionRef.current;
    if (!sec2) return false;
    return sec2.getBoundingClientRect().bottom <= 0;
  };

  const getThirdSectionGlideBounds = () => {
    const sec3 = thirdSectionRef.current;
    const vh = window.innerHeight;
    if (!sec3) {
      return { glideStart: 0, glideEnd: 0 };
    }
    const sec3DocTop = sec3.getBoundingClientRect().top + window.scrollY;
    const sec3Height = sec3.offsetHeight;
    // Glide while section three enters until its vertical center hits the viewport center.
    const glideStart = sec3DocTop - vh;
    const glideEnd = sec3DocTop + sec3Height / 2 - vh / 2;
    return {
      glideStart,
      glideEnd: Math.max(glideEnd, glideStart + 1),
    };
  };

  // Hide listings once kitchen expand finishes; replay after section two scrolls off screen.
  useEffect(() => {
    if (!sectionTwoComplete) return;
    setRevealedListingCount(0);
  }, [sectionTwoComplete]);

  useEffect(() => {
    if (!sectionTwoComplete || listingsReplayStartedRef.current) return;

    const sec2 = secondSectionRef.current;
    if (!sec2) return;

    let timers: ReturnType<typeof setTimeout>[] = [];

    const tryReplay = () => {
      if (listingsReplayStartedRef.current) return;
      if (!isSectionTwoFullyOffscreen()) return;

      listingsReplayStartedRef.current = true;
      setKitchenCardFocused(false);
      setRevealedListingCount(0);
      timers = LISTING_CARDS.map((_, i) =>
        setTimeout(() => setRevealedListingCount(i + 1), 200 + i * 260),
      );
    };

    tryReplay();
    window.addEventListener("scroll", tryReplay, { passive: true });
    window.addEventListener("resize", tryReplay);
    return () => {
      window.removeEventListener("scroll", tryReplay);
      window.removeEventListener("resize", tryReplay);
      timers.forEach(clearTimeout);
    };
  }, [sectionTwoComplete]);

  // Keep expanded kitchen card pinned in section two until scroll enters section three.
  useLayoutEffect(() => {
    if (
      !sectionTwoComplete ||
      kitchenGlideStarted ||
      kitchenAnchoredInThird
    ) {
      return;
    }
    const overlay = kitchenOverlayRef.current;
    const sec2 = secondSectionRef.current;
    const target = kitchenTargetRef.current;
    if (!overlay || !sec2 || !target) return;

    const apply = () => {
      overlay.style.transition = "none";
      overlay.style.position = "absolute";
      overlay.style.top = `${target.top}px`;
      overlay.style.left = `${target.left}px`;
      overlay.style.width = `${target.width}px`;
      overlay.style.height = `${target.height}px`;
      overlay.style.zIndex = "11";
      overlay.style.margin = "0";
      overlay.style.transform = "none";
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [sectionTwoComplete, kitchenGlideStarted, kitchenAnchoredInThird]);

  // Pin to body for the section-three glide only.
  useLayoutEffect(() => {
    if (!kitchenGlideStarted || kitchenAnchoredInThird) return;
    const overlay = kitchenOverlayRef.current;
    if (!overlay) return;

    const g = kitchenGlideRef.current;
    overlay.style.transition = "none";
    overlay.style.position = "fixed";
    overlay.style.top = `${g.settledTop}px`;
    overlay.style.left = `${g.left}px`;
    overlay.style.width = `${g.width}px`;
    overlay.style.height = `${g.height}px`;
    overlay.style.zIndex = "11";
    overlay.style.margin = "0";
    overlay.style.transform = "none";
  }, [kitchenGlideStarted, kitchenAnchoredInThird]);

  // Glide: card moves 1:1 with scroll toward viewport center once section three enters.
  useEffect(() => {
    if (!sectionTwoComplete || kitchenAnchoredInThird) return;

    const onScroll = () => {
      const sec3 = thirdSectionRef.current;
      if (!sec3) return;

      const { glideStart, glideEnd } = getThirdSectionGlideBounds();
      const glideSpan = Math.max(glideEnd - glideStart, 1);

      if (kitchenGlideLockedRef.current) {
        return;
      }

      if (window.scrollY < glideStart) {
        return;
      }

      const overlay = kitchenOverlayRef.current;
      if (!overlay) return;

      if (!kitchenGlideStartedRef.current) {
        const rect = overlay.getBoundingClientRect();
        kitchenGlideRef.current = {
          settledTop: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
        kitchenGlideStartedRef.current = true;
        kitchenGlideMaxProgressRef.current = 0;
        setKitchenGlideStarted(true);
      }

      const g = kitchenGlideRef.current;
      const vh = window.innerHeight;
      const finalTop = (vh - g.height) / 2;

      const scrollY = window.scrollY;
      const p = Math.min(Math.max((scrollY - glideStart) / glideSpan, 0), 1);
      // One-way glide — scrolling back up does not pull the card toward section two.
      const useP = Math.max(p, kitchenGlideMaxProgressRef.current);
      kitchenGlideMaxProgressRef.current = useP;

      overlay.style.top = `${g.settledTop + (finalTop - g.settledTop) * useP}px`;

      if (useP >= 1) {
        kitchenGlideLockedRef.current = true;
        overlay.style.top = `${finalTop}px`;
        kitchenAnchoredInThirdRef.current = true;
        setKitchenAnchoredInThird(true);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionTwoComplete, kitchenGlideStarted, kitchenAnchoredInThird]);

  // Anchor the kitchen card inside section three so it scrolls with the page.
  useLayoutEffect(() => {
    if (!kitchenAnchoredInThird) return;
    const overlay = kitchenOverlayRef.current;
    const sec3 = thirdSectionRef.current;
    if (!overlay || !sec3) return;

    const apply = () => {
      const g = kitchenGlideRef.current;
      const secRect = sec3.getBoundingClientRect();

      overlay.style.transition = "none";
      overlay.style.position = "absolute";
      overlay.style.top = `${(sec3.offsetHeight - g.height) / 2}px`;
      overlay.style.left = `${g.left - secRect.left}px`;
      overlay.style.width = `${g.width}px`;
      overlay.style.height = `${g.height}px`;
      overlay.style.zIndex = "11";
      overlay.style.margin = "0";
      overlay.style.transform = "none";
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [kitchenAnchoredInThird]);

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

  // After the prompt animation + submit: pin the AI box in the viewport and
  // lerp it to the bottom of the phone as the user scrolls into section two.
  useEffect(() => {
    const wrap = promptWrapRef.current;
    const section = secondSectionRef.current;
    if (!wrap || !section) return;

    const rootFontSize = () => window.innerWidth / 24.375;

    const clearPin = () => {
      // Never clear once anchored in section two or locked at the bottom.
      if (
        promptScrollRef.current.lockedAtBottom ||
        promptScrollRef.current.lockedInSection
      ) {
        return;
      }
      wrap.style.position = "";
      wrap.style.top = "";
      wrap.style.left = "";
      wrap.style.width = "";
      wrap.style.transform = "";
      wrap.style.zIndex = "";
      promptScrollRef.current.pinned = false;
    };

    const measureScrollEnd = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      return Math.max(
        1,
        sectionTop + section.offsetHeight - window.innerHeight,
      );
    };

    const pinPrompt = () => {
      const rect = wrap.getBoundingClientRect();
      const bottomPadding = rootFontSize() * 2;
      const boxHeight = wrap.offsetHeight;
      const targetTop = window.innerHeight - bottomPadding - boxHeight;
      const metrics = promptScrollRef.current;

      // Use coords captured before unlock so removing marginTop doesn't jump.
      const pinTop = metrics.prePinTop || rect.top;
      const pinLeft = metrics.prePinLeft || rect.left;
      const pinWidth = metrics.prePinWidth || rect.width;

      wrap.style.position = "fixed";
      wrap.style.left = `${pinLeft}px`;
      wrap.style.width = `${pinWidth}px`;
      wrap.style.top = `${pinTop}px`;
      wrap.style.transform = "none";
      wrap.style.zIndex = "10";
      wrap.style.marginTop = "0";

      setPromptFlowHeight(boxHeight + rootFontSize() * 1.5);

      promptScrollRef.current = {
        ...metrics,
        initialTop: pinTop,
        left: pinLeft,
        width: pinWidth,
        targetTop,
        scrollEnd: measureScrollEnd(),
        pinned: true,
        // Preserve lock flags across re-pins (e.g. resize).
        lockedAtBottom: metrics.lockedAtBottom,
        lockedInSection: metrics.lockedInSection,
      };

      document.documentElement.style.setProperty(
        "--prompt-box-height",
        `${boxHeight}px`,
      );
      document.documentElement.style.setProperty(
        "--prompt-bottom-padding",
        `${bottomPadding}px`,
      );
    };

    let frame = 0;

    const update = () => {
      if (!scrollUnlocked) {
        clearPin();
        setPromptAtBottom(false);
        return;
      }

      if (!promptScrollRef.current.pinned) {
        pinPrompt();
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const metrics = promptScrollRef.current;
        if (!metrics.pinned) return;

        // Anchored in section two — native scroll, no viewport lerp.
        if (metrics.lockedInSection) return;

        // Once locked at the bottom, clamp to targetTop and don't move.
        if (metrics.lockedAtBottom) {
          wrap.style.top = `${metrics.targetTop}px`;
          return;
        }

        metrics.scrollEnd = measureScrollEnd();

        const progress = Math.min(
          Math.max(window.scrollY / metrics.scrollEnd, 0),
          1,
        );
        const top =
          metrics.initialTop +
          (metrics.targetTop - metrics.initialTop) * progress;
        wrap.style.top = `${top}px`;

        if (progress >= 0.98) {
          metrics.lockedAtBottom = true;
          wrap.style.top = `${metrics.targetTop}px`;
          setPromptAtBottom(true);
        }
      });
    };

    const onResize = () => {
      if (!scrollUnlocked || !promptScrollRef.current.pinned) return;

      const metrics = promptScrollRef.current;

      if (metrics.lockedInSection) {
        const section = secondSectionRef.current;
        if (section) {
          anchorToSecondSection(wrap, section, 10);
          const stack = listingStackRef.current;
          if (stack) anchorToSecondSection(stack, section, 8);
        }
        return;
      }

      const bottomPadding = rootFontSize() * 2;
      const boxHeight = wrap.offsetHeight;
      const targetTop = window.innerHeight - bottomPadding - boxHeight;
      const rect = wrap.getBoundingClientRect();

      promptScrollRef.current.targetTop = targetTop;
      promptScrollRef.current.scrollEnd = measureScrollEnd();
      promptScrollRef.current.left = rect.left;
      promptScrollRef.current.width = rect.width;
      wrap.style.left = `${rect.left}px`;
      wrap.style.width = `${rect.width}px`;

      document.documentElement.style.setProperty(
        "--prompt-box-height",
        `${boxHeight}px`,
      );
      document.documentElement.style.setProperty(
        "--prompt-bottom-padding",
        `${bottomPadding}px`,
      );

      update();
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      clearPin();
    };
  }, [scrollUnlocked]);

  // Pin synchronously on unlock — before paint — so margin/layout changes never flash.
  useLayoutEffect(() => {
    if (!scrollUnlocked) return;
    const wrap = promptWrapRef.current;
    const section = secondSectionRef.current;
    if (!wrap || !section || promptScrollRef.current.pinned) return;

    const rootFontSize = () => window.innerWidth / 24.375;
    const rect = wrap.getBoundingClientRect();
    const metrics = promptScrollRef.current;
    const pinTop = metrics.prePinTop || rect.top;
    const pinLeft = metrics.prePinLeft || rect.left;
    const pinWidth = metrics.prePinWidth || rect.width;
    const bottomPadding = rootFontSize() * 2;
    const boxHeight = wrap.offsetHeight;
    const targetTop = window.innerHeight - bottomPadding - boxHeight;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollEnd = Math.max(
      1,
      sectionTop + section.offsetHeight - window.innerHeight,
    );

    wrap.style.position = "fixed";
    wrap.style.left = `${pinLeft}px`;
    wrap.style.width = `${pinWidth}px`;
    wrap.style.top = `${pinTop}px`;
    wrap.style.transform = "none";
    wrap.style.zIndex = "10";
    wrap.style.marginTop = "0";

    setPromptFlowHeight(boxHeight + rootFontSize() * 1.5);

    promptScrollRef.current = {
      ...metrics,
      initialTop: pinTop,
      left: pinLeft,
      width: pinWidth,
      targetTop,
      scrollEnd,
      pinned: true,
      lockedAtBottom: metrics.lockedAtBottom,
      lockedInSection: metrics.lockedInSection,
    };

    document.documentElement.style.setProperty(
      "--prompt-box-height",
      `${boxHeight}px`,
    );
    document.documentElement.style.setProperty(
      "--prompt-bottom-padding",
      `${bottomPadding}px`,
    );
  }, [scrollUnlocked]);

  // Listing cards — one by one, only after the AI box hits the phone bottom.
  useEffect(() => {
    if (!promptAtBottom || listingRevealStartedRef.current) return;

    listingRevealStartedRef.current = true;

    const timers = LISTING_CARDS.map((_, i) =>
      setTimeout(() => setRevealedListingCount(i + 1), 200 + i * 260),
    );

    return () => timers.forEach(clearTimeout);
  }, [promptAtBottom]);

  // First listing card: reparent UI into second section and anchor there.
  useLayoutEffect(() => {
    if (revealedListingCount < 1) return;

    const metrics = promptScrollRef.current;
    if (metrics.lockedInSection) return;

    const section = secondSectionRef.current;
    const wrap = promptWrapRef.current;
    const stack = listingStackRef.current;
    if (!section || !wrap) return;

    // Move prompt from hero into section two (stack already lives in section).
    if (wrap.parentElement !== section) {
      section.appendChild(wrap);
    }

    anchorToSecondSection(wrap, section, 10);
    if (stack) anchorToSecondSection(stack, section, 8);
    metrics.lockedInSection = true;
  }, [revealedListingCount]);

  // Fit listing stack in the band between nav and the settled AI box.
  useEffect(() => {
    if (!promptAtBottom) return;

    const fitListingStack = () => {
      const stack = listingStackRef.current;
      const inner = listingInnerRef.current;
      if (!stack || !inner) return;

      const nav = document.querySelector(".mobile-nav");
      const navBg = document.querySelector(".mobile-nav-bg");
      const navBottom = Math.max(
        nav?.getBoundingClientRect().bottom ?? 0,
        navBg?.getBoundingClientRect().bottom ?? 0,
      );
      const rootEm = window.innerWidth / 24.375;
      const safeTop = Math.max(navBottom, rootEm * 5.5) + 10;

      document.documentElement.style.setProperty(
        "--listing-stack-top",
        `${safeTop}px`,
      );

      inner.style.zoom = "1";
      inner.style.transformOrigin = "center center";

      if (
        (kitchenCardFocused || kitchenCardExpanded) &&
        !sectionTwoCompleteRef.current
      ) {
        return;
      }

      const available = stack.clientHeight - 12;
      const needed = inner.scrollHeight;
      if (needed > available && needed > 0) {
        const scale = Math.max(0.58, available / needed);
        inner.style.zoom = String(scale);
      }
    };

    fitListingStack();
    requestAnimationFrame(fitListingStack);
    const ro = new ResizeObserver(fitListingStack);
    if (listingStackRef.current) ro.observe(listingStackRef.current);
    if (listingInnerRef.current) ro.observe(listingInnerRef.current);
    window.addEventListener("resize", fitListingStack);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fitListingStack);
      if (listingInnerRef.current) {
        listingInnerRef.current.style.zoom = "";
      }
      document.documentElement.style.removeProperty("--listing-stack-top");
    };
  }, [
    promptAtBottom,
    revealedListingCount,
    showLogo,
    kitchenCardFocused,
    kitchenCardExpanded,
    sectionTwoComplete,
  ]);

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
            zIndex:
              scrollUnlocked && revealedListingCount < 1 ? 3 : 1,
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

          {/* Spacer keeps hero layout height once the AI box is position:fixed. */}
          {scrollUnlocked && promptFlowHeight > 0 ? (
            <div
              aria-hidden
              style={{ alignSelf: "stretch", height: promptFlowHeight }}
            />
          ) : null}

          {/* Fixed on scroll — stays in hero until unlock, then glides to
              the bottom of the second-section viewport. */}
          <div
            ref={promptWrapRef}
            style={{
              alignSelf: "stretch",
              width: "100%",
              marginTop: "1.5em",
              position: "relative",
              zIndex: 2,
              overflow: "visible",
              willChange: scrollUnlocked ? "top" : "auto",
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
                  <>
                    <span className="hero-prompt-chip">
                      {labIcon}
                      {SELECTED_LABEL}
                    </span>
                    {promptPhase === "chip" && (
                      <span className="type-caret" aria-hidden />
                    )}
                  </>
                )}

                {(promptPhase === "typing" || promptPhase === "done") && (
                  <>
                    <span className="hero-prompt-typed">{typed}</span>
                    {promptPhase === "typing" && (
                      <span className="type-caret" aria-hidden />
                    )}
                    <span className="hero-prompt-reserve">
                      {HERO_PROMPT.slice(typed.length)}
                    </span>
                  </>
                )}

                {promptPhase === "followup-ready" && (
                  <span className="type-caret" aria-hidden />
                )}

                {(promptPhase === "followup-typing" ||
                  promptPhase === "followup-done") && (
                  <>
                    <span className="hero-prompt-typed">{typed}</span>
                    {promptPhase === "followup-typing" && (
                      <span className="type-caret" aria-hidden />
                    )}
                    <span className="hero-prompt-reserve">
                      {FOLLOWUP_PROMPT.slice(typed.length)}
                    </span>
                  </>
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

        {/* Second section — listings + AI box live here once settled. */}
        <div
          ref={secondSectionRef}
          className={`second-section${
            sectionTwoComplete ? " second-section--elevated" : ""
          }`}
        >
          {promptAtBottom ? (
            <div
              ref={listingStackRef}
              className={`listing-stack${
                kitchenCardFocused && !sectionTwoComplete
                  ? " listing-stack--kitchen-focused"
                  : ""
              }`}
              aria-label="Listing results"
              style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
            >
              <div ref={listingInnerRef} className="listing-stack-inner">
              {LISTING_CARDS.map((listing, i) => (
              <div
                key={listing.title}
                ref={
                  i === KITCHEN_LISTING_INDEX ? kitchenSlotRef : undefined
                }
                className={`listing-card-slot listing-card-slot--${i}${
                  i < revealedListingCount ? " is-visible" : ""
                }${
                  i === KITCHEN_LISTING_INDEX &&
                  kitchenCardExpanded &&
                  !sectionTwoComplete
                    ? " is-kitchen-hidden"
                    : ""
                }`}
              >
                <article className="listing-card">
                  <div className="listing-card-media">
                    <img
                      src={listing.image}
                      alt={listing.alt}
                      className="listing-card-image"
                    />
                    <div className="listing-card-image-fade" aria-hidden />
                  </div>
                  <div className="listing-card-footer">
                    <div className="listing-card-body">
                      <h3 className="listing-card-title">{listing.title}</h3>
                      <p className="listing-card-distance">
                        {listing.distanceMi} mi away
                      </p>
                    </div>
                    <div className="listing-card-meta">
                      <span className="listing-card-sqft">
                        {formatSqFt(listing.sqFt)}
                      </span>
                      <div className="listing-card-meta-row">
                        <span
                          className="listing-card-rating"
                          aria-label={`Rating ${listing.rating}`}
                        >
                          {listing.rating}
                          <svg
                            className="listing-card-rating-star"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </span>
                        <div
                          className="listing-card-hosts"
                          aria-label="Hosts"
                        >
                          {listing.hosts.map((host, hostIndex) => (
                            <span
                              key={host.initials}
                              className={`listing-card-avatar${
                                hostIndex === 0
                                  ? " listing-card-avatar--back"
                                  : " listing-card-avatar--front"
                              }`}
                              style={{
                                background: `linear-gradient(${host.gradient})`,
                              }}
                            >
                              {host.initials}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Kitchen overlay — section two after expand, body during glide, section three when landed. */}
        {kitchenCardExpanded &&
        (kitchenAnchoredInThird
          ? thirdSectionRef.current
          : kitchenGlideStarted
            ? document.body
            : secondSectionRef.current)
          ? createPortal(
              (() => {
                const listing = LISTING_CARDS[KITCHEN_LISTING_INDEX];
                return (
                  <div
                    ref={kitchenOverlayRef}
                    className={`kitchen-expand-overlay${
                      kitchenGlideStarted && !kitchenAnchoredInThird
                        ? " is-floating"
                        : ""
                    }`}
                    style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
                  >
                    <div className="listing-card-media kitchen-expand-overlay__media">
                      <img
                        src={listing.image}
                        alt={listing.alt}
                        className="listing-card-image"
                      />
                      <span className="kitchen-expand-price-badge">
                        {KITCHEN_EXPANDED_DETAILS.pricePerHour}
                      </span>
                      <div className="listing-card-image-fade" aria-hidden />
                    </div>
                    <div className="listing-card-footer kitchen-expand-overlay__footer">
                      <div className="kitchen-expand-overlay__head">
                        <div className="listing-card-body kitchen-expand-overlay__body">
                          <h3 className="listing-card-title">{listing.title}</h3>
                          <span className="listing-card-sqft">
                            {formatSqFt(listing.sqFt)}
                          </span>
                          <p className="kitchen-expand-availability">
                            {KITCHEN_EXPANDED_DETAILS.availability}
                          </p>
                        </div>
                        <ul
                          className="kitchen-expand-amenities"
                          aria-label="Amenities"
                        >
                          {KITCHEN_EXPANDED_DETAILS.amenities.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="kitchen-expand-overlay__bottom">
                        <div
                          className="kitchen-expand-hosts-row"
                          aria-label="Hosts"
                        >
                          <span className="kitchen-expand-hosts-label">
                            Hosts
                          </span>
                          <div className="listing-card-hosts kitchen-expand-hosts-avatars">
                            {listing.hosts.map((host, hostIndex) => (
                              <span
                                key={host.initials}
                                className={`listing-card-avatar${
                                  hostIndex === 0
                                    ? " listing-card-avatar--back"
                                    : " listing-card-avatar--front"
                                }`}
                                style={{
                                  background: `linear-gradient(${host.gradient})`,
                                }}
                              >
                                {host.initials}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="listing-card-meta kitchen-expand-overlay__meta">
                          <p className="listing-card-distance">
                            {listing.distanceMi} mi away
                          </p>
                          <span
                            className="listing-card-rating"
                            aria-label={`Rating ${listing.rating} from ${KITCHEN_EXPANDED_DETAILS.reviewCount} reviews`}
                          >
                            {listing.rating}
                            <svg
                              className="listing-card-rating-star"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="kitchen-expand-review-count">
                              ({KITCHEN_EXPANDED_DETAILS.reviewCount})
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })(),
              kitchenAnchoredInThird
                ? thirdSectionRef.current!
                : kitchenGlideStarted
                  ? document.body
                  : secondSectionRef.current!,
            )
          : null}

        {sectionTwoComplete ? (
          <div ref={thirdSectionRef} className="third-section" />
        ) : null}
      </section>
    </main>
  );
}
