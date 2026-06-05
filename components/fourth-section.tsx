"use client";

import Link from "next/link";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type Ref,
} from "react";
import { MOBILE_ROOT_FONT_SIZE } from "@/lib/mobile-layout";
import {
  FOURTH_SECTION_BUDGET_MAX,
  FOURTH_SECTION_BUDGET_MIN,
  FOURTH_SECTION_BY_BUNDLE,
  FOURTH_SECTION_BY_PRICE,
  FOURTH_SECTION_BY_SPACE,
  LISTING_CARDS,
} from "@/lib/listings";

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

const filterIcon = (
  <svg
    style={{ width: "0.9em", height: "0.9em" }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="8" y1="18" x2="16" y2="18" />
    <circle cx="9" cy="6" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="11" cy="18" r="2" />
  </svg>
);

const microphoneIcon = (
  <svg
    style={{ width: "0.95em", height: "0.95em" }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

function FourthSectionPrice({ price }: { price: string }) {
  const amount = price.replace(/\/hr$/, "");

  return (
    <span className="fourth-section-listing-card__price">
      <span className="fourth-section-listing-card__price-amount">{amount}</span>
      <span className="fourth-section-listing-card__price-currency">USD</span>
    </span>
  );
}

type FourthSectionProps = {
  scrollReveal?: boolean;
  className?: string;
};

export const FourthSection = forwardRef(function FourthSection(
  { scrollReveal = false, className = "" }: FourthSectionProps,
  ref: Ref<HTMLElement>,
) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [budgetMax, setBudgetMax] = useState(200);
  const sectionRef = useRef<HTMLElement | null>(null);

  const budgetFillPct =
    ((budgetMax - FOURTH_SECTION_BUDGET_MIN) /
      (FOURTH_SECTION_BUDGET_MAX - FOURTH_SECTION_BUDGET_MIN)) *
    100;

  const setSectionRef = (node: HTMLElement | null) => {
    sectionRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  useEffect(() => {
    if (!scrollReveal) return;

    let observer: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      const section = sectionRef.current;
      if (!section) return;

      const nodes = section.querySelectorAll<HTMLElement>(".fourth-section-reveal");
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
      );

      nodes.forEach((node) => observer!.observe(node));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [scrollReveal]);

  return (
    <section
      ref={setSectionRef}
      className={`fourth-section${className ? ` ${className}` : ""}`}
      style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
    >
      <div className="fourth-section__intro fourth-section-reveal">
        <p className="fourth-section__description">
          Book spaces for
          <br />
          physical intelligence.
        </p>
        <div className="fourth-section__ai-composer">
          <input
            type="text"
            className="fourth-section__ai-input"
            placeholder="Find a space..."
            aria-label="Find a space"
          />
          <div className="fourth-section__ai-composer-actions">
            <button
              type="button"
              className="fourth-section__ai-composer-btn"
              aria-label="Voice input"
            >
              {microphoneIcon}
            </button>
            <button
              type="button"
              className="fourth-section__ai-composer-btn fourth-section__ai-composer-btn--submit"
              aria-label="Submit"
            >
              {upArrow}
            </button>
          </div>
        </div>
      </div>

      <div className="fourth-section__listings-anchor fourth-section-reveal">
        <div className="fourth-section__listings-toolbar">
          <button
            type="button"
            className={`fourth-section__filter-btn${filterOpen ? " is-open" : ""}`}
            aria-label="Filter listings"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((open) => !open)}
          >
            {filterIcon}
            Filter
          </button>

          {filterOpen ? (
            <div className="fourth-section__filter-dropdown">
              <div className="fourth-section__filter-dropdown-panel">
                <div className="fourth-section__filter-budget">
                  <div className="fourth-section__filter-budget-header">
                    <span className="fourth-section__filter-budget-label">
                      Budget
                    </span>
                    <span className="fourth-section__filter-budget-value">
                      ${budgetMax} USD
                    </span>
                  </div>
                  <div className="fourth-section__filter-budget-meter">
                    <div
                      className="fourth-section__filter-budget-meter-track"
                      aria-hidden
                    >
                      <div
                        className="fourth-section__filter-budget-meter-fill"
                        style={{ width: `${budgetFillPct}%` }}
                      />
                      <span
                        className="fourth-section__filter-budget-meter-thumb"
                        style={{ left: `${budgetFillPct}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      className="fourth-section__filter-budget-meter-input"
                      min={FOURTH_SECTION_BUDGET_MIN}
                      max={FOURTH_SECTION_BUDGET_MAX}
                      step={25}
                      value={budgetMax}
                      aria-label="Maximum budget"
                      onChange={(event) =>
                        setBudgetMax(Number(event.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="fourth-section__listings-block">
          <p className="fourth-section__category">By distance</p>
          <div
            className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
            aria-label="Listings by distance"
          >
            <div className="fourth-section__listings fourth-section__listings--row">
              {LISTING_CARDS.map((listing) => (
                <div
                  key={`fourth-distance-${listing.title}`}
                  className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--distance"
                >
                  <article className="fourth-section-listing-card fourth-section-listing-card--distance">
                    <div className="listing-card-media fourth-section-listing-card__media">
                      <img
                        src={listing.image}
                        alt={listing.alt}
                        className="listing-card-image"
                      />
                      <FourthSectionPrice price={listing.pricePerHour} />
                      <div className="listing-card-image-fade" aria-hidden />
                    </div>
                    <div className="listing-card-footer fourth-section-listing-card__footer">
                      <div className="listing-card-body">
                        <h3 className="listing-card-title">{listing.title}</h3>
                        <p className="listing-card-distance">
                          {listing.distanceMi} mi away
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fourth-section__listings-block fourth-section-reveal">
        <p className="fourth-section__category">By space</p>
        <div
          className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
          aria-label="Listings by space"
        >
          <div className="fourth-section__listings fourth-section__listings--row">
            {FOURTH_SECTION_BY_SPACE.map((listing) => (
              <div
                key={`fourth-space-${listing.title}`}
                className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--space"
              >
                <article className="fourth-section-listing-card fourth-section-listing-card--space">
                  <div className="listing-card-media fourth-section-listing-card__media">
                    <img
                      src={listing.image}
                      alt={listing.alt}
                      className="listing-card-image"
                    />
                    <FourthSectionPrice price={listing.pricePerHour} />
                    <div className="listing-card-image-fade" aria-hidden />
                  </div>
                  <div className="listing-card-footer fourth-section-listing-card__footer">
                    <div className="listing-card-body">
                      <h3 className="listing-card-title">{listing.title}</h3>
                      <p className="listing-card-distance">{listing.subtitle}</p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fourth-section__listings-block fourth-section-reveal">
        <p className="fourth-section__category">By price</p>
        <div
          className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
          aria-label="Listings by price"
        >
          <div className="fourth-section__listings fourth-section__listings--row">
            {FOURTH_SECTION_BY_PRICE.map((listing) => (
              <div
                key={`fourth-price-${listing.title}`}
                className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--distance"
              >
                <article className="fourth-section-listing-card fourth-section-listing-card--distance">
                  <div className="listing-card-media fourth-section-listing-card__media">
                    <img
                      src={listing.image}
                      alt={listing.alt}
                      className="listing-card-image"
                    />
                    <FourthSectionPrice price={listing.pricePerHour} />
                    <div className="listing-card-image-fade" aria-hidden />
                  </div>
                  <div className="listing-card-footer fourth-section-listing-card__footer">
                    <div className="listing-card-body">
                      <h3 className="listing-card-title">{listing.title}</h3>
                      <p className="listing-card-distance">{listing.subtitle}</p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fourth-section__listings-block fourth-section-reveal">
        <p className="fourth-section__category">By bundle</p>
        <div
          className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
          aria-label="Listings by bundle"
        >
          <div className="fourth-section__listings fourth-section__listings--row">
            {FOURTH_SECTION_BY_BUNDLE.map((bundle) => (
              <div
                key={`fourth-bundle-${bundle.title}`}
                className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--bundle"
              >
                <div className="fourth-section-bundle">
                  <article className="fourth-section-listing-card fourth-section-listing-card--distance fourth-section-bundle__main">
                    <div className="listing-card-media fourth-section-listing-card__media">
                      <img
                        src={bundle.image}
                        alt={bundle.alt}
                        className="listing-card-image"
                      />
                      <FourthSectionPrice price={bundle.pricePerHour} />
                      <div className="listing-card-image-fade" aria-hidden />
                    </div>
                    <div className="listing-card-footer fourth-section-listing-card__footer">
                      <div className="listing-card-body">
                        <h3 className="listing-card-title">{bundle.title}</h3>
                        <p className="listing-card-distance">{bundle.subtitle}</p>
                      </div>
                    </div>
                  </article>
                  <div className="fourth-section-bundle__stack" aria-hidden>
                    {[0, 1].map((stackIndex) => (
                      <article
                        key={`${bundle.title}-stack-${stackIndex}`}
                        className={`fourth-section-bundle__mini fourth-section-bundle__mini--${stackIndex}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fourth-section__outro fourth-section-reveal">
        <div className="fourth-section__actions">
          <button
            type="button"
            className="fourth-section__btn fourth-section__btn--primary"
          >
            Host
            {upRightArrow}
          </button>
          <Link href="/book" className="fourth-section__btn">
            Book
            {upRightArrow}
          </Link>
        </div>
      </div>
    </section>
  );
});
