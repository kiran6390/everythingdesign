// GetIn — seed data for "what's happening in Mumbai".
// Real Mumbai venues + neighbourhoods; events are illustrative/recurring.
// Images are licence-free stock (Unsplash), not the actual venues' photos.
import { C } from "@/constants/colors";

export type TimeBucket = "now" | "tonight" | "weekend";

export type Happening = {
  id: string;
  title: string;
  category: string;
  neighborhood: string;
  venue: string;
  address: string;
  when: string;
  timeBucket: TimeBucket;
  price: string;
  emoji: string;
  color: string;
  hype: number;
  vibe: string;
  host: string;
  description: string;
  tags: string[];
  image?: string;
  mine?: boolean;
};

export type Person = { id: string; name: string; initial: string; color: string };

export const NEIGHBORHOODS = [
  "All",
  "Bandra",
  "Khar",
  "Lower Parel",
  "Worli",
  "Andheri",
  "Juhu",
  "Colaba",
  "Fort",
  "Girgaon",
  "Versova",
  "BKC",
  "Powai",
  "Chembur",
];

export const CATEGORIES = ["All", "Nightlife", "Food", "Music", "Art", "Markets", "Outdoors", "Free"];

export const TIME_FILTERS: { key: TimeBucket; label: string }[] = [
  { key: "now", label: "Now" },
  { key: "tonight", label: "Tonight" },
  { key: "weekend", label: "Weekend" },
];

const U = (id: string) => `https://images.unsplash.com/${id}?w=800&q=70&auto=format&fit=crop`;
const IMG = {
  rooftop: U("photo-1517457373958-b7bdd4587205"),
  club: U("photo-1545128485-c400e7702796"),
  nightlife: U("photo-1566737236500-c8ac43014a67"),
  livemusic: U("photo-1470229722913-7c0e2dbbafd3"),
  jazz: U("photo-1511192336575-5a79af67a629"),
  comedy: U("photo-1585699324551-f6c309eedeca"),
  food: U("photo-1504674900247-0877df9cc836"),
  foodtruck: U("photo-1565123409695-7b5ef63a2efb"),
  cafe: U("photo-1554118811-1e0d58224f24"),
  art: U("photo-1531058020387-3be344556be6"),
  cycling: U("photo-1485965120184-e220f721d03e"),
  beach: U("photo-1507525428034-b723cf961d3e"),
  yoga: U("photo-1599447421416-3414500d18a5"),
};

