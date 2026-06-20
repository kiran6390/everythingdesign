// Mumbai Now — seed data for "what's happening in Mumbai"
// v1 uses curated mock data. Next step: feed from Supabase + live sources.

export type TimeBucket = "now" | "tonight" | "weekend";

export type Happening = {
  id: string;
  title: string;
  category: string; // see CATEGORIES
  neighborhood: string; // see NEIGHBORHOODS
  venue: string;
  address: string; // used to open Google Maps
  when: string; // human readable, e.g. "Tonight · 9 PM"
  timeBucket: TimeBucket;
  price: string; // "Free", "₹500", ...
  emoji: string;
  color: string; // accent color from the palette
  hype: number; // people going / interested
  vibe: string; // Chill | Loud | Artsy | Foodie | Outdoorsy
  host: string;
  description: string;
  tags: string[];
  mine?: boolean; // true if the signed-in user created it
};

export type Person = {
  id: string;
  name: string;
  initial: string;
  color: string;
};

import { C } from "@/constants/colors";

export const NEIGHBORHOODS = [
  "All",
  "Bandra",
  "Chembur",
  "Lower Parel",
  "Andheri",
  "Colaba",
  "Juhu",
  "Powai",
  "Fort",
  "Versova",
  "BKC",
];

export const CATEGORIES = [
  "All",
  "Nightlife",
  "Food",
  "Music",
  "Art",
  "Markets",
  "Outdoors",
  "Free",
];

export const TIME_FILTERS: { key: TimeBucket; label: string }[] = [
  { key: "now", label: "Now" },
  { key: "tonight", label: "Tonight" },
  { key: "weekend", label: "Weekend" },
];

