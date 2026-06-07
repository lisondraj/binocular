"use client";

import { useEffect, useRef, useState } from "react";

const MAIN2_NAV_PROMPT_INVITE = "Ask about spaces, people, or actions…";

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

type Main2HeroPromptCardProps = {
  className?: string;
  focusWhenOpen?: boolean;
};

/** /main2 — white AI prompt card (nav search). */
export function Main2HeroPromptCard({
  className = "",
  focusWhenOpen = false,
}: Main2HeroPromptCardProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!focusWhenOpen) return;
    inputRef.current?.focus();
  }, [focusWhenOpen]);

  return (
    <div
      className={`hero-prompt-card-shell main2-hero-prompt-card-shell main2-nav-prompt-card-shell is-visible${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="hero-prompt-card main2-hero-prompt-card main2-nav-prompt-card">
        <textarea
          ref={inputRef}
          className="hero-prompt-text main2-nav-prompt-card__input"
          placeholder={MAIN2_NAV_PROMPT_INVITE}
          value={value}
          rows={3}
          aria-label="AI search"
          onChange={(event) => setValue(event.target.value)}
        />

        <button
          type="button"
          aria-label="Send"
          className="hero-prompt-send main2-hero-prompt-send main2-nav-prompt-card__send"
        >
          {upArrow}
        </button>
      </div>
    </div>
  );
}
