"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { FourthSection } from "@/components/fourth-section";
import { MOBILE_ROOT_FONT_SIZE } from "@/lib/mobile-layout";
import { LISTING_CARDS } from "@/lib/listings";

type HeroDeckPosition = {
  size?: string;
  rotate: string;
  /** Horizontal offset of card center from the hero midpoint. */
  centerOffset: string;
  bottom: string;
  zIndex?: number;
};

type HeroPhotoItem = HeroDeckPosition & {
  kind: "photo";
  src: string;
  alt: string;
};

type HeroHost = {
  initials: string;
  gradient: string;
};

type HeroHostsItem = HeroDeckPosition & {
  kind: "hosts";
  hosts: readonly HeroHost[];
};

type HeroMetaItem = HeroDeckPosition & {
  kind: "meta";
  sqFt: number;
  rating: number;
  reviewCount: number;
};

type HeroTagItem = HeroDeckPosition & {
  kind: "tag";
  label: string;
};

type HeroDeckItem =
  | HeroPhotoItem
  | HeroHostsItem
  | HeroMetaItem
  | HeroTagItem;

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

/** Frosted prompt bars revealed under the compact kitchen card in section three. */
const THIRD_SECTION_PROMPT_BARS = 4;

const THIRD_SECTION_CONFIRM_DETAILS = [
  "36″ kitchen counter",
  "Hardwood floors",
  "South-facing windows",
  "Dog bowls ready",
];

const THIRD_SECTION_DETAIL_CONFIRM_DELAY_MS = 700;
const THIRD_SECTION_DETAIL_CONFIRM_STAGGER_MS = 850;

const THIRD_SECTION_BAR_LABELS: (string | null)[] = [
  null, // bar 0 has custom content
  "Reviewing listing rules",
  "Checking host availability",
  "Setting up your booking",
];

const THIRD_SECTION_CLOSED_LABELS = [
  "Space meets your preferences",
  "Project complies with listing rules",
  "Availability confirmed",
  "Booked",
];

const THIRD_SECTION_BAR_CLOSE_ANIM_MS = 850;
const THIRD_SECTION_BAR_THINKING_MS = 3400;
const THIRD_SECTION_BAR0_CLOSE_DELAY_MS = 1400;

const THIRD_SECTION_WEEK_DAYS = [
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
  "Su",
] as const;

const THIRD_SECTION_TODAY_INDEX = 3;

const thirdSectionThinkingCircle = (
  <svg
    className="third-section-thinking-circle"
    viewBox="0 0 20 20"
    aria-hidden
  >
    <circle
      className="third-section-thinking-circle__track"
      cx="10"
      cy="10"
      r="8"
    />
    <circle
      className="third-section-thinking-circle__arc"
      cx="10"
      cy="10"
      r="8"
    />
  </svg>
);

const thirdSectionHeaderCheck = (
  <span className="third-section-header-check" aria-hidden>
    <svg viewBox="0 0 20 20">
      <circle className="third-section-header-check__ring" cx="10" cy="10" r="8" />
      <path
        className="third-section-header-check__mark"
        d="M6.25 10.15 8.85 12.75 13.85 7.55"
      />
    </svg>
  </span>
);

const HERO_KITCHEN_HOSTS = LISTING_CARDS[KITCHEN_LISTING_INDEX].hosts;

const heroDeckHalfSize = (size: string) => `${parseFloat(size) / 2}em`;

const HERO_DECK_TAGS = KITCHEN_EXPANDED_DETAILS.amenities.slice(0, 3);