export const HAPPENINGS: Happening[] = [
  {
    id: "1", title: "Sundowner on the 34th floor", category: "Nightlife", neighborhood: "Worli",
    venue: "AER, Four Seasons", address: "AER, Four Seasons Hotel, Worli, Mumbai", when: "Tonight · 6 PM",
    timeBucket: "tonight", price: "₹2000", emoji: "🌆", color: C.accent, hype: 420, vibe: "Chill", host: "AER",
    description: "Mumbai's highest rooftop — Arabian Sea views, art-deco interiors and a retractable roof. Come for golden hour, stay for the resident DJ.",
    tags: ["Rooftop", "Cocktails", "Sunset", "Views"], image: IMG.rooftop,
  },
  {
    id: "2", title: "Techno & deep house all night", category: "Nightlife", neighborhood: "Lower Parel",
    venue: "Matahaari", address: "Matahaari, Lower Parel, Mumbai", when: "Tonight · 10 PM",
    timeBucket: "tonight", price: "₹1500", emoji: "🔊", color: C.pink, hype: 380, vibe: "Loud", host: "Matahaari",
    description: "Lower Parel's home for techno and deep house, with baos and sushi to keep you going. Dark room, big system, late nights.",
    tags: ["Techno", "Deep House", "Club", "Late Night"], image: IMG.club,
  },
  {
    id: "3", title: "Saturday at antiSOCIAL", category: "Music", neighborhood: "Lower Parel",
    venue: "antiSOCIAL", address: "antiSOCIAL, Mathuradas Mill Compound, Lower Parel, Mumbai", when: "Sat · 9 PM",
    timeBucket: "weekend", price: "₹800", emoji: "🎶", color: C.purple, hype: 540, vibe: "Loud", host: "antiSOCIAL",
    description: "The warehouse home of Mumbai's underground — electronic, hip-hop and indie acts on a world-class sound system.",
    tags: ["Live Music", "Indie", "Electronic"], image: IMG.nightlife,
  },
  {
    id: "4", title: "Live indie under the umbrellas", category: "Music", neighborhood: "Bandra",
    venue: "Bonobo", address: "Bonobo, Bandra West, Mumbai", when: "Tonight · 9 PM",
    timeBucket: "tonight", price: "₹600", emoji: "🎸", color: C.pink, hype: 260, vibe: "Chill", host: "Bonobo",
    description: "Bandra's beloved rooftop with mushroom umbrellas and weekend live gigs. Easy crowd, good drinks, great sound.",
    tags: ["Live Music", "Rooftop", "Indie"], image: IMG.livemusic,
  },
  {
    id: "5", title: "Gig night at Above The Habitat", category: "Music", neighborhood: "Khar",
    venue: "Above The Habitat", address: "Above The Habitat, Khar West, Mumbai", when: "Tonight · 8:30 PM",
    timeBucket: "tonight", price: "₹700", emoji: "🎤", color: C.purple, hype: 180, vibe: "Chill", host: "Above The Habitat",
    description: "Intimate ~250-cap room that's become a lifeline for Mumbai's live scene. Up-close sets from indie and experimental acts.",
    tags: ["Live Music", "Intimate", "Indie"], image: IMG.jazz,
  },
  {
    id: "6", title: "Comedy Open Mic", category: "Nightlife", neighborhood: "Khar",
    venue: "The Habitat", address: "The Habitat, Khar West, Mumbai", when: "Tonight · 7 & 9 PM",
    timeBucket: "tonight", price: "₹300", emoji: "🎙️", color: C.accent, hype: 150, vibe: "Chill", host: "The Habitat",
    description: "Mumbai's legendary open mic — new comics, working pros testing material and the odd surprise drop-in. Cheap and unpredictable.",
    tags: ["Comedy", "Open Mic", "Cheap"], image: IMG.comedy,
  },
  {
    id: "7", title: "Weekend stand-up special", category: "Nightlife", neighborhood: "Lower Parel",
    venue: "Canvas Laugh Club", address: "Canvas Laugh Club, Palladium Mall, Lower Parel, Mumbai", when: "Sat · 8 PM",
    timeBucket: "weekend", price: "₹500", emoji: "😂", color: C.orange, hype: 220, vibe: "Chill", host: "Canvas Laugh Club",
    description: "India's OG comedy club inside Palladium. Headline sets from the names you know — book ahead, it fills up.",
    tags: ["Comedy", "Stand-up"], image: IMG.comedy,
  },
  {
    id: "8", title: "Jazz & cabaret night", category: "Music", neighborhood: "Girgaon",
    venue: "The Quarter, Royal Opera House", address: "The Quarter, Royal Opera House, Girgaon, Mumbai", when: "Sat · 9 PM",
    timeBucket: "weekend", price: "₹1000", emoji: "🎷", color: C.purple, hype: 140, vibe: "Chill", host: "The Quarter",
    description: "Old-world glamour inside the restored Royal Opera House — live jazz, cabaret and a proper cocktail list.",
    tags: ["Jazz", "Live Music", "Date Night"], image: IMG.jazz,
  },
  {
    id: "9", title: "Carter Road food walk", category: "Food", neighborhood: "Bandra",
    venue: "Carter Road Promenade", address: "Carter Road, Bandra West, Mumbai", when: "Right now",
    timeBucket: "now", price: "₹500", emoji: "🌯", color: C.orange, hype: 128, vibe: "Foodie", host: "Mumbai Foodies",
    description: "Rolls, kebabs and dessert carts along the seafront from Carter Road toward Pali Naka. Walk it, graze it.",
    tags: ["Street Food", "Walk", "Seafront"], image: IMG.food,
  },
  {
    id: "10", title: "BKC food truck park", category: "Food", neighborhood: "BKC",
    venue: "Jio Garden Grounds", address: "Jio Garden, BKC, Mumbai", when: "Right now",
    timeBucket: "now", price: "₹400", emoji: "🚚", color: C.orange, hype: 256, vibe: "Foodie", host: "Mumbai Eats",
    description: "Food trucks, lawn seating and live music. Korean, tacos, Bombay-Chinese, desserts — family and pet friendly.",
    tags: ["Food Trucks", "Outdoor", "Family"], image: IMG.foodtruck,
  },
  {
    id: "11", title: "Specialty coffee & work", category: "Food", neighborhood: "Bandra",
    venue: "Subko Coffee", address: "Subko, Bandra West, Mumbai", when: "Open now",
    timeBucket: "now", price: "₹300", emoji: "☕", color: C.teal, hype: 64, vibe: "Chill", host: "Subko",
    description: "Single-origin roasts and bakehouse pastries in a calm, design-y space. Good wifi, good people-watching.",
    tags: ["Coffee", "Work-friendly", "Brunch"], image: IMG.cafe,
  },
  {
    id: "12", title: "Sunday brunch & books", category: "Food", neighborhood: "Bandra",
    venue: "Poetry by Love & Cheesecake", address: "Poetry by Love & Cheesecake, Bandra West, Mumbai", when: "Sun · 11 AM",
    timeBucket: "weekend", price: "₹900", emoji: "🥐", color: C.teal, hype: 90, vibe: "Chill", host: "Poetry",
    description: "Cosy nooks, bookshelves and a lazy weekend brunch. Grab a corner and stay too long.",
    tags: ["Brunch", "Cafe", "Cosy"], image: IMG.cafe,
  },
  {
    id: "13", title: "Gallery opening night", category: "Art", neighborhood: "Colaba",
    venue: "Jhaveri Contemporary", address: "Jhaveri Contemporary, Colaba, Mumbai", when: "Tonight · 6 PM",
    timeBucket: "tonight", price: "Free", emoji: "🖼️", color: C.purple, hype: 110, vibe: "Artsy", host: "Jhaveri Contemporary",
    description: "Opening for a new contemporary show in Colaba's gallery district. Free entry, wine, and artists usually around.",
    tags: ["Art", "Opening", "Free"], image: IMG.art,
  },
  {
    id: "14", title: "Kala Ghoda art walk", category: "Art", neighborhood: "Fort",
    venue: "Kala Ghoda", address: "Kala Ghoda, Fort, Mumbai", when: "Sat–Sun · 11 AM",
    timeBucket: "weekend", price: "Free", emoji: "🎨", color: C.purple, hype: 210, vibe: "Artsy", host: "Kala Ghoda Association",
    description: "Galleries, street art, museums and indie stores across the Kala Ghoda lanes. Perfect slow weekend wander.",
    tags: ["Art", "Walk", "Free", "Weekend"], image: IMG.art,
  },
  {
    id: "15", title: "Marine Drive night cycle", category: "Outdoors", neighborhood: "Fort",
    venue: "Marine Drive Promenade", address: "Marine Drive, Mumbai", when: "Sat · 11 PM",
    timeBucket: "weekend", price: "Free", emoji: "🚲", color: C.teal, hype: 86, vibe: "Outdoorsy", host: "Mumbai Night Riders",
    description: "Late-night group ride down an empty Marine Drive to the Gateway. Bring your own ride. Cool breeze, zero traffic.",
    tags: ["Cycling", "Free", "Late Night"], image: IMG.cycling,
  },
  {
    id: "16", title: "Versova beach cleanup + chai", category: "Outdoors", neighborhood: "Versova",
    venue: "Versova Beach", address: "Versova Beach, Andheri West, Mumbai", when: "Sun · 7 AM",
    timeBucket: "weekend", price: "Free", emoji: "🏖️", color: C.teal, hype: 64, vibe: "Outdoorsy", host: "Versova Beach Warriors",
    description: "Early cleanup followed by cutting chai and good company. Do some good, meet good people, beat the heat.",
    tags: ["Volunteering", "Beach", "Free", "Morning"], image: IMG.beach,
  },
  {
    id: "17", title: "Sunrise yoga at Juhu Beach", category: "Outdoors", neighborhood: "Juhu",
    venue: "Juhu Beach", address: "Juhu Beach, Mumbai", when: "Sun · 6:15 AM",
    timeBucket: "weekend", price: "₹200", emoji: "🧘", color: C.teal, hype: 73, vibe: "Chill", host: "Beach Flow Collective",
    description: "Slow flow on the sand as the sun comes up, finishing with breathwork. All levels, mats provided.",
    tags: ["Yoga", "Beach", "Morning"], image: IMG.yoga,
  },
];

