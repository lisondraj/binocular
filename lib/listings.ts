export type ListingHost = {
  initials: string;
  gradient: string;
};

export const LISTING_CARDS = [
  {
    title: "Warehouse",
    distanceMi: 0.8,
    pricePerHour: "$85/hr",
    rating: 4.9,
    reviewCount: 128,
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
    reviewCount: 86,
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
    reviewCount: 54,
    sqFt: 960,
    hosts: [{ initials: "DF", gradient: "135deg, #748ffc 0%, #5c7cfa 100%" }],
    image: "/images/courtyard.png",
    alt: "Garden terrace",
  },
] as const;

export const FOURTH_SECTION_BY_SPACE = [
  {
    title: "Open warehouse",
    subtitle: "Locomotion testing",
    pricePerHour: "$72",
    rating: 4.9,
    reviewCount: 112,
    hosts: [
      { initials: "MR", gradient: "135deg, #5c7cfa 0%, #364fc7 100%" },
      { initials: "KL", gradient: "135deg, #e64980 0%, #c2255c 100%" },
    ],
    image: "/images/warehouse-1.png",
    alt: "Open warehouse floor",
  },
  {
    title: "Kitchen lab",
    subtitle: "Manipulation testing",
    pricePerHour: "$48",
    rating: 4.7,
    reviewCount: 64,
    hosts: [{ initials: "JS", gradient: "135deg, #38d9a9 0%, #12b886 100%" }],
    image: "/images/kitchen.png",
    alt: "Kitchen lab",
  },
  {
    title: "Garden terrain",
    subtitle: "Mobility testing",
    pricePerHour: "$34",
    rating: 4.8,
    reviewCount: 41,
    hosts: [
      { initials: "DF", gradient: "135deg, #748ffc 0%, #5c7cfa 100%" },
      { initials: "RP", gradient: "135deg, #da77f2 0%, #9c36b5 100%" },
    ],
    image: "/images/courtyard.png",
    alt: "Garden terrain",
  },
] as const;

export const FOURTH_SECTION_BY_PROFESSION = [
  {
    title: "Robotics engineer",
    subtitle: "Locomotion & controls",
    pricePerHour: "$68",
    rating: 4.9,
    reviewCount: 94,
    hosts: [
      { initials: "MR", gradient: "135deg, #5c7cfa 0%, #364fc7 100%" },
      { initials: "KL", gradient: "135deg, #e64980 0%, #c2255c 100%" },
    ],
    image: "/images/warehouse-1.png",
    alt: "Robotics engineer workspace",
  },
  {
    title: "ML researcher",
    subtitle: "Policy learning",
    pricePerHour: "$54",
    rating: 4.8,
    reviewCount: 71,
    hosts: [{ initials: "JS", gradient: "135deg, #38d9a9 0%, #12b886 100%" }],
    image: "/images/kitchen.png",
    alt: "ML researcher lab",
  },
  {
    title: "Hardware engineer",
    subtitle: "Sensor integration",
    pricePerHour: "$62",
    rating: 4.7,
    reviewCount: 58,
    hosts: [
      { initials: "AN", gradient: "135deg, #fcc419 0%, #f59f00 100%" },
      { initials: "RP", gradient: "135deg, #da77f2 0%, #9c36b5 100%" },
    ],
    image: "/images/warehouse-1.png",
    alt: "Hardware engineer bench",
  },
  {
    title: "Computer vision engineer",
    subtitle: "Perception pipelines",
    pricePerHour: "$58",
    rating: 4.8,
    reviewCount: 63,
    hosts: [{ initials: "DF", gradient: "135deg, #748ffc 0%, #5c7cfa 100%" }],
    image: "/images/kitchen.png",
    alt: "Computer vision setup",
  },
  {
    title: "Research scientist",
    subtitle: "Benchmark experiments",
    pricePerHour: "$49",
    rating: 4.6,
    reviewCount: 44,
    hosts: [
      { initials: "AL", gradient: "135deg, #ffa94d 0%, #fd7e14 100%" },
      { initials: "JS", gradient: "135deg, #38d9a9 0%, #12b886 100%" },
    ],
    image: "/images/courtyard.png",
    alt: "Research scientist field testing",
  },
] as const;

