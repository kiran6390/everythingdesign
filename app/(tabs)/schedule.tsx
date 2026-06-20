import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { HAPPENINGS, type Happening } from "@/data/happenings";
import { useStore } from "@/hooks/use-store";
import { toggleSave } from "@/utils/store";

const TABS = ["Saved", "Going"] as const;

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Saved");

  const all = [...store.shared, ...HAPPENINGS];
  const ids = tab === "Saved" ? store.saved : store.going;
  const items = ids
    .map((id) => all.find((h) => h.id === id))
    .filter(Boolean) as Happening[];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, gap: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: "900", color: C.text }}>Your plans</Text>

        {/* Toggle */}
        <View style={{ flexDirection: "row", backgroundColor: C.surface, borderRadius: 14, padding: 4, gap: 4 }}>
          {TABS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: tab === t ? C.accent : "transparent", alignItems: "center" }}
            >
              <Text style={{ fontSize: 13, fontWeight: "800", color: tab === t ? "#000" : C.textSec }}>
                {t} {t === "Saved" ? `(${store.saved.length})` : `(${store.going.length})`}
              </Text>
            </Pressable>
          ))}
        </View>

        {items.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 80, gap: 10 }}>
            <Text style={{ fontSize: 44 }}>{tab === "Saved" ? "🔖" : "🎟️"}</Text>
            <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }}>
              {tab === "Saved" ? "Nothing saved yet" : "Not going anywhere yet"}
            </Text>
            <Text style={{ fontSize: 13, color: C.textSec, textAlign: "center" }}>
              {tab === "Saved"
                ? "Tap the bookmark on anything that looks fun."
                : "Open a happening and tap \"I'm going\"."}
            </Text>
            <Pressable onPress={() => router.push("/(tabs)")} style={{ marginTop: 8, backgroundColor: C.accent, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "#000" }}>See what's popping →</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            {items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push(`/happening/${item.id}`)}
                style={{ backgroundColor: C.surface, borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1, borderColor: C.border, borderLeftWidth: 4, borderLeftColor: item.color }}
              >
                <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: item.color + "22", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }} numberOfLines={1}>{item.title}</Text>
                  <Text style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>{item.when} · {item.neighborhood}</Text>
                </View>
                {tab === "Saved" && (
                  <Pressable onPress={() => toggleSave(item.id)} hitSlop={10}>
                    <Ionicons name="bookmark" size={18} color={C.accent} />
                  </Pressable>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
