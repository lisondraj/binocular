"use client";

import Link from "next/link";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { paintMain2GrainSurfaces } from "@/lib/main2-grain";
import { MOBILE_ROOT_FONT_SIZE } from "@/lib/mobile-layout";
import {
  FOURTH_SECTION_BUDGET_MAX,
  FOURTH_SECTION_BUDGET_MIN,
  FOURTH_SECTION_BY_AUDIENCE,
  FOURTH_SECTION_BY_BUNDLE,
  FOURTH_SECTION_BY_PROFESSION,
  FOURTH_SECTION_BY_ACTION,
  FOURTH_SECTION_BY_SPACE,
  LISTING_CARDS,
  type ListingHost,
} from "@/lib/listings";

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

function formatListingPriceUsd(price: string) {
  return `${price.replace(/\/hr$/, "").trim()} USD`;
}

function FourthSectionPrice({ price }: { price: string }) {
  const amount = price.replace(/\/hr$/, "");

  return (
    <span className="fourth-section-listing-card__price">
      <span className="fourth-section-listing-card__price-amount">{amount}</span>
      <span className="fourth-section-listing-card__price-currency">USD</span>
    </span>
  );
}

function FourthSectionListingHosts({
  hosts,
}: {
  hosts: readonly ListingHost[];
}) {
  return (
    <div
      className="fourth-section-listing-card__hosts listing-card-hosts"
      aria-label="Hosts"
    >
      {hosts.map((host, hostIndex) => (
        <span
          key={host.initials}
          className={`listing-card-avatar${
            hosts.length > 1
              ? hostIndex === 0
                ? " listing-card-avatar--back"
                : " listing-card-avatar--front"
              : ""
          }`}
          style={{
            background: `linear-gradient(${host.gradient})`,
          }}
        >
          {host.initials}
        </span>
      ))}
    </div>
  );
}

