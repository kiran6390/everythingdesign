import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/constants/colors";
import { setOnboarded } from "@/utils/store";
import { setFlag, ONBOARDED_KEY } from "@/utils/persist";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top, paddingBottom: insets.bottom + 32, paddingHorizontal: 28 }}>
      {/* Illustration area */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {/* Abstract design illustration */}
        <View style={{ width: 260, height: 300, alignItems: "center", justifyContent: "center" }}>
          {/* Main circle */}
          <View style={{ width: 220, height: 220, borderRadius: 110, backgroundColor: C.accent + "15", borderWidth: 1, borderColor: C.accent + "30", alignItems: "center", justifyContent: "center", position: "absolute" }} />
          {/* Inner shapes */}
          <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: C.purple + "30", position: "absolute", top: 30, left: 20 }} />
          <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: C.accent + "25", position: "absolute", bottom: 40, right: 20 }} />
          <View style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: C.orange + "40", position: "absolute", top: 20, right: 30, transform: [{ rotate: "15deg" }] }} />
          {/* Center text */}
          <Text style={{ fontSize: 64, position: "absolute" }}>🌆</Text>
          {/* Sparkles */}
          <Text style={{ position: "absolute", top: 10, right: 50, fontSize: 20 }}>✦</Text>
          <Text style={{ position: "absolute", bottom: 20, left: 40, fontSize: 14 }}>✦</Text>
          <Text style={{ position: "absolute", top: 60, left: 10, fontSize: 10 }}>○</Text>
        </View>
      </View>

      {/* Text content */}
      <View style={{ gap: 16, marginBottom: 40 }}>
        <Text style={{ fontSize: 44, fontWeight: "900", color: C.text, lineHeight: 50, letterSpacing: -1 }}>
          Mumbai.{"\n"}Right{"\n"}now.
        </Text>
        <Text style={{ fontSize: 16, color: C.textSec, lineHeight: 24 }}>
          What's popping tonight — gigs, food, parties, art. Discover it and share it with the city.
        </Text>
      </View>

      {/* CTA buttons */}
      <View style={{ gap: 12 }}>
        <Pressable
          onPress={() => router.push("/(onboarding)/slides")}
          style={{ backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18, alignItems: "center" }}
        >
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#000" }}>Let's start!</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/(onboarding)/login")}
          style={{ borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
        >
          <Text style={{ fontSize: 15, color: C.textSec }}>
            Already have an account?{" "}
            <Text style={{ color: C.accent, fontWeight: "700" }}>Log in</Text>
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setOnboarded("there");
            setFlag(ONBOARDED_KEY, "1");
            router.replace("/(tabs)");
          }}
          style={{ alignItems: "center", paddingVertical: 4 }}
        >
          <Text style={{ fontSize: 14, color: C.textDim, fontWeight: "600" }}>
            Just browsing? Skip for now →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
