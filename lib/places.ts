// Nearby venues via OpenStreetMap Overpass API — free, no API key.

export type Venue = {
  id: string;
  name: string;
  type: string; // restaurant | cafe | bar | pub | nightclub | fast_food ...
  lat: number;
  lon: number;
  distance: number; // metres from the user
};

const OVERPASS = "https://overpass-api.de/api/interpreter";

const TYPE_EMOJI: Record<string, string> = {
  restaurant: "🍽️",
  cafe: "☕",
  bar: "🍸",
  pub: "🍺",
  nightclub: "🪩",
  fast_food: "🍔",
  food_court: "🍱",
  ice_cream: "🍦",
  biergarten: "🍻",
};

export function venueEmoji(type: string) {
  return TYPE_EMOJI[type] ?? "📍";
}

export function prettyType(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatDistance(m: number) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

// Approx centres of Mumbai areas — used to snap GPS to a known neighborhood.
const AREA_COORDS: { name: string; lat: number; lon: number }[] = [
  { name: "Bandra", lat: 19.0596, lon: 72.8295 },
  { name: "Chembur", lat: 19.0522, lon: 72.9005 },
  { name: "Lower Parel", lat: 18.9960, lon: 72.8295 },
  { name: "Andheri", lat: 19.1197, lon: 72.8468 },
  { name: "Colaba", lat: 18.9067, lon: 72.8147 },
  { name: "Juhu", lat: 19.1075, lon: 72.8263 },
  { name: "Powai", lat: 19.1176, lon: 72.9060 },
  { name: "Fort", lat: 18.9340, lon: 72.8350 },
  { name: "Versova", lat: 19.1300, lon: 72.8120 },
  { name: "BKC", lat: 19.0662, lon: 72.8690 },
  { name: "Dadar", lat: 19.0180, lon: 72.8440 },
  { name: "Worli", lat: 19.0176, lon: 72.8170 },
  { name: "Ghatkopar", lat: 19.0860, lon: 72.9080 },
  { name: "Kurla", lat: 19.0726, lon: 72.8845 },
  { name: "Sion", lat: 19.0400, lon: 72.8620 },
  { name: "Vashi", lat: 19.0770, lon: 72.9986 },
];

// Returns the nearest known area within `maxKm`, else null.
export function nearestNeighborhood(lat: number, lon: number, maxKm = 6): string | null {
  let best: { name: string; d: number } | null = null;
  for (const a of AREA_COORDS) {
    const d = haversine(lat, lon, a.lat, a.lon);
    if (!best || d < best.d) best = { name: a.name, d };
  }
  return best && best.d <= maxKm * 1000 ? best.name : null;
}

export async function fetchNearbyVenues(
  lat: number,
  lon: number,
  radius = 700
): Promise<Venue[]> {
  const filter =
    "restaurant|cafe|bar|pub|nightclub|fast_food|food_court|ice_cream|biergarten";
  const query = `[out:json][timeout:25];
(
  node["amenity"~"${filter}"](around:${radius},${lat},${lon});
  way["amenity"~"${filter}"](around:${radius},${lat},${lon});
);
out center 80;`;

  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const json = await res.json();

  const venues: Venue[] = (json.elements ?? [])
    .map((el: any) => {
      const vlat = el.lat ?? el.center?.lat;
      const vlon = el.lon ?? el.center?.lon;
      const name = el.tags?.name;
      if (!vlat || !vlon || !name) return null;
      return {
        id: String(el.id),
        name,
        type: el.tags.amenity ?? "place",
        lat: vlat,
        lon: vlon,
        distance: haversine(lat, lon, vlat, vlon),
      } as Venue;
    })
    .filter(Boolean) as Venue[];

  // dedupe by name (OSM often has duplicates), keep nearest
  const seen = new Map<string, Venue>();
  for (const v of venues.sort((a, b) => a.distance - b.distance)) {
    if (!seen.has(v.name)) seen.set(v.name, v);
  }
  return Array.from(seen.values()).slice(0, 40);
}
