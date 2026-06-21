import { ActivityIndicator, Image, ImageBackground, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "@/constants/colors";
import { HAPPENINGS, CLUBS, NEIGHBORHOODS, TIME_FILTERS, PROGRAMME_META, VIBE_META, type TimeBucket, type Happening } from "@/data/happenings";
import { useStore } from "@/hooks/use-store";
import { toggleSave, detectLocation, setManualArea } from "@/utils/store";
import CardStack from "@/components/CardStack";
import { googleNearby } from "@/lib/placesGoogle";
import { fetchNearbyVenues, prettyType, formatDistance, type Venue } from "@/lib/places";

type VenueBucket = "nightlife" | "dining" | "cafe" | "other";
function venueBucket(type: string): VenueBucket {
  const t = (type || "").toLowerCase();
  if (t.includes("night") || t.includes("bar") || t.includes("club") || t.includes("pub") || t.includes("lounge")) return "nightlife";
  if (t.includes("cafe") || t.includes("coffee") || t.includes("bakery")) return "cafe";
  if (t.includes("restaurant") || t.includes("dining") || t.includes("food") || t.includes("deli") || t.includes("dosa") || t.includes("meal") || t.includes("steak") || t.includes("pizza")) return "dining";
  return "other";
}
const VENUE_FILTERS = [
  { key: "all", label: "All" },
  { key: "nightlife", label: "🍸 Clubs & Bars" },
  { key: "dining", label: "🍽️ Dining" },
  { key: "cafe", label: "☕ Cafés" },
];

function BigCard({ item }: { item: Happening }) {
  const store = useStore();
  const isSaved = store.saved.includes(item.id);
  const isGoing = store.going.includes(item.id);
  const going = item.hype + (isGoing ? 1 : 0);

  return (
    <Pressable onPress={() => router.push(`/happening/${item.id}`)} style={{ borderRadius: 28, overflow: "hidden", height: 380, backgroundColor: C.surface }}>
      {item.image ? (
        <ImageBackground source={{ uri: item.image }} style={{ flex: 1 }}>
          <Heart saved={isSaved} onPress={() => toggleSave(item.id)} />
          <LinearGradient colors={["rgba(0,0,0,0.25)", "transparent", "rgba(0,0,0,0.9)"]} locations={[0, 0.4, 1]} style={{ flex: 1, justifyContent: "flex-end", padding: 18 }}>
            <Overlay item={item} going={going} />
          </LinearGradient>
        </ImageBackground>
      ) : (
        <View style={{ flex: 1, backgroundColor: item.color + "22" }}>
          <Heart saved={isSaved} onPress={() => toggleSave(item.id)} />
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 80 }}>{item.emoji}</Text>
          </View>
          <View style={{ padding: 18 }}>
            <Text style={{ color: C.textSec, fontSize: 13, fontWeight: "600" }}>{item.neighborhood} · {item.category}</Text>
            <Text style={{ color: C.text, fontSize: 22, fontWeight: "900", marginTop: 4 }}>{item.title}</Text>
            <Text style={{ color: C.textSec, fontSize: 12, marginTop: 6 }}>{item.when} · ★ {going} going · {item.price || "Free"}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

function Heart({ saved, onPress }: { saved: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={{ position: "absolute", top: 16, right: 16, zIndex: 2, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" }}>
      <Ionicons name={saved ? "heart" : "heart-outline"} size={20} color={saved ? "#FF4D6D" : "#fff"} />
    </Pressable>
  );
}

function Overlay({ item, going }: { item: Happening; going: number }) {
  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.accent }} />
        <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600" }}>{item.neighborhood} · {item.category}</Text>
      </View>
      <Text style={{ color: "#fff", fontSize: 26, fontWeight: "900", lineHeight: 30 }}>{item.title}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <View>
          <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "700" }}>{item.when}</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>★ {going} going · {item.price || "Free"}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.accent, paddingLeft: 16, paddingRight: 5, paddingVertical: 5, borderRadius: 24 }}>
          <Text style={{ color: "#000", fontWeight: "800", fontSize: 14 }}>View</Text>
          <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="arrow-forward" size={16} color={C.accent} />
          </View>
        </View>
      </View>
    </>
  );
}