export type Club = { id: string; name: string; area: string; rating: number; image: string };
export const CLUBS: Club[] = [
  { id: "c1", name: "antiSOCIAL", area: "Lower Parel", rating: 4.5, image: IMG.club },
  { id: "c2", name: "Bonobo", area: "Bandra", rating: 4.4, image: IMG.livemusic },
  { id: "c3", name: "AER", area: "Worli", rating: 4.7, image: IMG.rooftop },
  { id: "c4", name: "Asilo", area: "Lower Parel", rating: 4.6, image: IMG.nightlife },
  { id: "c5", name: "Above The Habitat", area: "Khar", rating: 4.5, image: IMG.jazz },
  { id: "c6", name: "Matahaari", area: "Lower Parel", rating: 4.3, image: IMG.club },
];

// ---- Operator overlay (the moat): what's on tonight + live vibe, per venue ----
export type ProgrammeType = "ladies_night" | "free_drinks" | "karaoke" | "live_music" | "dj" | "happy_hour";
export const PROGRAMME_TYPES: ProgrammeType[] = ["ladies_night", "free_drinks", "karaoke", "live_music", "dj", "happy_hour"];
export const PROGRAMME_META: Record<ProgrammeType, { label: string; emoji: string }> = {
  ladies_night: { label: "Ladies Night", emoji: "💃" },
  free_drinks: { label: "Free Drinks", emoji: "🍹" },
  karaoke: { label: "Karaoke", emoji: "🎤" },
  live_music: { label: "Live Music", emoji: "🎸" },
  dj: { label: "DJ Night", emoji: "🎧" },
  happy_hour: { label: "Happy Hour", emoji: "🍻" },
};