function FourthSectionListingMeta({
  title,
  subtitle,
  price,
  rating,
  reviewCount,
  main2Listings = false,
  className = "",
}: {
  title: string;
  subtitle: string;
  price: string;
  rating?: number;
  reviewCount?: number;
  main2Listings?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`fourth-section-listing-card__caption${className ? ` ${className}` : ""}`}
    >
      <div
        className={`fourth-section-listing-card__meta${
          main2Listings && rating != null
            ? " fourth-section-listing-card__meta--with-rating"
            : ""
        }`}
      >
        <div className="listing-card-body">
          <h3 className="listing-card-title">{title}</h3>
          <p className="listing-card-distance">{subtitle}</p>
        </div>
        {main2Listings && rating != null ? (
          <div className="fourth-section-listing-card__aside">
            <span
              className="fourth-section-listing-card__rating listing-card-rating"
              aria-label={`Rating ${rating} from ${reviewCount ?? 0} reviews`}
            >
              {rating}
              {ratingStarIcon}
              {reviewCount != null ? (
                <span className="fourth-section-listing-card__review-count">
                  ({reviewCount})
                </span>
              ) : null}
            </span>
            <span className="fourth-section-listing-card__price-usd">
              {formatListingPriceUsd(price)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FourthSectionListingCard({
  className,
  image,
  alt,
  price,
  title,
  subtitle,
  hosts,
  rating,
  reviewCount,
  main2Listings = false,
  bundleImageOnly = false,
}: {
  className: string;
  image: string;
  alt: string;
  price: string;
  title: string;
  subtitle: string;
  hosts?: readonly ListingHost[];
  rating?: number;
  reviewCount?: number;
  main2Listings?: boolean;
  /** /main2 bundle — image + hosts only; meta renders outside the stack deck. */
  bundleImageOnly?: boolean;
}) {
  const imageStage = (
    <div className="fourth-section-listing-card__stage">
      <div className="listing-card-media fourth-section-listing-card__media">
        <img src={image} alt={alt} className="listing-card-image" />
        {main2Listings && hosts?.length ? (
          <FourthSectionListingHosts hosts={hosts} />
        ) : null}
        {!main2Listings ? <FourthSectionPrice price={price} /> : null}
        {!main2Listings ? (
          <FourthSectionListingMeta
            title={title}
            subtitle={subtitle}
            price={price}
            rating={rating}
            reviewCount={reviewCount}
            main2Listings={main2Listings}
          />
        ) : null}
      </div>
    </div>
  );

  if (main2Listings && bundleImageOnly) {
    return (
      <article className={`fourth-section-listing-card ${className}`}>
        {imageStage}
      </article>
    );
  }

  if (main2Listings) {
    return (
      <article className={`fourth-section-listing-card ${className}`}>
        {imageStage}
        <FourthSectionListingMeta
          title={title}
          subtitle={subtitle}
          price={price}
          rating={rating}
          reviewCount={reviewCount}
          main2Listings={main2Listings}
        />
      </article>
    );
  }

  return (
    <article className={`fourth-section-listing-card ${className}`}>
      {imageStage}
    </article>
  );
}

const MAIN2_PROFESSION_CAROUSEL_ITEMS = [
  "doctor",
  "chef",
  "picker",
  "housekeeper",
  "barista",
] as const;

const MAIN2_AUDIENCE_CAROUSEL_ITEMS = [
  "elderly",
  "caregivers",
  "families",
  "busy parents",
  "mobility needs",
] as const;

function grainCarouselOpacity(distance: number) {
  const magnitude = Math.abs(distance);
  if (magnitude === 0) return 1;
  if (magnitude === 1) return 0.52;
  if (magnitude === 2) return 0.22;
  return 0;
}

function ListingGrainCarousel({
  prefix,
  items,
  slotKey,
}: {
  prefix: string;
  items: readonly string[];
  slotKey: string;
}) {
  const itemCount = items.length;
  const loopStart = itemCount;
  const loopEnd = itemCount * 2;
  const extendedItems = [...items, ...items, ...items];

  const [position, setPosition] = useState<number>(loopStart);
  const [instantReset, setInstantReset] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeItem = items[position % itemCount];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPosition((current) => current + 1);
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (position !== loopEnd) return;

    const track = trackRef.current;
    if (!track) return;

    const onEnd = (event: TransitionEvent) => {
      if (event.target !== track || event.propertyName !== "transform") return;
      setInstantReset(true);
      setPosition(loopStart);
    };

    track.addEventListener("transitionend", onEnd);
    return () => track.removeEventListener("transitionend", onEnd);
  }, [position, loopEnd, loopStart]);

  useEffect(() => {
    if (!instantReset || position !== loopStart) return;

    const frame = window.requestAnimationFrame(() => {
      setInstantReset(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [instantReset, position, loopStart]);

  return (
    <p
      className="fourth-section__listing-grain-box__carousel"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${prefix} ${activeItem}`}
    >
      <span className="fourth-section__listing-grain-box__carousel-prefix">{prefix}</span>
      <span className="fourth-section__listing-grain-box__carousel-window">
        <span
          ref={trackRef}
          className={`fourth-section__listing-grain-box__carousel-track${
            instantReset ? " is-instant" : ""
          }`}
          style={{
            transform: `translate3d(0, calc((var(--profession-carousel-radius) - ${position}) * var(--profession-carousel-line)), 0)`,
          }}
        >
          {extendedItems.map((item, itemIndex) => {
            const distance = itemIndex - position;
            const opacity = grainCarouselOpacity(distance);

            return (
              <span
                key={`${slotKey}-slot-${itemIndex}`}
                className="fourth-section__listing-grain-box__carousel-item"
                style={{ opacity }}
                aria-hidden={distance !== 0}
              >
                {item}
              </span>
            );
          })}
        </span>
      </span>
    </p>
  );
}

function ListingCategoryGrainBox({
  children,
  variant,
  carousel,
}: {
  children: ReactNode;
  variant: "profession" | "audience";
  carousel?: ReactNode;
}) {
  return (
    <div
      className={`fourth-section__listing-slot-box fourth-section__listing-grain-box fourth-section__listing-grain-box--${variant} main2-grain-box`}
    >
      <div className="main2-grain-surface main2-hero-box__grain" aria-hidden />
      <div className="fourth-section__listing-grain-box__category-content">
        <div className="fourth-section__listing-grain-box__carousel-stage">{carousel}</div>
        <div className="fourth-section__listing-grain-box__listings">{children}</div>
      </div>
    </div>
  );
}

function ListingWhiteBox({
  children,
  fullHeight = false,
}: {
  children?: ReactNode;
  fullHeight?: boolean;
}) {
  return (
    <div
      className={`fourth-section__listing-slot-box fourth-section__listing-white-box${
        fullHeight ? " fourth-section__listing-white-box--full-height" : ""
      }`}
    >
      {fullHeight ? (
        <div className="fourth-section__listing-white-box__content">{children}</div>
      ) : (
        children
      )}
    </div>
  );
}

function ListingWhiteBoxTagline({
  variant = "distance",
}: {
  variant?: "distance" | "action";
}) {
  return (
    <div className="fourth-section__white-box-intro-content hero-intro-content">
      {variant === "action" ? (
        <p className="hero-description fourth-section__distance-intro">
          <span className="hero-description__line">Find.</span>
          <span className="hero-description__line">Test.</span>
          <span className="hero-description__line">Deploy.</span>
        </p>
      ) : (
        <p className="hero-description fourth-section__distance-intro">
          <span className="hero-description__line">We make the physical</span>
          <span className="hero-description__line">world searchable.</span>
        </p>
      )}
    </div>
  );
}

type FourthSectionProps = {
  scrollReveal?: boolean;
  className?: string;
  /** /main2 — continue hero grain + dark gradient into browse listings. */
  main2Grain?: boolean;
  /** /main2 — hosts on image, rating beside caption text. */
  main2Listings?: boolean;
};

export const FourthSection = forwardRef(function FourthSection(
  {
    scrollReveal = false,
    className = "",
    main2Grain = false,
    main2Listings = false,
  }: FourthSectionProps,
  ref: Ref<HTMLElement>,
) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [budgetMax, setBudgetMax] = useState(200);
  const sectionRef = useRef<HTMLElement | null>(null);

  const budgetFillPct =
    ((budgetMax - FOURTH_SECTION_BUDGET_MIN) /
      (FOURTH_SECTION_BUDGET_MAX - FOURTH_SECTION_BUDGET_MIN)) *
    100;

  const listingRowReveal = scrollReveal && main2Listings ? "fourth-section-reveal" : "";
  const blockReveal = scrollReveal && !main2Listings ? "fourth-section-reveal" : "";
  const spaceReveal = scrollReveal ? "fourth-section-reveal" : "";

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
        main2Listings
          ? { threshold: 0.45, rootMargin: "0px 0px -22% 0px" }
          : { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
      );

      nodes.forEach((node) => observer!.observe(node));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [scrollReveal, main2Listings]);

  useEffect(() => {
    if (!main2Listings) return;
    paintMain2GrainSurfaces();
  }, [main2Listings]);

  return (
    <section
      ref={setSectionRef}
      className={`fourth-section${className ? ` ${className}` : ""}${
        main2Grain ? " fourth-section--main2-grain main2-grain-box" : ""
      }`}
      style={{ fontSize: MOBILE_ROOT_FONT_SIZE }}
    >
      {main2Grain ? (
        <div
          className="main2-grain-surface fourth-section__grain"
          aria-hidden
        />
      ) : null}
      <div className="fourth-section__inner">
      <div
        className={`fourth-section__listings-anchor${blockReveal ? ` ${blockReveal}` : ""}`}
      >
        {!main2Listings ? (
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
        ) : null}

        <div className="fourth-section__listings-block">
          {main2Listings ? (
            <ListingWhiteBox>
              <ListingWhiteBoxTagline />
            </ListingWhiteBox>
          ) : null}
          <div
            className={
              listingRowReveal
                ? `fourth-section__listing-row-reveal ${listingRowReveal}`
                : "fourth-section__listing-row-reveal"
            }
          >
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
                    <FourthSectionListingCard
                      className="fourth-section-listing-card--distance"
                      image={listing.image}
                      alt={listing.alt}
                      price={listing.pricePerHour}
                      title={listing.title}
                      subtitle={`${listing.distanceMi} mi away`}
                      hosts={listing.hosts}
                      rating={listing.rating}
                      reviewCount={listing.reviewCount}
                      main2Listings={main2Listings}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          id="main2-tab-spaces"
          className={`fourth-section__listings-block main2-tab-target${
            spaceReveal ? ` ${spaceReveal}` : ""
          }`}
        >
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
                  <FourthSectionListingCard
                    className="fourth-section-listing-card--space"
                    image={listing.image}
                    alt={listing.alt}
                    price={listing.pricePerHour}
                    title={listing.title}
                    subtitle={listing.subtitle}
                    hosts={listing.hosts}
                    rating={listing.rating}
                    reviewCount={listing.reviewCount}
                    main2Listings={main2Listings}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          id="main2-tab-people"
          className={`fourth-section__listings-block main2-tab-target${
            blockReveal ? ` ${blockReveal}` : ""
          }`}
        >
          {main2Listings ? (
            <ListingCategoryGrainBox
              variant="profession"
              carousel={
                <ListingGrainCarousel
                  prefix="Book a"
                  items={MAIN2_PROFESSION_CAROUSEL_ITEMS}
                  slotKey="profession"
                />
              }
            >
              <div
                className={
                  listingRowReveal
                    ? `fourth-section__listing-row-reveal ${listingRowReveal}`
                    : "fourth-section__listing-row-reveal"
                }
              >
                <p className="fourth-section__category fourth-section__category--in-grain">
                  By profession
                </p>
                <div
                  className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
                  aria-label="Listings by profession"
                >
                  <div className="fourth-section__listings fourth-section__listings--row">
                    {FOURTH_SECTION_BY_PROFESSION.map((listing) => (
                      <div
                        key={`fourth-profession-${listing.title}`}
                        className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--space"
                      >
                        <FourthSectionListingCard
                          className="fourth-section-listing-card--space"
                          image={listing.image}
                          alt={listing.alt}
                          price={listing.pricePerHour}
                          title={listing.title}
                          subtitle={listing.subtitle}
                          hosts={listing.hosts}
                          rating={listing.rating}
                          reviewCount={listing.reviewCount}
                          main2Listings={main2Listings}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ListingCategoryGrainBox>
          ) : null}
          {!main2Listings ? (
            <>
              <p className="fourth-section__category">By profession</p>
              <div
                className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
                aria-label="Listings by profession"
              >
                <div className="fourth-section__listings fourth-section__listings--row">
                  {FOURTH_SECTION_BY_PROFESSION.map((listing) => (
                    <div
                      key={`fourth-profession-${listing.title}`}
                      className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--space"
                    >
                      <FourthSectionListingCard
                        className="fourth-section-listing-card--space"
                        image={listing.image}
                        alt={listing.alt}
                        price={listing.pricePerHour}
                        title={listing.title}
                        subtitle={listing.subtitle}
                        hosts={listing.hosts}
                        rating={listing.rating}
                        reviewCount={listing.reviewCount}
                        main2Listings={main2Listings}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div
        className={`fourth-section__listings-block${
          blockReveal ? ` ${blockReveal}` : ""
        }`}
      >
        {main2Listings ? (
          <ListingWhiteBox fullHeight>
            <ListingWhiteBoxTagline variant="action" />
            <div className="fourth-section__listing-white-box__listings">
              <div className="fourth-section__listing-white-box__listings-inner">
                <div
                  className={
                    listingRowReveal
                      ? `fourth-section__listing-row-reveal ${listingRowReveal}`
                      : "fourth-section__listing-row-reveal"
                  }
                >
                  <p className="fourth-section__category">By action</p>
                  <div
                    className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
                    aria-label="Listings by action"
                  >
                    <div className="fourth-section__listings fourth-section__listings--row">
                      {FOURTH_SECTION_BY_ACTION.map((listing) => (
                        <div
                          key={`fourth-action-${listing.title}`}
                          className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--space"
                        >
                          <FourthSectionListingCard
                            className="fourth-section-listing-card--space"
                            image={listing.image}
                            alt={listing.alt}
                            price={listing.pricePerHour}
                            title={listing.title}
                            subtitle={listing.subtitle}
                            hosts={listing.hosts}
                            rating={listing.rating}
                            reviewCount={listing.reviewCount}
                            main2Listings={main2Listings}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ListingWhiteBox>
        ) : (
          <>
            <p className="fourth-section__category">By action</p>
            <div
              className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
              aria-label="Listings by action"
            >
              <div className="fourth-section__listings fourth-section__listings--row">
                {FOURTH_SECTION_BY_ACTION.map((listing) => (
                  <div
                    key={`fourth-action-${listing.title}`}
                    className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--space"
                  >
                    <FourthSectionListingCard
                      className="fourth-section-listing-card--space"
                      image={listing.image}
                      alt={listing.alt}
                      price={listing.pricePerHour}
                      title={listing.title}
                      subtitle={listing.subtitle}
                      hosts={listing.hosts}
                      rating={listing.rating}
                      reviewCount={listing.reviewCount}
                      main2Listings={main2Listings}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {!main2Listings ? (
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
                  {main2Listings ? (
                    <>
                      <div className="fourth-section-bundle__deck">
                        <FourthSectionListingCard
                          className="fourth-section-listing-card--distance fourth-section-bundle__main"
                          image={bundle.image}
                          alt={bundle.alt}
                          price={bundle.pricePerHour}
                          title={bundle.title}
                          subtitle={bundle.subtitle}
                          hosts={bundle.hosts}
                          rating={bundle.rating}
                          reviewCount={bundle.reviewCount}
                          main2Listings={main2Listings}
                          bundleImageOnly
                        />
                        <div
                          className="fourth-section-bundle__stack"
                          aria-hidden
                        >
                          {[0, 1].map((stackIndex) => {
                            const space = bundle.spaces[2 - stackIndex];
                            return (
                              <article
                                key={`${bundle.title}-stack-${stackIndex}`}
                                className={`fourth-section-bundle__mini fourth-section-bundle__mini--${stackIndex}`}
                              >
                                <img
                                  src={space.image}
                                  alt=""
                                  className="fourth-section-bundle__mini-image"
                                />
                              </article>
                            );
                          })}
                        </div>
                      </div>
                      <FourthSectionListingMeta
                        className="fourth-section-bundle__meta"
                        title={bundle.title}
                        subtitle={bundle.subtitle}
                        price={bundle.pricePerHour}
                        rating={bundle.rating}
                        reviewCount={bundle.reviewCount}
                        main2Listings={main2Listings}
                      />
                    </>
                  ) : (
                    <>
                      <FourthSectionListingCard
                        className="fourth-section-listing-card--distance fourth-section-bundle__main"
                        image={bundle.image}
                        alt={bundle.alt}
                        price={bundle.pricePerHour}
                        title={bundle.title}
                        subtitle={bundle.subtitle}
                        hosts={bundle.hosts}
                        rating={bundle.rating}
                        reviewCount={bundle.reviewCount}
                        main2Listings={main2Listings}
                      />
                      <div className="fourth-section-bundle__stack" aria-hidden>
                        {[0, 1].map((stackIndex) => {
                          const space = bundle.spaces[2 - stackIndex];
                          return (
                            <article
                              key={`${bundle.title}-stack-${stackIndex}`}
                              className={`fourth-section-bundle__mini fourth-section-bundle__mini--${stackIndex}`}
                            >
                              <img
                                src={space.image}
                                alt=""
                                className="fourth-section-bundle__mini-image"
                              />
                            </article>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      ) : null}

      <div
        id="main2-tab-audience"
        className={`fourth-section__listings-block main2-tab-target${
          main2Listings ? " fourth-section__listings-block--audience" : ""
        }${blockReveal ? ` ${blockReveal}` : ""}`}
      >
        {main2Listings ? (
          <ListingCategoryGrainBox
            variant="audience"
            carousel={
              <ListingGrainCarousel
                prefix="For"
                items={MAIN2_AUDIENCE_CAROUSEL_ITEMS}
                slotKey="audience"
              />
            }
          >
            <div
              className={
                listingRowReveal
                  ? `fourth-section__listing-row-reveal ${listingRowReveal}`
                  : "fourth-section__listing-row-reveal"
              }
            >
              <p className="fourth-section__category fourth-section__category--in-grain">
                By audience
              </p>
              <div
                className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
                aria-label="Listings by audiences"
              >
                <div className="fourth-section__listings fourth-section__listings--row">
                  {FOURTH_SECTION_BY_AUDIENCE.map((listing) => (
                    <div
                      key={`fourth-audience-${listing.title}`}
                      className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--space"
                    >
                      <FourthSectionListingCard
                        className="fourth-section-listing-card--space"
                        image={listing.image}
                        alt={listing.alt}
                        price={listing.pricePerHour}
                        title={listing.title}
                        subtitle={listing.subtitle}
                        hosts={listing.hosts}
                        rating={listing.rating}
                        reviewCount={listing.reviewCount}
                        main2Listings={main2Listings}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ListingCategoryGrainBox>
        ) : null}
        {!main2Listings ? (
          <>
            <p className="fourth-section__category">By audiences</p>
            <div
              className="fourth-section__listings-scroll fourth-section__listings-scroll--row"
              aria-label="Listings by audiences"
            >
              <div className="fourth-section__listings fourth-section__listings--row">
                {FOURTH_SECTION_BY_AUDIENCE.map((listing) => (
                  <div
                    key={`fourth-audience-${listing.title}`}
                    className="fourth-section-listing-card-wrap fourth-section-listing-card-wrap--space"
                  >
                    <FourthSectionListingCard
                      className="fourth-section-listing-card--space"
                      image={listing.image}
                      alt={listing.alt}
                      price={listing.pricePerHour}
                      title={listing.title}
                      subtitle={listing.subtitle}
                      hosts={listing.hosts}
                      rating={listing.rating}
                      reviewCount={listing.reviewCount}
                      main2Listings={main2Listings}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="fourth-section__outro fourth-section-reveal">
        <div className="fourth-section__actions">
          <Link href="/book" className="fourth-section__btn">
            Book
            {upRightArrow}
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
});
