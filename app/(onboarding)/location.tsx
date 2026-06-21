import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { detectLocation, setOnboarded } from "@/utils/store";
import { setFlag, ONBOARDED_KEY } from "@/utils/persist";

const INK = "#111";
const GRAY = "#8A8A8E";

export default function LocationPrimer() {
  const insets = useSafeAreaInsets();

  const finish = () => {
    setOnboarded("there");
    setFlag(ONBOARDED_KEY, "1");
    router.replace("/(tabs)");
  };

  const enable = async () => {
    await detectLocation();
    finish();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top, paddingBottom: insets.bottom + 24, paddingHorizontal: 28 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 26 }}>
        <LinearGradient colors={["#FFE0C2", "#FFD4E6", "#DFF6E6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 130, height: 130, borderRadius: 65, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="location" size={44} color={INK} />
          </View>
        </LinearGradient>
        <View style={{ gap: 12, alignItems: "center" }}>
          <Text style={{ fontSize: 30, fontWeight: "900", color: INK, textAlign: "center", lineHeight: 36, letterSpacing: -0.5 }}>See what's popping{"\n"}right around you</Text>
          <Text style={{ fontSize: 15, color: GRAY, textAlign: "center", lineHeight: 22, maxWidth: 300 }}>
            Allow location so GetIn can show the nights out, clubs and check-ins closest to you — live.
          </Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Pressable onPress={enable} style={{ backgroundColor: INK, borderRadius: 30, paddingVertical: 18, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}>
          <Ionicons name="navigate" size={18} color="#fff" />
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff" }}>Enable location</Text>
        </Pressable>
        <Pressable onPress={finish} style={{ paddingVertical: 14, alignItems: "center" }}>
          <Text style={{ fontSize: 15, color: GRAY, fontWeight: "600" }}>Not now — I'll pick my area</Text>
        </Pressable>
      </View>
    </View>
  );
}