const heroDeck: HeroDeckItem[] = [
  {
    kind: "photo",
    src: "/images/kitchen.png",
    alt: "Kitchen",
    size: "7.5em",
    centerOffset: "-10.5em",
    bottom: "3.5em",
    rotate: "3.5deg",
  },
  {
    kind: "tag",
    label: HERO_DECK_TAGS[0],
    centerOffset: "-7.875em",
    bottom: "5em",
    rotate: "-1.5deg",
    zIndex: 3,
  },
  {
    kind: "hosts",
    hosts: HERO_KITCHEN_HOSTS,
    size: "6em",
    centerOffset: "-5.25em",
    bottom: "6.1em",
    rotate: "-2deg",
    zIndex: 2,
  },
  {
    kind: "photo",
    src: "/images/courtyard.png",
    alt: "Garden terrace",
    size: "8.25em",
    centerOffset: "0em",
    bottom: "2.5em",
    rotate: "1.5deg",
  },
  {
    kind: "tag",
    label: HERO_DECK_TAGS[1],
    centerOffset: "0em",
    bottom: "7.35em",
    rotate: "1deg",
    zIndex: 3,
  },
  {
    kind: "meta",
    sqFt: LISTING_CARDS[KITCHEN_LISTING_INDEX].sqFt,
    rating: LISTING_CARDS[KITCHEN_LISTING_INDEX].rating,
    reviewCount: KITCHEN_EXPANDED_DETAILS.reviewCount,
    size: "6em",
    centerOffset: "5.25em",
    bottom: "6.1em",
    rotate: "2deg",
    zIndex: 2,
  },
  {
    kind: "tag",
    label: HERO_DECK_TAGS[2],
    centerOffset: "7.875em",
    bottom: "5em",
    rotate: "1.5deg",
    zIndex: 3,
  },
  {
    kind: "photo",
    src: "/images/warehouse-2.png",
    alt: "Warehouse",
    size: "7.5em",
    centerOffset: "10.5em",
    bottom: "3.5em",
    rotate: "-3.5deg",
  },
] as const;