export type Vibe = "chill" | "filling" | "packed";
export const VIBES: Vibe[] = ["chill", "filling", "packed"];
export const VIBE_META: Record<Vibe, { label: string; emoji: string; color: string }> = {
  chill: { label: "Chill", emoji: "😌", color: C.teal },
  filling: { label: "Filling up", emoji: "📈", color: C.orange },
  packed: { label: "Packed", emoji: "🔥", color: C.pink },
};

export type Programme = {
  id: string;
  venueId: string; // a Club id, or a Google place_id
  type: ProgrammeType;
  vibe?: Vibe;
  note?: string;
  by?: string;
  // denormalised venue info (set when the venue isn't one of the fixed CLUBS,
  // e.g. picked from Google Places in the operator screen)
  venueName?: string;
  venueArea?: string;
  venueImage?: string;
};

export const SAMPLE_PROGRAMMES: Programme[] = [
  { id: "pr1", venueId: "c1", type: "dj", vibe: "packed", note: "International techno headliner tonight", by: "Rohit" },
  { id: "pr2", venueId: "c4", type: "ladies_night", vibe: "packed", note: "Ladies free entry till 11", by: "Kabir" },
  { id: "pr3", venueId: "c2", type: "live_music", vibe: "filling", note: "Indie band from 9 PM", by: "Sana" },
  { id: "pr4", venueId: "c3", type: "happy_hour", vibe: "chill", note: "2-for-1 cocktails till 8", by: "You" },
  { id: "pr5", venueId: "c6", type: "free_drinks", vibe: "filling", note: "Free shots till 10", by: "Aisha" },
];

export const PEOPLE: Person[] = [
  { id: "p1", name: "Aarav", initial: "A", color: C.purple },
  { id: "p2", name: "Diya", initial: "D", color: C.orange },
  { id: "p3", name: "Kabir", initial: "K", color: C.pink },
  { id: "p4", name: "Sara", initial: "S", color: C.teal },
  { id: "p5", name: "Riya", initial: "R", color: C.accent },
];
