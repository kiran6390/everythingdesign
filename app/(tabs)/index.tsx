import { Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "@/constants/colors";
import { HAPPENINGS, CLUBS, TIME_FILTERS, type TimeBucket, type Happening } from "@/data/happenings";
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

  useEffect(() => { detectLocation(); }, []);

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
