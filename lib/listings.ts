export const LISTING_CARDS = [
  {
    title: "Warehouse loft",
    distanceMi: 0.8,
    pricePerHour: "$85/hr",
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
    pricePerHour: "$42/hr",
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
    pricePerHour: "$28/hr",
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

export const FOURTH_SECTION_BY_SPACE = [
  {
    title: "Open warehouse",
    subtitle: "Locomotion testing",
    pricePerHour: "$72",
    image: "/images/warehouse-1.png",
    alt: "Open warehouse floor",
  },
  {
    title: "Kitchen lab",
    subtitle: "Manipulation testing",
    pricePerHour: "$48",
    image: "/images/kitchen.png",
    alt: "Kitchen lab",
  },
  {
    title: "Garden terrain",
    subtitle: "Mobility testing",
    pricePerHour: "$34",
    image: "/images/courtyard.png",
    alt: "Garden terrain",
  },
] as const;

export const FOURTH_SECTION_BY_PRICE = [
  {
    title: "Garden terrace",
    subtitle: "Mobility testing",
    pricePerHour: "$28",
    image: "/images/courtyard.png",
    alt: "Garden terrace",
  },
  {
    title: "Garden terrain",
    subtitle: "Outdoor testing",
    pricePerHour: "$34",
    image: "/images/courtyard.png",
    alt: "Garden terrain",
  },
  {
    title: "Kitchen",
    subtitle: "Manipulation testing",
    pricePerHour: "$42",
    image: "/images/kitchen.png",
    alt: "Kitchen",
  },
  {
    title: "Kitchen lab",
    subtitle: "Lab environment",
    pricePerHour: "$48",
    image: "/images/kitchen.png",
    alt: "Kitchen lab",
  },
  {
    title: "Open warehouse",
    subtitle: "Locomotion testing",
    pricePerHour: "$72",
    image: "/images/warehouse-1.png",
    alt: "Open warehouse floor",
  },
] as const;

export const FOURTH_SECTION_BY_BUNDLE = [
  {
    title: "Full terrain pack",
    subtitle: "3 spaces bundled",
    pricePerHour: "$128",
    image: "/images/warehouse-1.png",
    alt: "Full terrain pack bundle",
    spaces: [
      {
        title: "Warehouse loft",
        pricePerHour: "$85",
        image: "/images/warehouse-1.png",
        alt: "Warehouse loft",
      },
      {
        title: "Kitchen",
        pricePerHour: "$42",
        image: "/images/kitchen.png",
        alt: "Kitchen",
      },
      {
        title: "Garden terrace",
        pricePerHour: "$28",
        image: "/images/courtyard.png",
        alt: "Garden terrace",
      },
    ],
  },
  {
    title: "Indoor lab loop",
    subtitle: "3 spaces bundled",
    pricePerHour: "$112",
    image: "/images/kitchen.png",
    alt: "Indoor lab loop bundle",
    spaces: [
      {
        title: "Kitchen lab",
        pricePerHour: "$48",
        image: "/images/kitchen.png",
        alt: "Kitchen lab",
      },
      {
        title: "Open warehouse",
        pricePerHour: "$72",
        image: "/images/warehouse-1.png",
        alt: "Open warehouse",
      },
      {
        title: "Kitchen",
        pricePerHour: "$42",
        image: "/images/kitchen.png",
        alt: "Kitchen",
      },
    ],
  },
  {
    title: "Outdoor mobility set",
    subtitle: "3 spaces bundled",
    pricePerHour: "$96",
    image: "/images/courtyard.png",
    alt: "Outdoor mobility set bundle",
    spaces: [
      {
        title: "Garden terrain",
        pricePerHour: "$34",
        image: "/images/courtyard.png",
        alt: "Garden terrain",
      },
      {
        title: "Warehouse loft",
        pricePerHour: "$85",
        image: "/images/warehouse-1.png",
        alt: "Warehouse loft",
      },
      {
        title: "Garden terrace",
        pricePerHour: "$28",
        image: "/images/courtyard.png",
        alt: "Garden terrace",
      },
    ],
  },
] as const;

export const FOURTH_SECTION_BUDGET_MIN = 50;
export const FOURTH_SECTION_BUDGET_MAX = 500;
