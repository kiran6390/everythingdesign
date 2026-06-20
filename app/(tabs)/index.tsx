import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { HAPPENINGS, CATEGORIES, TIME_FILTERS, type TimeBucket, type Happening } from "@/data/happenings";
import { useStore } from "@/hooks/use-store";
import { toggleSave, detectLocation } from "@/utils/store";

function HappeningCard({ item, featured }: { item: Happening; featured?: boolean }) {
  const store = useStore();
  const isSaved = store.saved.includes(item.id);
  const isGoing = store.going.includes(item.id);

  if (featured) {
    return (
      <Pressable
        onPress={() => router.push(`/happening/${item.id}`)}
        style={{ backgroundColor: C.accent, borderRadius: 24, padding: 20, gap: 14 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
            <View style={{ backgroundColor: "#000", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: "800", color: C.accent }}>🔥 POPPING NOW</Text>
            </View>
          </View>
          <Pressable onPress={() => toggleSave(item.id)} hitSlop={10}>
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={22} color="#000" />
          </Pressable>
        </View>
        <Text style={{ fontSize: 26, fontWeight: "900", color: "#000", lineHeight: 30 }}>{item.title}</Text>
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#333" }}>
          {item.venue} · {item.neighborhood}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#000" }}>
            {item.when}   ·   {item.price}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#000", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
            <Ionicons name="people" size={13} color={C.accent} />
            <Text style={{ fontSize: 12, fontWeight: "800", color: C.accent }}>{item.hype + (isGoing ? 1 : 0)} going</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/happening/${item.id}`)}
      style={{ backgroundColor: C.surface, borderRadius: 20, padding: 16, gap: 12, borderWidth: 1, borderColor: C.border }}
    >
      <View style={{ flexDirection: "row", gap: 14 }}>
        <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: item.color + "22", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ backgroundColor: item.color + "22", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: "800", color: item.color }}>{item.category.toUpperCase()}</Text>
            </View>
            <Text style={{ fontSize: 11, color: C.textDim }}>·  {item.vibe}</Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }} numberOfLines={1}>{item.title}</Text>
          <Text style={{ fontSize: 12, color: C.textSec }} numberOfLines={1}>
            {item.venue} · {item.neighborhood}
          </Text>
        </View>
        <Pressable onPress={() => toggleSave(item.id)} hitSlop={10}>
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={20} color={isSaved ? C.accent : C.textSec} />
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10 }}>
        <Text style={{ fontSize: 12, fontWeight: "700", color: C.text }}>{item.when}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="people-outline" size={13} color={C.textSec} />
            <Text style={{ fontSize: 12, color: C.textSec }}>{item.hype + (isGoing ? 1 : 0)}</Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: "800", color: item.price === "Free" ? C.teal : C.text }}>{item.price}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function NowScreen() {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [time, setTime] = useState<TimeBucket>("tonight");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    detectLocation();
  }, []);

  const all = useMemo(() => [...store.shared, ...HAPPENINGS], [store.shared]);

  const filtered = all.filter((h) => {
    const matchTime = h.timeBucket === time;
    const matchCat = cat === "All" || h.category === cat;
    return matchTime && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, paddingBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 13, color: C.textSec, fontWeight: "600" }}>Hey {store.userName} 👋</Text>
            <Text style={{ fontSize: 28, fontWeight: "900", color: C.text }}>What's popping</Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/explore")}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.border }}
          >
            <Ionicons name="search" size={20} color={C.text} />
          </Pressable>
        </View>

        {/* Location pill */}
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", backgroundColor: C.accent + "18", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: C.accent + "33" }}>
            <Ionicons name="location" size={13} color={C.accent} />
            <Text style={{ fontSize: 12, fontWeight: "700", color: C.accent }}>Mumbai · {store.neighborhood}</Text>
          </View>
        </View>

        {/* Time filter */}
        <View style={{ flexDirection: "row", paddingHorizontal: 24, gap: 8, marginBottom: 16 }}>
          {TIME_FILTERS.map((t) => {
            const active = t.key === time;
            return (
              <Pressable
                key={t.key}
                onPress={() => setTime(t.key)}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center", backgroundColor: active ? C.text : C.surface, borderWidth: 1, borderColor: active ? C.text : C.border }}
              >
                <Text style={{ fontSize: 14, fontWeight: "800", color: active ? C.bg : C.textSec }}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Category pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
          {CATEGORIES.map((c) => {
            const active = c === cat;
            return (
              <Pressable
                key={c}
                onPress={() => setCat(c)}
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: active ? C.accent : C.surface, borderWidth: 1, borderColor: active ? C.accent : C.border }}
              >
                <Text style={{ fontSize: 13, fontWeight: "700", color: active ? "#000" : C.textSec }}>{c}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Feed */}
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60, gap: 8 }}>
              <Text style={{ fontSize: 40 }}>🤷</Text>
              <Text style={{ fontSize: 16, fontWeight: "700", color: C.text }}>Nothing here yet</Text>
              <Text style={{ fontSize: 13, color: C.textSec }}>Try another time or category — or share something!</Text>
            </View>
          ) : (
            <>
              {featured && <HappeningCard item={featured} featured />}
              {rest.map((item) => (
                <HappeningCard key={item.id} item={item} />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
