import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { NEIGHBORHOODS } from "@/data/happenings";
import { setNeighborhood, setVibes } from "@/utils/store";

const AREAS = NEIGHBORHOODS.filter((n) => n !== "All");
const INTERESTS = [
  { key: "Nightlife", emoji: "🍸" },
  { key: "Music", emoji: "🎸" },
  { key: "Food", emoji: "🍽️" },
  { key: "Art", emoji: "🎨" },
  { key: "Markets", emoji: "🛍️" },
  { key: "Outdoors", emoji: "🌅" },
];

const INK = "#111";
const GRAY = "#8A8A8E";
const CHIP = "#F2F2F3";

export default function SetupScreen() {
  const insets = useSafeAreaInsets();
  const [area, setArea] = useState<string>("Bandra");
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (k: string) => setPicked((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const next = () => {
    setNeighborhood(area);
    setVibes(picked.length ? picked : INTERESTS.map((i) => i.key));
    router.push("/(onboarding)/location");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 32, fontWeight: "900", color: INK, lineHeight: 38, letterSpacing: -0.5 }}>Let's tune{"\n"}your scene</Text>
        <Text style={{ fontSize: 15, color: GRAY, marginTop: 12 }}>So we show you the right nights out.</Text>

        <Text style={{ fontSize: 14, fontWeight: "700", color: INK, marginTop: 34, marginBottom: 12 }}>Which area are you usually in?</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {AREAS.map((a) => {
            const on = a === area;
            return (
              <Pressable key={a} onPress={() => setArea(a)} style={{ paddingHorizontal: 16, paddingVertical: 11, borderRadius: 22, backgroundColor: on ? INK : CHIP }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: on ? "#fff" : GRAY }}>{a}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ fontSize: 14, fontWeight: "700", color: INK, marginTop: 34, marginBottom: 12 }}>What are you into?</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {INTERESTS.map((i) => {
            const on = picked.includes(i.key);
            return (
              <Pressable key={i.key} onPress={() => toggle(i.key)} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 22, backgroundColor: on ? INK : CHIP }}>
                <Text style={{ fontSize: 16 }}>{i.emoji}</Text>
                <Text style={{ fontSize: 14, fontWeight: "700", color: on ? "#fff" : GRAY }}>{i.key}</Text>
                {on && <Ionicons name="checkmark" size={15} color="#fff" />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 28, gap: 8 }}>
        <Pressable onPress={next} style={{ backgroundColor: INK, borderRadius: 30, paddingVertical: 18, alignItems: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff" }}>Continue</Text>
        </Pressable>
        <Pressable onPress={next} style={{ paddingVertical: 8, alignItems: "center" }}>
          <Text style={{ fontSize: 14, color: GRAY, fontWeight: "600" }}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}