export const HAPPENINGS: Happening[] = [
  {
    id: "1",
    title: "Rooftop Sundowner & House DJ",
    category: "Nightlife",
    neighborhood: "Bandra",
    venue: "Bay View Rooftop",
    address: "Bay View Rooftop, Bandra West, Mumbai",
    when: "Tonight · 7 PM",
    timeBucket: "tonight",
    price: "₹800",
    emoji: "🌆",
    color: C.accent,
    hype: 312,
    vibe: "Chill",
    host: "Bay View",
    description:
      "Golden-hour views over the bay with a resident house DJ, craft cocktails and small plates. Gets packed after 8 — come early for the sunset seats.",
    tags: ["Rooftop", "DJ", "Cocktails", "Sunset"],
  },
  {
    id: "2",
    title: "Indie Gig: The Local Train + opener",
    category: "Music",
    neighborhood: "Lower Parel",
    venue: "antiSOCIAL",
    address: "antiSOCIAL, Lower Parel, Mumbai",
    when: "Tonight · 9 PM",
    timeBucket: "tonight",
    price: "₹600",
    emoji: "🎸",
    color: C.pink,
    hype: 540,
    vibe: "Loud",
    host: "antiSOCIAL",
    description:
      "One of the city's best loved indie acts live, with a fresh opener from the Mumbai underground. Standing room, loud, sweaty, brilliant.",
    tags: ["Live Music", "Indie", "Standing"],
  },
  {
    id: "3",
    title: "Bandra Street Food Crawl",
    category: "Food",
    neighborhood: "Bandra",
    venue: "Carter Road → Pali Naka",
    address: "Carter Road, Bandra West, Mumbai",
    when: "Right now",
    timeBucket: "now",
    price: "₹500",
    emoji: "🌯",
    color: C.orange,
    hype: 128,
    vibe: "Foodie",
    host: "Mumbai Foodies",
    description:
      "Hop between the best rolls, kebabs and dessert carts from Carter Road to Pali Naka. A loose, walk-up crawl — join the group or freestyle it.",
    tags: ["Street Food", "Walk", "Cheap Eats"],
  },
  {
    id: "4",
    title: "Sunday Art Bazaar",
    category: "Markets",
    neighborhood: "Colaba",
    venue: "Kala Ghoda",
    address: "Kala Ghoda, Fort, Mumbai",
    when: "Sat–Sun · 11 AM",
    timeBucket: "weekend",
    price: "Free",
    emoji: "🎨",
    color: C.purple,
    hype: 210,
    vibe: "Artsy",
    host: "Kala Ghoda Collective",
    description:
      "Independent artists, zines, prints, ceramics and live sketching across the Kala Ghoda lanes. Great for a slow weekend wander.",
    tags: ["Art", "Shopping", "Free", "Weekend"],
  },
  {
    id: "5",
    title: "Marine Drive Night Cycle",
    category: "Outdoors",
    neighborhood: "Fort",
    venue: "Marine Drive Promenade",
    address: "Marine Drive, Mumbai",
    when: "Tonight · 11 PM",
    timeBucket: "tonight",
    price: "Free",
    emoji: "🚲",
    color: C.teal,
    hype: 86,
    vibe: "Outdoorsy",
    host: "Mumbai Night Riders",
    description:
      "Late-night group cycle along an empty Marine Drive and down to the Gateway. Bring your own ride. Cool breeze, zero traffic, great crew.",
    tags: ["Cycling", "Free", "Late Night"],
  },
  {
    id: "6",
    title: "Comedy Open Mic",
    category: "Nightlife",
    neighborhood: "Andheri",
    venue: "The Habitat",
    address: "The Habitat, Andheri West, Mumbai",
    when: "Tonight · 8 PM",
    timeBucket: "tonight",
    price: "₹300",
    emoji: "🎤",
    color: C.accent,
    hype: 174,
    vibe: "Chill",
    host: "The Habitat",
    description:
      "Mumbai's legendary open mic — new comics, working pros testing material, and the odd surprise headliner. Cheap, fun, unpredictable.",
    tags: ["Comedy", "Open Mic", "Cheap"],
  },
  {
    id: "7",
    title: "Versova Beach Cleanup + Chai",
    category: "Outdoors",
    neighborhood: "Versova",
    venue: "Versova Beach",
    address: "Versova Beach, Andheri West, Mumbai",
    when: "Sat · 7 AM",
    timeBucket: "weekend",
    price: "Free",
    emoji: "🏖️",
    color: C.teal,
    hype: 64,
    vibe: "Outdoorsy",
    host: "Versova Beach Warriors",
    description:
      "Early-morning beach cleanup followed by cutting chai and good company. Do something good, meet good people, beat the heat.",
    tags: ["Volunteering", "Beach", "Free", "Morning"],
  },
  {
    id: "8",
    title: "Powai Lakeside Live Jazz",
    category: "Music",
    neighborhood: "Powai",
    venue: "The Hive",
    address: "The Hive, Powai, Mumbai",
    when: "Tonight · 8:30 PM",
    timeBucket: "tonight",
    price: "₹700",
    emoji: "🎷",
    color: C.purple,
    hype: 98,
    vibe: "Chill",
    host: "The Hive",
    description:
      "Intimate jazz quartet by the lake. Low lights, good wine, no phones-up crowd. Limited seating — reserve ahead.",
    tags: ["Jazz", "Live Music", "Date Night"],
  },
  {
    id: "9",
    title: "BKC Food Truck Park",
    category: "Food",
    neighborhood: "BKC",
    venue: "Jio Garden Grounds",
    address: "Jio Garden, BKC, Mumbai",
    when: "Right now",
    timeBucket: "now",
    price: "₹400",
    emoji: "🚚",
    color: C.orange,
    hype: 256,
    vibe: "Foodie",
    host: "Mumbai Eats",
    description:
      "30+ food trucks, live music and lawn seating. Korean, tacos, Bombay-Chinese, desserts — graze your way through. Family and pet friendly.",
    tags: ["Food Trucks", "Outdoor", "Family"],
  },
  {
    id: "10",
    title: "Gallery Night: New Mumbai Voices",
    category: "Art",
    neighborhood: "Colaba",
    venue: "Jhaveri Contemporary",
    address: "Jhaveri Contemporary, Colaba, Mumbai",
    when: "Tonight · 6 PM",
    timeBucket: "tonight",
    price: "Free",
    emoji: "🖼️",
    color: C.pink,
    hype: 142,
    vibe: "Artsy",
    host: "Jhaveri Contemporary",
    description:
      "Opening night for a group show of emerging Mumbai artists. Free entry, wine, and the artists are usually around to talk through the work.",
    tags: ["Art", "Opening", "Free"],
  },
  {
    id: "11",
    title: "Sunrise Yoga at Juhu Beach",
    category: "Outdoors",
    neighborhood: "Juhu",
    venue: "Juhu Beach",
    address: "Juhu Beach, Mumbai",
    when: "Sun · 6:15 AM",
    timeBucket: "weekend",
    price: "₹200",
    emoji: "🧘",
    color: C.teal,
    hype: 73,
    vibe: "Chill",
    host: "Beach Flow Collective",
    description:
      "Slow flow on the sand as the sun comes up, finishing with breathwork. All levels welcome. Mats provided.",
    tags: ["Yoga", "Beach", "Morning"],
  },
  {
    id: "12",
    title: "Late Night Techno: Basement Session",
    category: "Nightlife",
    neighborhood: "Lower Parel",
    venue: "Kitty Su",
    address: "Kitty Su, Lower Parel, Mumbai",
    when: "Tonight · 11 PM",
    timeBucket: "tonight",
    price: "₹1200",
    emoji: "🔊",
    color: C.accent,
    hype: 430,
    vibe: "Loud",
    host: "Kitty Su",
    description:
      "International techno headliner with local support till late. Dark room, big sound system. Doors at 11, peaks around 2.",
    tags: ["Techno", "Club", "Late Night"],
  },
];

export const PEOPLE: Person[] = [
  { id: "p1", name: "Aarav", initial: "A", color: C.purple },
  { id: "p2", name: "Diya", initial: "D", color: C.orange },
  { id: "p3", name: "Kabir", initial: "K", color: C.pink },
  { id: "p4", name: "Sara", initial: "S", color: C.teal },
  { id: "p5", name: "Riya", initial: "R", color: C.accent },
];