export const FOURTH_SECTION_BY_ACTION = [
  {
    title: "Navigation",
    subtitle: "Path planning & SLAM",
    pricePerHour: "$72",
    rating: 4.9,
    reviewCount: 112,
    hosts: [
      { initials: "MR", gradient: "135deg, #5c7cfa 0%, #364fc7 100%" },
      { initials: "KL", gradient: "135deg, #e64980 0%, #c2255c 100%" },
    ],
    image: "/images/warehouse-1.png",
    alt: "Navigation testing space",
  },
  {
    title: "Grasping",
    subtitle: "Pick-and-place",
    pricePerHour: "$48",
    rating: 4.7,
    reviewCount: 86,
    hosts: [{ initials: "JS", gradient: "135deg, #38d9a9 0%, #12b886 100%" }],
    image: "/images/kitchen.png",
    alt: "Grasping and manipulation lab",
  },
  {
    title: "Teleoperation",
    subtitle: "Remote control",
    pricePerHour: "$44",
    rating: 4.6,
    reviewCount: 52,
    hosts: [
      { initials: "AN", gradient: "135deg, #fcc419 0%, #f59f00 100%" },
      { initials: "DF", gradient: "135deg, #748ffc 0%, #5c7cfa 100%" },
    ],
    image: "/images/kitchen.png",
    alt: "Teleoperation station",
  },
  {
    title: "Manipulation",
    subtitle: "Force-sensitive tasks",
    pricePerHour: "$51",
    rating: 4.8,
    reviewCount: 67,
    hosts: [{ initials: "RP", gradient: "135deg, #da77f2 0%, #9c36b5 100%" }],
    image: "/images/kitchen.png",
    alt: "Manipulation testing bench",
  },
  {
    title: "Mobility testing",
    subtitle: "Terrain traversal",
    pricePerHour: "$34",
    rating: 4.8,
    reviewCount: 41,
    hosts: [
      { initials: "DF", gradient: "135deg, #748ffc 0%, #5c7cfa 100%" },
      { initials: "AL", gradient: "135deg, #ffa94d 0%, #fd7e14 100%" },
    ],
    image: "/images/courtyard.png",
    alt: "Outdoor mobility course",
  },
  {
    title: "Object detection",
    subtitle: "Visual recognition",
    pricePerHour: "$56",
    rating: 4.7,
    reviewCount: 59,
    hosts: [{ initials: "MR", gradient: "135deg, #5c7cfa 0%, #364fc7 100%" }],
    image: "/images/warehouse-1.png",
    alt: "Object detection environment",
  },
] as const;

export const FOURTH_SECTION_BY_PRICE = [
  {
    title: "Garden terrace",
    subtitle: "Mobility testing",
    pricePerHour: "$28",
    rating: 4.8,
    reviewCount: 54,
    hosts: [{ initials: "DF", gradient: "135deg, #748ffc 0%, #5c7cfa 100%" }],
    image: "/images/courtyard.png",
    alt: "Garden terrace",
  },
  {
    title: "Garden terrain",
    subtitle: "Outdoor testing",
    pricePerHour: "$34",
    rating: 4.6,
    reviewCount: 37,
    hosts: [
      { initials: "RP", gradient: "135deg, #da77f2 0%, #9c36b5 100%" },
      { initials: "AL", gradient: "135deg, #ffa94d 0%, #fd7e14 100%" },
    ],
    image: "/images/courtyard.png",
    alt: "Garden terrain",
  },
  {
    title: "Kitchen",
    subtitle: "Manipulation testing",
    pricePerHour: "$42",
    rating: 4.7,
    reviewCount: 86,
    hosts: [
      { initials: "JS", gradient: "135deg, #38d9a9 0%, #12b886 100%" },
      { initials: "AN", gradient: "135deg, #fcc419 0%, #f59f00 100%" },
    ],
    image: "/images/kitchen.png",
    alt: "Kitchen",
  },
  {
    title: "Kitchen lab",
    subtitle: "Lab environment",
    pricePerHour: "$48",
    rating: 4.5,
    reviewCount: 29,
    hosts: [{ initials: "AN", gradient: "135deg, #fcc419 0%, #f59f00 100%" }],
    image: "/images/kitchen.png",
    alt: "Kitchen lab",
  },
  {
    title: "Open warehouse",
    subtitle: "Locomotion testing",
    pricePerHour: "$72",
    rating: 4.9,
    reviewCount: 112,
    hosts: [
      { initials: "MR", gradient: "135deg, #5c7cfa 0%, #364fc7 100%" },
      { initials: "KL", gradient: "135deg, #e64980 0%, #c2255c 100%" },
    ],
    image: "/images/warehouse-1.png",
    alt: "Open warehouse floor",
  },
] as const;

export const FOURTH_SECTION_BY_BUNDLE = [
  {
    title: "Full terrain pack",
    subtitle: "3 spaces",
    pricePerHour: "$128",
    rating: 4.9,
    reviewCount: 203,
    hosts: [
      { initials: "MR", gradient: "135deg, #5c7cfa 0%, #364fc7 100%" },
      { initials: "KL", gradient: "135deg, #e64980 0%, #c2255c 100%" },
    ],
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
    subtitle: "3 spaces",
    pricePerHour: "$112",
    rating: 4.7,
    reviewCount: 91,
    hosts: [{ initials: "JS", gradient: "135deg, #38d9a9 0%, #12b886 100%" }],
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
    subtitle: "3 spaces",
    pricePerHour: "$96",
    rating: 4.8,
    reviewCount: 118,
    hosts: [
      { initials: "DF", gradient: "135deg, #748ffc 0%, #5c7cfa 100%" },
      { initials: "RP", gradient: "135deg, #da77f2 0%, #9c36b5 100%" },
    ],
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
