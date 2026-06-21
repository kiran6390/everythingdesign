// Google Places (New) proxy — keeps GOOGLE_PLACES_KEY server-side.
// Deploy:  supabase functions deploy places --no-verify-jwt
// Secret:  supabase secrets set GOOGLE_PLACES_KEY=AIza...
//
// POST body: { mode: "search" | "nearby", query?, lat?, lng?, radius? }

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...cors, "content-type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const key = Deno.env.get("GOOGLE_PLACES_KEY");
  if (!key) return json({ error: "GOOGLE_PLACES_KEY not set" }, 500);

  // Photo proxy (GET ?photo=<name>) — streams a Place photo so the API key stays server-side.
  if (req.method === "GET") {
    const photo = new URL(req.url).searchParams.get("photo");
    if (!photo) return json({ error: "missing photo param" }, 400);
    const media = `https://places.googleapis.com/v1/${photo}/media?maxWidthPx=800&key=${key}`;
    const img = await fetch(media, { redirect: "follow" });
    return new Response(img.body, {
      status: img.status,
      headers: { ...cors, "content-type": img.headers.get("content-type") ?? "image/jpeg", "cache-control": "public, max-age=86400" },
    });
  }

  let payload: { mode?: string; query?: string; lat?: number; lng?: number; radius?: number };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid body" }, 400);
  }
  const { mode = "search", query, lat, lng, radius = 1500 } = payload;

  const fieldMask = "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.primaryType,places.photos";

  let url: string;
  let body: unknown;
  if (mode === "nearby") {
    if (lat == null || lng == null) return json({ error: "lat/lng required" }, 400);
    url = "https://places.googleapis.com/v1/places:searchNearby";
    body = {
      includedTypes: ["restaurant", "bar", "night_club", "cafe"],
      maxResultCount: 20,
      locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius } },
    };
  } else {
    if (!query) return json({ error: "query required" }, 400);
    url = "https://places.googleapis.com/v1/places:searchText";
    body = {
      textQuery: query,
      ...(lat != null && lng != null
        ? { locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: 8000 } } }
        : {}),
    };
  }

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": fieldMask },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) return json({ error: data?.error?.message ?? "google error", detail: data }, 500);

  const venues = (data.places ?? []).map((p: any) => ({
    id: p.id,
    name: p.displayName?.text ?? "",
    address: p.formattedAddress ?? "",
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    rating: p.rating ?? null,
    type: p.primaryType ?? "place",
    photo: p.photos?.[0]?.name ?? null,
  }));

  return json({ venues });
});
