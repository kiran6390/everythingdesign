import { Dimensions, Image, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { setOnboarded } from "@/utils/store";
import { setFlag, ONBOARDED_KEY } from "@/utils/persist";

const W = Math.min(Dimensions.get("window").width, 480); // clamp to the app column
const HERO_H = 430;
const U = (id: string) => `https://images.unsplash.com/${id}?w=400&q=70&auto=format&fit=crop`;

const SLIDES = [
  {
    headline: "Mumbai,\nright now.",
    sub: "See what's popping tonight — clubs, gigs, food, parties. The city's pulse, in your pocket. 🔥",
    images: ["photo-1566737236500-c8ac43014a67", "photo-1470229722913-7c0e2dbbafd3", "photo-1504674900247-0877df9cc836", "photo-1545128485-c400e7702796"],
    deco: ["✿", "🦋", "✦"],
  },
  {
    headline: "Know before\nyou go.",
    sub: "Ladies' night, free drinks, live music — or packed? Get the real vibe from people who're already there. 💃",
    images: ["photo-1517457373958-b7bdd4587205", "photo-1511192336575-5a79af67a629", "photo-1566737236500-c8ac43014a67", "photo-1470229722913-7c0e2dbbafd3"],
    deco: ["✨", "🍸", "✦"],
  },
  {
    headline: "Find your\nscene.",
    sub: "Save spots, check in, and never miss the night everyone's talking about. ✨",
    images: ["photo-1504674900247-0877df9cc836", "photo-1545128485-c400e7702796", "photo-1511192336575-5a79af67a629", "photo-1517457373958-b7bdd4587205"],
    deco: ["🌸", "🦋", "✦"],
  },
];

const SPOTS = [
  { size: 150, left: 30, top: 56 },
  { size: 124, left: W - 124 - 32, top: 26 },
  { size: 116, left: 72, top: 232 },
  { size: 100, left: W - 100 - 52, top: 224 },
];
const DECO_POS = [
  { left: 16, top: 188, size: 28 },
  { left: W - 74, top: 168, size: 24 },
  { left: W / 2 - 6, top: 26, size: 20 },
];

function Collage({ images, deco }: { images: string[]; deco: string[] }) {
  return (
    <View style={{ width: W, height: HERO_H }}>
      <LinearGradient
        colors={["#FFE0C2", "#FFD4E6", "#DFF6E6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: -40, left: -20, right: -20, height: HERO_H + 40, borderBottomLeftRadius: 200, borderBottomRightRadius: 200, opacity: 0.9 }}
      />
      {images.map((img, i) => {
        const s = SPOTS[i];
        return (
          <View
            key={i}
            style={{
              position: "absolute", left: s.left, top: s.top, width: s.size, height: s.size, borderRadius: s.size / 2,
              borderWidth: 5, borderColor: "#fff", overflow: "hidden",
              shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 14, shadowOffset: { width: 0, height: 8 },
            }}
          >
            <Image source={{ uri: U(img) }} style={{ width: "100%", height: "100%" }} />
          </View>
        );
      })}
      {deco.map((d, i) => (
        <Text key={i} style={{ position: "absolute", left: DECO_POS[i].left, top: DECO_POS[i].top, fontSize: DECO_POS[i].size }}>{d}</Text>
      ))}
    </View>
  );
}

export default function SlidesScreen() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const skip = () => {
    setOnboarded("there");
    setFlag(ONBOARDED_KEY, "1");
    router.replace("/(tabs)");
  };

  const next = () => {
    if (active < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (active + 1) * W, animated: true });
      setActive(active + 1);
    } else {
      router.push("/(onboarding)/setup");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setActive(Math.round(e.nativeEvent.contentOffset.x / W))}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={{ width: W, flex: 1 }}>
            <View style={{ paddingTop: insets.top + 8 }}>
              <Collage images={s.images} deco={s.deco} />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "center" }}>
              <Text style={{ fontSize: 34, fontWeight: "900", color: "#111", lineHeight: 40, letterSpacing: -0.5 }}>{s.headline}</Text>
              <Text style={{ fontSize: 16, color: "#8A8A8E", lineHeight: 23, marginTop: 14 }}>{s.sub}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* SKIP */}
      <Pressable onPress={skip} style={{ position: "absolute", top: insets.top + 14, right: 22, backgroundColor: "rgba(255,255,255,0.75)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#111" }}>SKIP</Text>
      </Pressable>

      {/* dots + continue */}
      <View style={{ paddingHorizontal: 28, paddingBottom: insets.bottom + 20, gap: 22 }}>
        <View style={{ flexDirection: "row", gap: 7, justifyContent: "center" }}>
          {SLIDES.map((_, i) => (
            <View key={i} style={{ width: i === active ? 22 : 7, height: 7, borderRadius: 4, backgroundColor: i === active ? "#111" : "#D8D8DC" }} />
          ))}
        </View>
        <Pressable onPress={next} style={{ backgroundColor: "#111", borderRadius: 30, paddingVertical: 18, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff" }}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
