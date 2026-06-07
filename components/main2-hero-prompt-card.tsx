const MAIN2_PROMPT_TEXT =
  "Show me the 3 closest spaces with a dishwasher, stairs, and a dog. Budget $500.";

const MAIN2_PROMPT_CHIP_LABEL = "Dr. Frank's Lab";

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

type Main2HeroPromptCardProps = {
  className?: string;
};

/** /main2 — white AI prompt card (static done state, shared by hero + nav). */
export function Main2HeroPromptCard({ className = "" }: Main2HeroPromptCardProps) {
  return (
    <div
      className={`hero-prompt-card-shell main2-hero-prompt-card-shell is-visible${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="hero-prompt-card main2-hero-prompt-card">
        <div className="hero-prompt-text">
          <span className="hero-prompt-layout" aria-hidden>
            <span className="hero-prompt-chip">
              {labIcon}
              {MAIN2_PROMPT_CHIP_LABEL}
            </span>
            {MAIN2_PROMPT_TEXT}
          </span>

          <span className="hero-prompt-live">
            <span className="hero-prompt-chip">
              {labIcon}
              {MAIN2_PROMPT_CHIP_LABEL}
            </span>
            <span className="hero-prompt-typed">{MAIN2_PROMPT_TEXT}</span>
          </span>
        </div>

        <button
          type="button"
          aria-label="Send"
          className="hero-prompt-send main2-hero-prompt-send"
        >
          {upArrow}
        </button>
      </div>
    </div>
  );
}
