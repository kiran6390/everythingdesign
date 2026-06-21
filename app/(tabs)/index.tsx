import { Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "@/constants/colors";
import { HAPPENINGS, CLUBS, TIME_FILTERS, PROGRAMME_META, VIBE_META, type TimeBucket, type Happening } from "@/data/happenings";
import { useStore } from "@/hooks/use-store";
import { toggleSave, detectLocation } from "@/utils/store";
import CardStack from "@/components/CardStack";

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

export default function NowScreen() {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [time, setTime] = useState<TimeBucket>("tonight");
  const [tFilter, setTFilter] = useState<string>("all");

  useEffect(() => { detectLocation(); }, []);

  const tonight = store.programmes
    .map((p) => ({ p, club: CLUBS.find((c) => c.id === p.venueId) }))
    .filter((x) => x.club)
    .filter(({ p }) => tFilter === "all" || (tFilter === "packed" ? p.vibe === "packed" : p.type === tFilter));

  const TONIGHT_FILTERS = [
    { key: "all", label: "All" },
    { key: "ladies_night", label: "💃 Ladies Night" },
    { key: "free_drinks", label: "🍹 Free Drinks" },
    { key: "karaoke", label: "🎤 Karaoke" },
    { key: "packed", label: "🔥 Packed" },
  ];

  const all = useMemo(() => [...store.shared, ...HAPPENINGS], [store.shared]);
  const filtered = all.filter((h) => {
    const matchTime = h.timeBucket === time;
    return matchTime;
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header: avatar + greeting + search/heart, all on one line */}
        <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
            <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "900", color: "#000" }}>{(store.userName[0] || "?").toUpperCase()}</Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: "900", color: C.text }} numberOfLines={1}>Hi, {store.userName}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <CircleBtn icon="search" onPress={() => router.push("/(tabs)/explore")} />
            <CircleBtn icon="heart-outline" onPress={() => router.push("/(tabs)/schedule")} />
          </View>
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
            tonight.map(({ p, club }) => {
              const tMeta = PROGRAMME_META[p.type];
              const vMeta = p.vibe ? VIBE_META[p.vibe] : null;
              return (
                <View key={p.id} style={{ flexDirection: "row", gap: 14, backgroundColor: C.surface, borderRadius: 18, padding: 12, alignItems: "center" }}>
                  <Image source={{ uri: club!.image }} style={{ width: 56, height: 56, borderRadius: 14 }} />
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }} numberOfLines={1}>{club!.name}</Text>
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
        <Text style={{ fontSize: 20, fontWeight: "900", color: C.text, paddingHorizontal: 24, marginTop: 10, marginBottom: 12 }}>What's popping</Text>
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
