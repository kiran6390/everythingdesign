import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { C } from "@/constants/colors";
import { checkInAt } from "@/utils/store";
import { fetchNearbyVenues, venueEmoji, prettyType, formatDistance, type Venue } from "@/lib/places";
import type { Happening } from "@/data/happenings";

const NIGHTLIFE = new Set(["bar", "pub", "nightclub", "biergarten"]);

function toHappening(v: Venue, neighborhood: string): Happening {
  const category = NIGHTLIFE.has(v.type) ? "Nightlife" : "Food";
  return {
    id: `c-${Date.now()}`,
    title: `At ${v.name}`,
    category,
    neighborhood,
    venue: v.name,
    address: `${v.name}, ${neighborhood}, Mumbai`,
    when: "Right now",
    timeBucket: "now",
    price: "",
    emoji: venueEmoji(v.type),
    color: C.accent,
    hype: 1,
    vibe: "Chill",
    host: "You",
    description: `Checked in at ${v.name} just now.`,
    tags: [prettyType(v.type), neighborhood],
    mine: true,
  };
}

export default function CheckinScreen() {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<"loading" | "denied" | "error" | "ready">("loading");
  const [venues, setVenues] = useState<Venue[]>([]);
  const [neighborhood, setNeighborhood] = useState("Mumbai");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== "granted") {
        setStatus("denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = loc.coords;

      // best-effort neighborhood label
      try {
        const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
        const g = geo[0];
        if (g) setNeighborhood(g.district || g.subregion || g.city || "Mumbai");
      } catch {}

      const found = await fetchNearbyVenues(latitude, longitude);
      setVenues(found);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const doCheckIn = (v: Venue) => {
    checkInAt(toHappening(v, neighborhood));
    router.push("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, paddingBottom: 12 }}>
        <Text style={{ fontSize: 26, fontWeight: "900", color: C.text }}>Check in</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 }}>
          <Ionicons name="location" size={14} color={C.accent} />
          <Text style={{ fontSize: 13, color: C.textSec }}>
            {status === "ready" ? `Near you · ${neighborhood}` : "Finding places near you…"}
          </Text>
          {status === "ready" && (
            <Pressable onPress={load} hitSlop={10} style={{ marginLeft: "auto" }}>
              <Ionicons name="refresh" size={18} color={C.textSec} />
            </Pressable>
          )}
        </View>
      </View>

      {status === "loading" && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator color={C.accent} />
          <Text style={{ fontSize: 13, color: C.textSec }}>Getting your location…</Text>
        </View>
      )}

      {status === "denied" && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 44 }}>📍</Text>
          <Text style={{ fontSize: 17, fontWeight: "800", color: C.text }}>Location is off</Text>
          <Text style={{ fontSize: 13, color: C.textSec, textAlign: "center" }}>
            GetIn needs your location to show places nearby and let you check in.
          </Text>
          <Pressable onPress={() => Linking.openSettings()} style={{ backgroundColor: C.accent, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, marginTop: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: "#000" }}>Open Settings</Text>
          </Pressable>
          <Pressable onPress={load} style={{ paddingVertical: 8 }}>
            <Text style={{ fontSize: 14, color: C.accent, fontWeight: "700" }}>Try again</Text>
          </Pressable>
        </View>
      )}

      {status === "error" && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 40 }}>
          <Text style={{ fontSize: 44 }}>😕</Text>
          <Text style={{ fontSize: 17, fontWeight: "800", color: C.text }}>Couldn't load places</Text>
          <Text style={{ fontSize: 13, color: C.textSec, textAlign: "center" }}>Check your connection and try again.</Text>
          <Pressable onPress={load} style={{ backgroundColor: C.accent, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: "#000" }}>Retry</Text>
          </Pressable>
        </View>
      )}

      {status === "ready" && (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 12 }} showsVerticalScrollIndicator={false}>
          {venues.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60, gap: 8 }}>
              <Text style={{ fontSize: 40 }}>🤷</Text>
              <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>No venues found nearby</Text>
            </View>
          ) : (
            venues.map((v) => (
              <View key={v.id} style={{ backgroundColor: C.surface2, borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 14 }}>
                <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 24 }}>{venueEmoji(v.type)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }} numberOfLines={1}>{v.name}</Text>
                  <Text style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>
                    {prettyType(v.type)} · {formatDistance(v.distance)}
                  </Text>
                </View>
                <Pressable
                  onPress={() => doCheckIn(v)}
                  style={{ backgroundColor: C.accent, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <Ionicons name="flame" size={14} color="#000" />
                  <Text style={{ fontSize: 13, fontWeight: "800", color: "#000" }}>Check in</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
