import { SUPABASE_URL, SUPABASE_ANON } from "@/lib/supabase";
import { haversine, nearestNeighborhood, type Venue } from "@/lib/places";

const FN = `${SUPABASE_URL}/functions/v1/smooth-processor`;

type RawVenue = { id: string; name: string; address: string; lat: number; lng: number; rating: number | null; type: string };

async function call(payload: Record<string, unknown>): Promise<RawVenue[]> {
  const r = await fetch(FN, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SUPABASE_ANON}`, apikey: SUPABASE_ANON },
    body: JSON.stringify(payload),
  });
  const d = await r.json();
  if (!r.ok || d.error) throw new Error(d.error ?? `places ${r.status}`);
  return (d.venues ?? []) as RawVenue[];
}

// Nearby venues for check-in — returns the same Venue shape as the OSM helper.
export async function googleNearby(lat: number, lng: number, radius = 1500): Promise<Venue[]> {
  const raw = await call({ mode: "nearby", lat, lng, radius });
  return raw
    .filter((v) => v.lat != null && v.lng != null && v.name)
    .map((v) => ({ id: v.id, name: v.name, type: v.type, lat: v.lat, lon: v.lng, distance: haversine(lat, lng, v.lat, v.lng) }))
    .sort((a, b) => a.distance - b.distance);
}

// Venue search for the operator screen.
export type SearchVenue = { id: string; name: string; area: string; address: string; rating: number | null };
export async function googleSearch(query: string, lat?: number, lng?: number): Promise<SearchVenue[]> {
  const raw = await call({ mode: "search", query, lat, lng });
  return raw
    .filter((v) => v.name)
    .map((v) => ({
      id: v.id,
      name: v.name,
      address: v.address,
      rating: v.rating,
      area: (v.lat != null && v.lng != null ? nearestNeighborhood(v.lat, v.lng) : null) ?? v.address.split(",")[1]?.trim() ?? "Mumbai",
    }));
}