function CircleBtn({ icon, onPress }: { icon: any; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" }}>
      <Ionicons name={icon} size={19} color={C.text} />
    </Pressable>
  );
}

const VU = (id: string) => `https://images.unsplash.com/${id}?w=800&q=70&auto=format&fit=crop`;
const IMG_POOLS: Record<VenueBucket, string[]> = {
  nightlife: ["photo-1566737236500-c8ac43014a67", "photo-1545128485-c400e7702796", "photo-1470229722913-7c0e2dbbafd3", "photo-1511192336575-5a79af67a629"],
  dining: ["photo-1504674900247-0877df9cc836", "photo-1565123409695-7b5ef63a2efb", "photo-1517457373958-b7bdd4587205"],
  cafe: ["photo-1554118811-1e0d58224f24", "photo-1504674900247-0877df9cc836"],
  other: ["photo-1517457373958-b7bdd4587205"],
};
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
// Fallback image when a venue has no Google photo — varied by id so cards differ.
function venueImage(type: string, id = "") {
  const pool = IMG_POOLS[venueBucket(type)] ?? IMG_POOLS.other;
  return VU(pool[hashStr(id) % pool.length]);
}

function VenueBigCard({ v }: { v: Venue }) {
  const store = useStore();
  const isSaved = store.saved.includes(v.id);
  return (
    <Pressable
      onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name)}&query_place_id=${v.id}`)}
      style={{ borderRadius: 28, overflow: "hidden", height: 300, backgroundColor: C.surface }}
    >
      <ImageBackground source={{ uri: v.image ?? venueImage(v.type, v.id) }} style={{ flex: 1 }}>
        <Pressable onPress={() => toggleSave(v.id)} hitSlop={10} style={{ position: "absolute", top: 14, right: 14, zIndex: 2, width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name={isSaved ? "heart" : "heart-outline"} size={20} color={isSaved ? "#FF4D6D" : "#fff"} />
        </Pressable>
        <LinearGradient colors={["rgba(0,0,0,0.2)", "transparent", "rgba(0,0,0,0.88)"]} locations={[0, 0.45, 1]} style={{ flex: 1, justifyContent: "flex-end", padding: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.accent }} />
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600" }}>{prettyType(v.type)} · {formatDistance(v.distance)} away</Text>
          </View>
          <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900" }} numberOfLines={1}>{v.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.accent, paddingLeft: 16, paddingRight: 5, paddingVertical: 5, borderRadius: 24 }}>
              <Text style={{ color: "#000", fontWeight: "800", fontSize: 14 }}>Directions</Text>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="navigate" size={15} color={C.accent} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

export default function NowScreen() {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [time, setTime] = useState<TimeBucket>("tonight");
  const [tFilter, setTFilter] = useState<string>("all");
  const [nearby, setNearby] = useState<Venue[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [showLoc, setShowLoc] = useState(false);
  const [venFilter, setVenFilter] = useState<string>("all");

  // categorised + quality-sorted nearby venues (drops uncategorised "local" noise)
  const shownNearby = nearby
    .filter((v) => {
      const b = venueBucket(v.type);
      if (b === "other") return false;
      return venFilter === "all" || b === venFilter;
    })
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  // prompt for location on entry
  useEffect(() => { detectLocation(); }, []);

  // once we have coords, load real venues around the user (Google → OSM fallback)
  useEffect(() => {
    if (!store.coords) return;
    const { lat, lng } = store.coords;
    setNearby([]);
    setNearbyLoading(true);
    (async () => {
      try {
        let v = await googleNearby(lat, lng);
        if (!v.length) v = await fetchNearbyVenues(lat, lng);
        setNearby(v.slice(0, 20));
      } catch {
        try { setNearby((await fetchNearbyVenues(lat, lng)).slice(0, 20)); } catch {}
      } finally {
        setNearbyLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.coords?.lat, store.coords?.lng]);

  const tonight = store.programmes
    .map((p) => {
      const club = CLUBS.find((c) => c.id === p.venueId);
      return {
        p,
        venue: {
          name: club?.name ?? p.venueName ?? "Venue",
          area: club?.area ?? p.venueArea ?? "Mumbai",
          image: club?.image ?? p.venueImage,
        },
      };
    })
    .filter(({ p }) => tFilter === "all" || (tFilter === "packed" ? p.vibe === "packed" : p.type === tFilter));

  const TONIGHT_FILTERS = [
    { key: "all", label: "All" },
    { key: "ladies_night", label: "💃 Ladies Night" },
    { key: "free_drinks", label: "🍹 Free Drinks" },
    { key: "karaoke", label: "🎤 Karaoke" },
    { key: "packed", label: "🔥 Packed" },
  ];

  const all = useMemo(() => [...store.shared, ...HAPPENINGS], [store.shared]);
  const byTime = all.filter((h) => h.timeBucket === time);
  // events in the chosen area; fall back to all-Mumbai if that area has none
  const inArea = store.neighborhood === "Mumbai" ? byTime : byTime.filter((h) => h.neighborhood === store.neighborhood);
  const filtered = (inArea.length ? inArea : byTime).sort((a, b) => {
    // surface the user's interests first
    const av = store.vibes.length && store.vibes.includes(a.category) ? 0 : 1;
    const bv = store.vibes.length && store.vibes.includes(b.category) ? 0 : 1;
    return av - bv;
  });
  const areaHasEvents = inArea.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header: avatar + greeting + search/heart, all on one line */}
        <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "900", color: "#000" }}>{(store.userName[0] || "?").toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 21, fontWeight: "900", color: C.text }} numberOfLines={1}>Hi, {store.userName}</Text>
              <Pressable onPress={() => setShowLoc((s) => !s)} hitSlop={8} style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Ionicons name="location" size={13} color={C.accent} />
                <Text style={{ fontSize: 12, color: C.textSec, fontWeight: "600" }} numberOfLines={1}>
                  {store.coords ? `${store.neighborhood}, Mumbai` : "Finding your area…"}
                </Text>
                <Ionicons name="chevron-down" size={12} color={C.textSec} />
              </Pressable>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <CircleBtn icon="search" onPress={() => router.push("/(tabs)/explore")} />
            <CircleBtn icon="heart-outline" onPress={() => router.push("/(tabs)/schedule")} />
          </View>
        </View>

        {/* Location picker */}
        {showLoc && (
          <View style={{ marginHorizontal: 24, marginTop: 12, backgroundColor: C.surface, borderRadius: 16, padding: 14, gap: 12 }}>
            <Pressable
              onPress={() => { detectLocation(true); setShowLoc(false); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Ionicons name="navigate" size={16} color={C.accent} />
              <Text style={{ fontSize: 14, fontWeight: "700", color: C.accent }}>Use my current location</Text>
            </Pressable>
            <View style={{ height: 1, backgroundColor: C.border }} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {NEIGHBORHOODS.filter((n) => n !== "All").map((n) => {
                const on = n === store.neighborhood;
                return (
                  <Pressable key={n} onPress={() => { setManualArea(n); setShowLoc(false); }} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: on ? C.accent : C.surface2 }}>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: on ? "#000" : C.textSec }}>{n}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Around you — the location-driven main feed */}
        <Text style={{ fontSize: 20, fontWeight: "900", color: C.text, paddingHorizontal: 24, marginTop: 22, marginBottom: 12 }}>Around you</Text>
        {store.coords && nearby.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }} style={{ marginBottom: 12 }}>
            {VENUE_FILTERS.map((f) => {
              const active = f.key === venFilter;
              return (
                <Pressable key={f.key} onPress={() => setVenFilter(f.key)} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22, backgroundColor: active ? C.accent : C.surface }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: active ? "#000" : C.textSec }}>{f.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
        <View style={{ paddingHorizontal: 24, gap: 18, marginBottom: 4 }}>
          {!store.coords ? (
            <View style={{ backgroundColor: C.surface, borderRadius: 20, padding: 24, alignItems: "center", gap: 12 }}>
              <Ionicons name="location" size={36} color={C.accent} />
              <Text style={{ fontSize: 16, fontWeight: "800", color: C.text, textAlign: "center" }}>See what's around you</Text>
              <Text style={{ fontSize: 13, color: C.textSec, textAlign: "center" }}>Turn on location to load real venues near you.</Text>
              <Pressable onPress={() => detectLocation(true)} style={{ backgroundColor: C.accent, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, marginTop: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: "800", color: "#000" }}>Enable location</Text>
              </Pressable>
            </View>
          ) : nearbyLoading && nearby.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40, gap: 10 }}>
              <ActivityIndicator color={C.accent} />
              <Text style={{ fontSize: 13, color: C.textSec }}>Finding places near you…</Text>
            </View>
          ) : shownNearby.length === 0 ? (
            <Text style={{ fontSize: 13, color: C.textSec, paddingVertical: 16 }}>No {venFilter === "all" ? "places" : venFilter} found nearby.</Text>
          ) : (
            shownNearby.map((v) => <VenueBigCard key={v.id} v={v} />)
          )}
        </View>

        {/* Clubs deck */}
        <Text style={{ fontSize: 20, fontWeight: "900", color: C.text, paddingHorizontal: 24, marginTop: 24 }}>Clubs tonight</Text>
        <CardStack items={CLUBS} />

        {/* Tonight — operator overlay (the moat) */}
        <Text style={{ fontSize: 20, fontWeight: "900", color: C.text, paddingHorizontal: 24, marginTop: 18, marginBottom: 12 }}>Tonight</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }} style={{ marginBottom: 12 }}>
          {TONIGHT_FILTERS.map((f) => {
            const active = f.key === tFilter;
            return (
              <Pressable key={f.key} onPress={() => setTFilter(f.key)} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22, backgroundColor: active ? C.accent : C.surface }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: active ? "#000" : C.textSec }}>{f.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={{ paddingHorizontal: 24, gap: 12, marginBottom: 8 }}>
          {tonight.length === 0 ? (
            <Text style={{ fontSize: 13, color: C.textSec, paddingVertical: 16 }}>Nothing tagged for that filter yet.</Text>
          ) : (
            tonight.map(({ p, venue }) => {
              const tMeta = PROGRAMME_META[p.type];
              const vMeta = p.vibe ? VIBE_META[p.vibe] : null;
              return (
                <View key={p.id} style={{ flexDirection: "row", gap: 14, backgroundColor: C.surface, borderRadius: 18, padding: 12, alignItems: "center" }}>
                  {venue.image ? (
                    <Image source={{ uri: venue.image }} style={{ width: 56, height: 56, borderRadius: 14 }} />
                  ) : (
                    <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name="location" size={24} color={C.accent} />
                    </View>
                  )}
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }} numberOfLines={1}>{venue.name}</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: C.accentDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                        <Text style={{ fontSize: 11 }}>{tMeta.emoji}</Text>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: C.accent }}>{tMeta.label}</Text>
                      </View>
                      {vMeta && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: vMeta.color + "22", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                          <Text style={{ fontSize: 11 }}>{vMeta.emoji}</Text>
                          <Text style={{ fontSize: 11, fontWeight: "700", color: vMeta.color }}>{vMeta.label}</Text>
                        </View>
                      )}
                    </View>
                    {p.note ? <Text style={{ fontSize: 12, color: C.textSec }} numberOfLines={1}>{p.note}{p.by ? ` · ${p.by}` : ""}</Text> : null}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* What's popping */}
        <Text style={{ fontSize: 20, fontWeight: "900", color: C.text, paddingHorizontal: 24, marginTop: 10, marginBottom: 4 }}>
          What's popping{store.neighborhood !== "Mumbai" ? ` in ${store.neighborhood}` : ""}
        </Text>
        {store.neighborhood !== "Mumbai" && !areaHasEvents && (
          <Text style={{ fontSize: 12, color: C.textDim, paddingHorizontal: 24, marginBottom: 8 }}>Nothing tagged here yet — showing across Mumbai.</Text>
        )}
        <View style={{ height: 8 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }} style={{ marginBottom: 16 }}>
          {TIME_FILTERS.map((t) => {
            const active = t.key === time;
            return (
              <Pressable key={t.key} onPress={() => setTime(t.key)} style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 22, backgroundColor: active ? C.accent : C.surface }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: active ? "#000" : C.textSec }}>{t.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: 24, gap: 18 }}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 50, gap: 8 }}>
              <Text style={{ fontSize: 40 }}>🤷</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: C.text }}>Nothing here yet</Text>
              <Text style={{ fontSize: 13, color: C.textSec }}>Try another time or category.</Text>
            </View>
          ) : (
            filtered.map((item) => <BigCard key={item.id} item={item} />)
          )}
        </View>
      </ScrollView>
    </View>
  );
}