const ratingStarIcon = (
  <svg
    className="listing-card-rating-star"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

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

const chevronDownIcon = (
  <svg
    style={{ width: "0.85em", height: "0.85em" }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
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
  const [kitchenContentReady, setKitchenContentReady] = useState(false);
  const [sectionTwoComplete, setSectionTwoComplete] = useState(false);
  const [kitchenAnchoredInThird, setKitchenAnchoredInThird] = useState(false);
  const [kitchenInThirdSection, setKitchenInThirdSection] = useState(false);
  const [kitchenCompact, setKitchenCompact] = useState(false);
  const [revealedThirdBarCount, setRevealedThirdBarCount] = useState(0);
  const [confirmedDetailCount, setConfirmedDetailCount] = useState(0);
  const [closedBarCount, setClosedBarCount] = useState(0);
  const [thirdSectionAnimationComplete, setThirdSectionAnimationComplete] =
    useState(false);
  const [promptFlowHeight, setPromptFlowHeight] = useState(0);

  const promptWrapRef = useRef<HTMLDivElement>(null);
  const promptSlotRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const thirdSectionRef = useRef<HTMLDivElement>(null);
  const fourthSectionRef = useRef<HTMLElement>(null);
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
    preSlotHeight: 0,
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
  const kitchenInThirdSectionRef = useRef(false);
  const thirdSectionAnimationCompleteRef = useRef(false);
  const kitchenCompactHeightRef = useRef(0);
  const kitchenGlideBoundsRef = useRef({ glideStart: 0, glideEnd: 0 });
  const kitchenGlideProgressRef = useRef(0);

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
        const slot = promptSlotRef.current;
        if (wrap) {
          const rect = wrap.getBoundingClientRect();
          promptScrollRef.current.prePinTop = rect.top;
          promptScrollRef.current.prePinLeft = rect.left;
          promptScrollRef.current.prePinWidth = rect.width;
          const slotHeight = slot?.offsetHeight ?? wrap.offsetHeight;
          promptScrollRef.current.preSlotHeight = slotHeight;
          if (slot) slot.style.height = `${slotHeight}px`;
          setPromptFlowHeight(slotHeight);
        }
        setScrollUnlocked(true);
      }, 780),
    );

    heroDeck.forEach((_, i) => {
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
      // Lock content visible before portal moves so re-mounts don't replay animation.
      setKitchenContentReady(true);
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

      // Gently zoom the photo out as the card grows so it feels like a smooth
      // reveal rather than just stretching with the container.
      const img = overlay.querySelector<HTMLElement>(".listing-card-image");
      if (img) {
        // Set starting scale with no transition, then enable and animate to 1.
        img.style.transition = "none";
        img.style.transform = "scale(1.12)";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            img.style.transition = `transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)`;
            img.style.transform = "scale(1.0)";
          });
        });
      }

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

  const getViewportHeight = () =>
    window.visualViewport?.height ?? window.innerHeight;

  const getViewportOffsetTop = () =>
    window.visualViewport?.offsetTop ?? 0;

  const getThirdSectionGlideBounds = () => {
    const sec3 = thirdSectionRef.current;
    const vh = getViewportHeight();
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

  const canStartKitchenGlide = () => {
    const sec3 = thirdSectionRef.current;
    if (!sec3) return false;
    const { glideStart } = getThirdSectionGlideBounds();
    // Wait until section three has actually begun entering the viewport.
    const sec3Top = sec3.getBoundingClientRect().top;
    return window.scrollY >= glideStart && sec3Top < getViewportHeight();
  };

  const computeKitchenGlideProgress = () => {
    const { glideStart, glideEnd } = kitchenGlideBoundsRef.current;
    const glideSpan = Math.max(glideEnd - glideStart, 1);
    return Math.min(
      Math.max((window.scrollY - glideStart) / glideSpan, 0),
      1,
    );
  };

  /** Pin once on body; position updates use visual viewport coords (Safari-safe). */
  const pinKitchenGlideOnBody = (overlay: HTMLElement) => {
    const g = kitchenGlideRef.current;
    overlay.style.transition = "none";
    overlay.style.position = "fixed";
    overlay.style.left = `${g.left}px`;
    overlay.style.width = `${g.width}px`;
    overlay.style.height = `${g.height}px`;
    overlay.style.zIndex = "11";
    overlay.style.margin = "0";
    overlay.style.transform = "none";
    overlay.style.willChange = "top";
  };

  /** Return the kitchen card to section two if the user scrolls back out of the glide zone. */
  const resetKitchenGlideToSectionTwo = () => {
    if (!kitchenInThirdSectionRef.current || kitchenAnchoredInThirdRef.current) {
      return;
    }
    kitchenInThirdSectionRef.current = false;
    setKitchenInThirdSection(false);
  };

  /** Scroll-linked glide — fixed on body, top in visual viewport coords. */
  const applyKitchenGlideFromScroll = () => {
    const overlay = kitchenOverlayRef.current;
    if (!overlay || kitchenGlideLockedRef.current) return;
    if (!kitchenInThirdSectionRef.current || kitchenAnchoredInThirdRef.current) {
      return;
    }

    const g = kitchenGlideRef.current;
    const p = computeKitchenGlideProgress();
    kitchenGlideProgressRef.current = p;

    const vh = getViewportHeight();
    const vvTop = getViewportOffsetTop();
    const finalTop = vvTop + (vh - g.height) / 2;
    const visualTop = g.settledTop + (finalTop - g.settledTop) * p;

    overlay.style.top = `${Math.round(visualTop * 100) / 100}px`;

    if (p >= 1) {
      kitchenGlideLockedRef.current = true;
      kitchenAnchoredInThirdRef.current = true;
      setKitchenAnchoredInThird(true);
    }
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

  // Keep expanded kitchen card pinned in section two until the glide into section three.
  useLayoutEffect(() => {
    if (
      !sectionTwoComplete ||
      kitchenInThirdSection ||
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
      overlay.style.willChange = "auto";
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, [sectionTwoComplete, kitchenInThirdSection, kitchenAnchoredInThird]);

  // After portal moves to body, pin once then apply current scroll offset.
  useLayoutEffect(() => {
    if (!kitchenInThirdSection || kitchenAnchoredInThird) return;
    const overlay = kitchenOverlayRef.current;
    if (!overlay) return;
    pinKitchenGlideOnBody(overlay);
    applyKitchenGlideFromScroll();
  }, [kitchenInThirdSection, kitchenAnchoredInThird]);

  // Glide: card moves 1:1 with scroll toward viewport center once section three enters.
  useEffect(() => {
    if (!sectionTwoComplete || kitchenAnchoredInThird) return;

    let glideRaf = 0;

    const runGlide = (allowReset: boolean) => {
      const sec3 = thirdSectionRef.current;
      if (!sec3) return;

      if (kitchenAnchoredInThirdRef.current || kitchenGlideLockedRef.current) {
        return;
      }

      const overlay = kitchenOverlayRef.current;
      if (!overlay) return;

      if (!kitchenInThirdSectionRef.current) {
        if (!canStartKitchenGlide()) return;

        kitchenGlideBoundsRef.current = getThirdSectionGlideBounds();
        const rect = overlay.getBoundingClientRect();
        kitchenGlideRef.current = {
          settledTop: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
        kitchenGlideProgressRef.current = 0;
        kitchenInThirdSectionRef.current = true;
        setKitchenInThirdSection(true);
        return;
      }

      if (
        allowReset &&
        window.scrollY < kitchenGlideBoundsRef.current.glideStart - 2
      ) {
        resetKitchenGlideToSectionTwo();
        return;
      }

      applyKitchenGlideFromScroll();
    };

    const onScroll = () => {
      cancelAnimationFrame(glideRaf);
      glideRaf = requestAnimationFrame(() => runGlide(true));
    };

    const onViewportChange = () => {
      cancelAnimationFrame(glideRaf);
      glideRaf = requestAnimationFrame(() => runGlide(false));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onViewportChange);
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", onViewportChange);
    visualViewport?.addEventListener("scroll", onViewportChange);
    return () => {
      cancelAnimationFrame(glideRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onViewportChange);
      visualViewport?.removeEventListener("resize", onViewportChange);
      visualViewport?.removeEventListener("scroll", onViewportChange);
    };
  }, [sectionTwoComplete, kitchenInThirdSection, kitchenAnchoredInThird]);

  // Anchor the kitchen card inside section three so it scrolls with the page.
  useLayoutEffect(() => {
    if (!kitchenAnchoredInThird) return;
    const overlay = kitchenOverlayRef.current;
    const sec3 = thirdSectionRef.current;
    if (!overlay || !sec3) return;

    const apply = () => {
      const g = kitchenGlideRef.current;
      const secRect = sec3.getBoundingClientRect();
      const top = (sec3.offsetHeight - g.height) / 2;
      const left = g.left - secRect.left;
      const rootEm = window.innerWidth / 24.375;
      const compactHeight = Math.max(g.height * 0.38, rootEm * 11);

      kitchenCompactHeightRef.current = compactHeight;

      overlay.style.transition = "none";
      overlay.style.position = "absolute";
      overlay.style.top = `${top}px`;
      overlay.style.left = `${left}px`;
      overlay.style.width = `${g.width}px`;
      overlay.style.height = `${g.height}px`;
      overlay.style.zIndex = "11";
      overlay.style.margin = "0";
      overlay.style.transform = "none";
      overlay.style.willChange = "auto";

      sec3.style.setProperty("--kitchen-top", `${top}px`);
      sec3.style.setProperty("--kitchen-left", `${left}px`);
      sec3.style.setProperty("--kitchen-width", `${g.width}px`);
      sec3.style.setProperty("--kitchen-height", `${g.height}px`);
      sec3.style.setProperty("--kitchen-compact-height", `${compactHeight}px`);
    };

    apply();
    window.addEventListener("resize", apply);
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", apply);
    visualViewport?.addEventListener("scroll", apply);
    return () => {
      window.removeEventListener("resize", apply);
      visualViewport?.removeEventListener("resize", apply);
      visualViewport?.removeEventListener("scroll", apply);
    };
  }, [kitchenAnchoredInThird]);

  useEffect(() => {
    thirdSectionAnimationCompleteRef.current = thirdSectionAnimationComplete;
  }, [thirdSectionAnimationComplete]);

  // Fade kitchen while fourth section overlaps; restore when scrolling back up.
  useEffect(() => {
    if (!thirdSectionAnimationComplete || !kitchenCardExpanded) return;

    let raf = 0;

    const update = () => {
      const fourth = fourthSectionRef.current;
      const overlay = kitchenOverlayRef.current;
      if (!fourth || !overlay) return;

      const fourthTop = fourth.getBoundingClientRect().top;
      const vh = window.innerHeight;
      // Start fading only once fourth section has clearly entered the viewport.
      const start = vh * 0.62;
      const end = vh * 0.18;
      const t = Math.min(Math.max((start - fourthTop) / (start - end), 0), 1);

      if (t <= 0) {
        overlay.style.transition = "";
        overlay.style.opacity = "";
        overlay.style.transform = "";
        overlay.style.pointerEvents = "";
        overlay.style.visibility = "";
        return;
      }

      overlay.style.transition =
        "opacity 0.35s ease, transform 0.35s ease, visibility 0.35s ease";
      overlay.style.opacity = String(1 - t);
      overlay.style.transform = `translate3d(0, ${-t * 32}px, 0)`;
      overlay.style.pointerEvents = t > 0.35 ? "none" : "";
      overlay.style.visibility = t >= 0.98 ? "hidden" : "visible";
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      const overlay = kitchenOverlayRef.current;
      if (overlay) {
        overlay.style.transition = "";
        overlay.style.opacity = "";
        overlay.style.transform = "";
        overlay.style.pointerEvents = "";
        overlay.style.visibility = "";
      }
    };
  }, [thirdSectionAnimationComplete, kitchenCardExpanded]);

  // Section-three sequence: shrink kitchen from top, then reveal frosted bars.
  useEffect(() => {
    if (!kitchenAnchoredInThird) return;

    const overlay = kitchenOverlayRef.current;
    const sec3 = thirdSectionRef.current;
    if (!overlay || !sec3) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const compactHeight = kitchenCompactHeightRef.current;

    const kitchenCompactDelayMs = 500;
    const kitchenCompactDurationMs = 1700;
    const bar0AppearMs = kitchenCompactDelayMs + kitchenCompactDurationMs + 280;
    const BAR_CLOSE_ANIM_MS = THIRD_SECTION_BAR_CLOSE_ANIM_MS;
    const BAR_THINKING_MS = THIRD_SECTION_BAR_THINKING_MS;
    const BAR0_CLOSE_DELAY_MS = THIRD_SECTION_BAR0_CLOSE_DELAY_MS;

    timers.push(
      setTimeout(() => {
        overlay.style.transition = `height ${kitchenCompactDurationMs}ms cubic-bezier(0.33, 1, 0.68, 1)`;
        overlay.style.height = `${compactHeight}px`;
        setKitchenCompact(true);
        sec3.style.setProperty("--kitchen-compact-height", `${compactHeight}px`);
      }, kitchenCompactDelayMs),
    );

    // Bar 0 appears once kitchen compact is done
    timers.push(setTimeout(() => setRevealedThirdBarCount(1), bar0AppearMs));

    // Bar 0 details confirm one by one
    for (let i = 0; i < THIRD_SECTION_CONFIRM_DETAILS.length; i++) {
      timers.push(
        setTimeout(
          () => setConfirmedDetailCount(i + 1),
          bar0AppearMs +
            THIRD_SECTION_DETAIL_CONFIRM_DELAY_MS +
            i * THIRD_SECTION_DETAIL_CONFIRM_STAGGER_MS,
        ),
      );
    }

    // Bar 0 closes 1 second after all details confirmed
    const allConfirmedMs =
      bar0AppearMs +
      THIRD_SECTION_DETAIL_CONFIRM_DELAY_MS +
      (THIRD_SECTION_CONFIRM_DETAILS.length - 1) * THIRD_SECTION_DETAIL_CONFIRM_STAGGER_MS;
    const bar0CloseMs = allConfirmedMs + BAR0_CLOSE_DELAY_MS;
    timers.push(setTimeout(() => setClosedBarCount(1), bar0CloseMs));

    // Bars 1-3 appear and close sequentially after bar 0 closes
    let prevCloseMs = bar0CloseMs;
    for (let i = 1; i < THIRD_SECTION_PROMPT_BARS; i++) {
      const barAppearMs = prevCloseMs + BAR_CLOSE_ANIM_MS;
      const barCloseMs = barAppearMs + BAR_THINKING_MS;
      timers.push(setTimeout(() => setRevealedThirdBarCount(i + 1), barAppearMs));
      timers.push(setTimeout(() => setClosedBarCount(i + 1), barCloseMs));
      prevCloseMs = barCloseMs;
    }

    timers.push(
      setTimeout(
        () => setThirdSectionAnimationComplete(true),
        prevCloseMs + BAR_CLOSE_ANIM_MS + 400,
      ),
    );

    return () => {
      timers.forEach(clearTimeout);
      setConfirmedDetailCount(0);
      setClosedBarCount(0);
      setRevealedThirdBarCount(0);
    };
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

      const slotHeight =
        metrics.preSlotHeight || promptFlowHeight || boxHeight;
      if (promptSlotRef.current) {
        promptSlotRef.current.style.height = `${slotHeight}px`;
      }
      setPromptFlowHeight(slotHeight);

      wrap.style.position = "fixed";
      wrap.style.left = `${pinLeft}px`;
      wrap.style.width = `${pinWidth}px`;
      wrap.style.top = `${pinTop}px`;
      wrap.style.transform = "none";
      wrap.style.zIndex = "10";
      wrap.style.marginTop = "0";

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

    const slotHeight =
      metrics.preSlotHeight || promptFlowHeight || boxHeight;
    if (promptSlotRef.current) {
      promptSlotRef.current.style.height = `${slotHeight}px`;
    }
    setPromptFlowHeight(slotHeight);

    wrap.style.position = "fixed";
    wrap.style.left = `${pinLeft}px`;
    wrap.style.width = `${pinWidth}px`;
    wrap.style.top = `${pinTop}px`;
    wrap.style.transform = "none";
    wrap.style.zIndex = "10";
    wrap.style.marginTop = "0";

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
      preSlotHeight: slotHeight,
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

  // Keep the prompt slot height measured so fixed positioning never shifts hero copy.
  useLayoutEffect(() => {
    if (!showHeroPrompt) return;

    const slot = promptSlotRef.current;
    if (!slot) return;

    const measure = () => {
      if (scrollUnlocked) return;
      const nextHeight = slot.offsetHeight;
      setPromptFlowHeight(nextHeight);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    if (promptWrapRef.current) ro.observe(promptWrapRef.current);
    return () => ro.disconnect();
  }, [showHeroPrompt, promptPhase, typed, scrollUnlocked]);

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
          className="hero-stage"
          style={{
            position: "relative",
            zIndex:
              scrollUnlocked && revealedListingCount < 1 ? 3 : 1,
            maxWidth: "var(--ipad-width)",
            margin: "0 auto",
            minHeight: "100vh",
            padding: "1.5em",
            textAlign: "center",
          }}
        >
          <div
            aria-hidden
            className="hero-stage-spacer"
            style={{ flex: "1 1 0", minHeight: 0 }}
          />

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
            {heroDeck.map((item, i) => {
              const isTag = item.kind === "tag";
              const deckStyle: CSSProperties & {
                "--base-rotate": string;
                "--hero-card-size"?: string;
              } = {
                position: "absolute",
                bottom: item.bottom,
                left: isTag
                  ? `calc(50% + ${item.centerOffset})`
                  : `calc(50% + ${item.centerOffset} - ${heroDeckHalfSize(item.size!)})`,
                width: isTag ? undefined : item.size,
                height: isTag ? undefined : item.size,
                zIndex: item.zIndex,
                "--base-rotate": item.rotate,
                ...(isTag ? {} : { "--hero-card-size": item.size }),
              };

              if (item.kind === "photo") {
                return (
                  <img
                    key={i}
                    src={item.src}
                    alt={item.alt}
                    className={`hero-image-rise${i < revealedImageCount ? " is-visible" : ""}`}
                    style={{
                      ...deckStyle,
                      objectFit: "cover",
                      borderRadius: "1em",
                      boxShadow: "0 0.85em 2.25em rgba(0, 0, 0, 0.28)",
                    }}
                  />
                );
              }

              if (item.kind === "tag") {
                return (
                  <span
                    key={i}
                    className={`hero-deck-tag hero-image-rise hero-image-rise--centered${
                      i < revealedImageCount ? " is-visible" : ""
                    }`}
                    style={deckStyle}
                  >
                    {item.label}
                  </span>
                );
              }

              if (item.kind === "hosts") {
                return (
                  <div
                    key={i}
                    className={`hero-info-card hero-info-card--hosts hero-image-rise${
                      i < revealedImageCount ? " is-visible" : ""
                    }`}
                    style={deckStyle}
                  >
                    <div className="hero-info-card-inner">
                      <span className="hero-info-card-label">Hosts</span>
                      <div className="hero-info-card-hosts-stage">
                        <div className="listing-card-hosts" aria-label="Hosts">
                          {item.hosts.map((host, hostIndex) => (
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
                );
              }

              return (
                <div
                  key={i}
                  className={`hero-info-card hero-info-card--meta hero-image-rise${
                    i < revealedImageCount ? " is-visible" : ""
                  }`}
                  style={deckStyle}
                >
                  <div className="hero-info-card-inner">
                    <span className="hero-info-card-sqft">
                      {formatSqFt(item.sqFt)}
                    </span>
                    <span
                      className="hero-info-card-rating"
                      aria-label={`Rating ${item.rating} from ${item.reviewCount} reviews`}
                    >
                      {item.rating}
                      {ratingStarIcon}
                      <span className="hero-info-card-reviews">
                        ({item.reviewCount})
                      </span>
                    </span>
                  </div>
                </div>
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
              fontSize: "2.08em",
              fontWeight: 300,
              lineHeight: 1.18,
              textAlign: "left",
              width: "100%",
            }}
          >
            Book spaces for
            <br />
            physical intelligence.
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
            <Link
              href="/book"
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
                textDecoration: "none",
              }}
            >
              Book
              {upRightArrow}
            </Link>
          </div>
          </div>

          {/* Slot reserves prompt height so hero copy never jumps on submit. */}
          <div
            ref={promptSlotRef}
            className="hero-prompt-slot"
            style={{
              alignSelf: "stretch",
              width: "100%",
              marginTop: "1.5em",
              height:
                showHeroPrompt && promptFlowHeight > 0
                  ? promptFlowHeight
                  : undefined,
              flexShrink: 0,
            }}
          >
          <div
            ref={promptWrapRef}
            className="hero-prompt-wrap"
            style={{
              width: "100%",
              position: scrollUnlocked ? "fixed" : "relative",
              zIndex: 2,
              overflow: "visible",
              willChange: scrollUnlocked ? "top" : "auto",
            }}
          >
          {/* Frosted-glass prompt card — backdrop blur + dark overlay, with a
              typing animation, blinking caret, and a circular send button. */}
          <div
            className={`hero-prompt-card-shell hero-intro-fade${
              showHeroPrompt ? " is-visible" : ""
            }`}
          >
          <div className="hero-prompt-card">
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
          </div>

          <div
            aria-hidden
            className="hero-stage-spacer"
            style={{ flex: "1 1 0", minHeight: 0 }}
          />
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

        {/* Kitchen overlay — section two, body during glide, section three when landed. */}
        {kitchenCardExpanded &&
        (kitchenAnchoredInThird
          ? thirdSectionRef.current
          : kitchenInThirdSection
            ? typeof document !== "undefined"
              ? document.body
              : null
            : secondSectionRef.current)
          ? createPortal(
              (() => {
                const listing = LISTING_CARDS[KITCHEN_LISTING_INDEX];
                return (
                  <div
                    ref={kitchenOverlayRef}
                    className={`kitchen-expand-overlay${
                      kitchenInThirdSection && !kitchenAnchoredInThird
                        ? " is-floating"
                        : ""
                    }${kitchenContentReady ? " content-ready" : ""}${
                      kitchenCompact ? " is-compact" : ""
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
                      {kitchenCompact ? (
                        <div className="kitchen-expand-overlay__compact-body">
                          <h3 className="listing-card-title">{listing.title}</h3>
                          <p className="kitchen-expand-availability">
                            {KITCHEN_EXPANDED_DETAILS.availability}
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="kitchen-expand-overlay__head">
                            <div className="listing-card-body kitchen-expand-overlay__body">
                              <h3 className="listing-card-title">
                                {listing.title}
                              </h3>
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
                              {KITCHEN_EXPANDED_DETAILS.amenities.map(
                                (item) => (
                                  <li key={item}>{item}</li>
                                ),
                              )}
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
                        </>
                      )}
                    </div>
                  </div>
                );
              })(),
              kitchenAnchoredInThird
                ? thirdSectionRef.current!
                : kitchenInThirdSection
                  ? document.body
                  : secondSectionRef.current!,
            )
          : null}

        {sectionTwoComplete ? (
          <div
            ref={thirdSectionRef}
            className={`third-section${
              kitchenAnchoredInThird ? " third-section--kitchen-active" : ""
            }${
              thirdSectionAnimationComplete
                ? " third-section--animation-complete"
                : ""
            }`}
          >
            {kitchenAnchoredInThird ? (
              <div
                className="third-section-bars"
                aria-hidden={revealedThirdBarCount === 0}
                style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
              >
                {Array.from({ length: THIRD_SECTION_PROMPT_BARS }, (_, i) => {
                  const isClosed = i < closedBarCount;
                  const isVisible = i < revealedThirdBarCount;
                  const label = THIRD_SECTION_BAR_LABELS[i];

                  return (
                    <div
                      key={i}
                      className={`third-section-prompt-bar third-section-prompt-bar--${i}${
                        isVisible ? " is-visible" : ""
                      }${isClosed ? " is-closed" : ""}`}
                    >
                      <div
                        className={`third-section-prompt-bar__content${
                          i > 0 && !isClosed
                            ? " third-section-prompt-bar__content--step"
                            : ""
                        }`}
                      >
                        {isClosed ? (
                          <div
                            className="third-section-prompt-bar__closed"
                            aria-live={i === 0 ? "polite" : undefined}
                          >
                            {thirdSectionHeaderCheck}
                            <p className="third-section-prompt-bar__summary">
                              {THIRD_SECTION_CLOSED_LABELS[i]}
                            </p>
                          </div>
                        ) : i === 0 ? (
                            <>
                              <div
                                className="third-section-prompt-bar__header"
                                aria-live="polite"
                              >
                                {thirdSectionThinkingCircle}
                                <p className="third-section-prompt-bar__text">
                                  Confirming space meet preferences
                                </p>
                              </div>
                              <ul className="third-section-prompt-bar__details">
                                {THIRD_SECTION_CONFIRM_DETAILS.map(
                                  (detail, detailIndex) => {
                                    const isConfirmed =
                                      detailIndex < confirmedDetailCount;
                                    return (
                                      <li
                                        key={detail}
                                        className={isConfirmed ? " is-confirmed" : ""}
                                      >
                                        <span className="third-section-prompt-bar__detail-text">
                                          {detail}
                                        </span>
                                        {isConfirmed ? (
                                          <span className="third-section-detail-check" aria-hidden>
                                            <svg viewBox="0 0 20 20">
                                              <circle className="third-section-detail-check__ring" cx="10" cy="10" r="8" />
                                              <path className="third-section-detail-check__mark" d="M6.25 10.15 8.85 12.75 13.85 7.55" />
                                            </svg>
                                          </span>
                                        ) : (
                                          <span className="third-section-thinking-circle third-section-thinking-circle--detail">
                                            <svg viewBox="0 0 20 20" aria-hidden>
                                              <circle className="third-section-thinking-circle__track" cx="10" cy="10" r="8" />
                                              <circle className="third-section-thinking-circle__arc" cx="10" cy="10" r="8" />
                                            </svg>
                                          </span>
                                        )}
                                      </li>
                                    );
                                  },
                                )}
                              </ul>
                            </>
                        ) : i === 1 ? (
                          <>
                            <div className="third-section-prompt-bar__header">
                              {thirdSectionThinkingCircle}
                              <p className="third-section-prompt-bar__text">
                                {label}
                              </p>
                            </div>
                            <div className="tsbar-chips">
                              <span className="tsbar-chip">No music after 10pm</span>
                              <span className="tsbar-chip">Up to 8 guests</span>
                              <span className="tsbar-chip tsbar-chip--ok">
                                Dog-friendly
                              </span>
                            </div>
                          </>
                        ) : i === 2 ? (
                          <>
                            <div className="third-section-prompt-bar__header">
                              {thirdSectionThinkingCircle}
                              <p className="third-section-prompt-bar__text">
                                {label}
                              </p>
                            </div>
                            <div className="tsbar-avail">
                              <p className="tsbar-avail__slot">Thu · 2pm – 5pm</p>
                              <div className="tsbar-cal" aria-hidden>
                                {THIRD_SECTION_WEEK_DAYS.map((day, dayIndex) => (
                                  <span
                                    key={day}
                                    className={`tsbar-cal__day${
                                      dayIndex === THIRD_SECTION_TODAY_INDEX
                                        ? " is-today"
                                        : dayIndex < THIRD_SECTION_TODAY_INDEX
                                          ? " is-past"
                                          : " is-available"
                                    }`}
                                  >
                                    {day}
                                  </span>
                                ))}
                              </div>
                              <p className="tsbar-avail__caption">Available</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="third-section-prompt-bar__header">
                              {thirdSectionThinkingCircle}
                              <p className="third-section-prompt-bar__text">
                                {label}
                              </p>
                            </div>
                            <div className="tsbar-booking-card">
                              <p className="tsbar-booking-card__title">
                                Kitchen Studio
                              </p>
                              <p className="tsbar-booking-card__meta">
                                Today, 2pm – 5pm · $120 USD
                              </p>
                              <p className="tsbar-booking-card__status">
                                <span
                                  className="tsbar-booking-card__status-dot"
                                  aria-hidden
                                />
                                Payment sending…
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
        {thirdSectionAnimationComplete ? (
          <FourthSection ref={fourthSectionRef} scrollReveal />
        ) : null}
        {thirdSectionAnimationComplete ? (
          <footer
            className="mobile-site-footer"
            style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
          >
            <div className="mobile-site-footer__box">
              <p className="mobile-site-footer__wordmark">BINOCULAR</p>
            </div>
          </footer>
        ) : null}
      </section>
    </main>
  );
}
