import { useState } from "react";
import { ImageBackground, Linking, Pressable, ScrollView, Share, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "@/constants/colors";
import { HAPPENINGS } from "@/data/happenings";
import { useStore } from "@/hooks/use-store";
import { toggleSave, toggleGoing } from "@/utils/store";

const REVIEWS = [
  { name: "Aarav", date: "2 days ago", initial: "A", color: C.purple, text: "Unreal vibe — the crowd was electric and the music didn't stop. Came early, stayed way too late." },
  { name: "Diya", date: "last week", initial: "D", color: C.pink, text: "Easy to get in, great energy. One of the better nights out I've had in Mumbai lately." },
];

const Divider = () => <View style={{ height: 1, backgroundColor: C.border, marginVertical: 22 }} />;

function CircleBtn({ icon, onPress, active }: { icon: any; onPress: () => void; active?: boolean }) {
  return (
    <Pressable onPress={onPress} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" }}>
      <Ionicons name={icon} size={18} color={active ? "#FF4D6D" : "#111"} />
    </Pressable>
  );
}

export default function HappeningDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [expanded, setExpanded] = useState(false);

  const all = [...store.shared, ...HAPPENINGS];
  const item = all.find((h) => h.id === id);
  if (!item) return null;

  const isSaved = store.saved.includes(item.id);
  const isGoing = store.going.includes(item.id);
  const going = item.hype + (isGoing ? 1 : 0);
  const rating = 4.8;

  const openMaps = () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`);
  const onShare = () => Share.share({ message: `${item.title} — ${item.venue}, ${item.neighborhood} · ${item.when}\nFound on GetIn` });

  const highlights = [
    { icon: "calendar-outline", title: item.when, sub: "Happening soon — don't miss it" },
    { icon: "cash-outline", title: item.price || "Free entry", sub: "Entry / cover" },
    { icon: "sparkles-outline", title: `${item.vibe} vibe`, sub: `${item.category} in ${item.neighborhood}` },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={{ height: 340 }}>
          {item.image ? (
            <ImageBackground source={{ uri: item.image }} style={{ flex: 1 }} />
          ) : (
            <View style={{ flex: 1, backgroundColor: item.color + "33", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 90 }}>{item.emoji}</Text>
            </View>
          )}
          <View style={{ position: "absolute", top: insets.top + 8, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between" }}>
            <CircleBtn icon="chevron-back" onPress={() => router.back()} />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <CircleBtn icon="share-outline" onPress={onShare} />
              <CircleBtn icon={isSaved ? "heart" : "heart-outline"} active={isSaved} onPress={() => toggleSave(item.id)} />
            </View>
          </View>
          <View style={{ position: "absolute", bottom: 14, right: 16, backgroundColor: "rgba(0,0,0,0.65)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }}>
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>1 / 5</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, paddingTop: 22 }}>
          {/* Title + rating */}
          <Text style={{ fontSize: 24, fontWeight: "800", color: C.text, lineHeight: 30 }}>{item.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Ionicons name="star" size={14} color={C.text} />
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{rating.toFixed(1)}</Text>
            <Text style={{ color: C.textSec }}>·</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: C.text, textDecorationLine: "underline" }}>{going} going</Text>
            <Text style={{ color: C.textSec }}>·</Text>
            <Text style={{ fontSize: 14, color: C.textSec }}>{item.neighborhood}, Mumbai</Text>
          </View>

          <Divider />

          {/* Host */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: "800", color: C.text }}>Hosted by {item.host}</Text>
              <Text style={{ fontSize: 14, color: C.textSec, marginTop: 4 }}>{item.category} · {item.vibe} vibe</Text>
            </View>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: item.color, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "900", color: "#fff" }}>{item.host[0]?.toUpperCase()}</Text>
            </View>
          </View>

          <Divider />

          {/* Highlights */}
          <View style={{ gap: 18 }}>
            {highlights.map((h) => (
              <View key={h.title} style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <Ionicons name={h.icon as any} size={24} color={C.text} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>{h.title}</Text>
                  <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2 }}>{h.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <Divider />

          {/* About */}
          <Text style={{ fontSize: 14, color: C.text, lineHeight: 22 }} numberOfLines={expanded ? undefined : 3}>
            {item.description}
          </Text>
          <Pressable onPress={() => setExpanded((e) => !e)} style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.text, textDecorationLine: "underline" }}>{expanded ? "Show less" : "Show more"}</Text>
            <Ionicons name={expanded ? "chevron-up" : "chevron-forward"} size={14} color={C.text} />
          </Pressable>

          <Divider />

          {/* What's on offer (amenities) */}
          <Text style={{ fontSize: 19, fontWeight: "800", color: C.text, marginBottom: 16 }}>What's on offer</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {[`${item.category}`, `${item.vibe} crowd`, ...item.tags].slice(0, 6).map((tag, i) => (
              <View key={i} style={{ width: "50%", flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Ionicons name="checkmark-circle-outline" size={20} color={C.text} />
                <Text style={{ fontSize: 14, color: C.text, flex: 1 }} numberOfLines={1}>{tag}</Text>
              </View>
            ))}
          </View>

          <Divider />

          {/* Where you'll be */}
          <Text style={{ fontSize: 19, fontWeight: "800", color: C.text, marginBottom: 14 }}>Where you'll be</Text>
          <Pressable onPress={openMaps} style={{ backgroundColor: C.surface, borderRadius: 16, overflow: "hidden" }}>
            <View style={{ height: 150, backgroundColor: C.surface2, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="location" size={34} color={C.accent} />
              <Text style={{ color: C.textSec, fontSize: 12, marginTop: 6 }}>Tap to open in Maps</Text>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>{item.venue}</Text>
              <Text style={{ fontSize: 13, color: C.textSec, marginTop: 2 }}>{item.neighborhood}, Mumbai</Text>
            </View>
          </Pressable>

          <Divider />

          {/* Reviews */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Ionicons name="star" size={18} color={C.text} />
            <Text style={{ fontSize: 19, fontWeight: "800", color: C.text }}>{rating.toFixed(1)} · {going} going</Text>
          </View>
          <View style={{ gap: 18 }}>
            {REVIEWS.map((r) => (
              <View key={r.name} style={{ gap: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: r.color, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 15, fontWeight: "800", color: "#fff" }}>{r.initial}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{r.name}</Text>
                    <Text style={{ fontSize: 12, color: C.textSec }}>{r.date}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 14, color: C.text, lineHeight: 21 }}>{r.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky reserve bar */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 14, paddingBottom: insets.bottom + 14, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 17, fontWeight: "800", color: C.text }}>{item.price || "Free"}</Text>
          <Text style={{ fontSize: 13, color: C.textSec, textDecorationLine: "underline" }}>{item.when}</Text>
        </View>
        <Pressable
          onPress={() => toggleGoing(item.id)}
          style={{ backgroundColor: isGoing ? C.surface2 : C.accent, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 15, flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Ionicons name={isGoing ? "checkmark-circle" : "flame"} size={18} color={isGoing ? C.text : "#000"} />
          <Text style={{ fontSize: 16, fontWeight: "800", color: isGoing ? C.text : "#000" }}>{isGoing ? "Going" : "I'm going"}</Text>
        </Pressable>
      </View>
    </View>
  );
}
