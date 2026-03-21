import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C } from "@/constants/colors";

const { width: W } = Dimensions.get("window");

const SLIDES = [
  {
    emoji: "✏️",
    quote: "Design is not just what it looks like. Design is how it works.",
    author: "Steve Jobs",
    bg: C.purple + "20",
    accent: C.purple,
    tagline: "Start mastering design today and level up your creative skills.",
  },
  {
    emoji: "🎯",
    quote: "Good design is obvious. Great design is transparent.",
    author: "Joe Sparano",
    bg: C.accent + "15",
    accent: C.accent,
    tagline: "Unlock your potential with Forma. Learn from the best.",
  },
  {
    emoji: "🚀",
    quote: "Every great design begins with an even better story.",
    author: "Lorinda Mamo",
    bg: C.orange + "20",
    accent: C.orange,
    tagline: "Join 10,000+ designers already learning with Forma.",
  },
];

export default function SlidesScreen() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goNext = () => {
    if (active < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (active + 1) * W, animated: true });
      setActive(active + 1);
    } else {
      router.push("/(onboarding)/signup");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingBottom: insets.bottom + 24 }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={{ width: W, flex: 1, padding: 28, paddingTop: insets.top + 40 }}>
            {/* Quote card */}
            <View style={{ flex: 1, backgroundColor: slide.bg, borderRadius: 28, padding: 32, justifyContent: "center", gap: 24 }}>
              <Text style={{ fontSize: 56 }}>{slide.emoji}</Text>
              <Text style={{ fontSize: 26, fontWeight: "800", color: C.text, lineHeight: 34 }}>
                "{slide.quote}"
              </Text>
              <Text style={{ fontSize: 14, color: slide.accent, fontWeight: "600" }}>
                — {slide.author}
              </Text>
            </View>

            {/* Tagline */}
            <View style={{ marginTop: 32, gap: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", color: C.text, lineHeight: 28 }}>
                {slide.tagline}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots + button */}
      <View style={{ paddingHorizontal: 28, gap: 24 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                height: 4,
                width: i === active ? 32 : 8,
                borderRadius: 2,
                backgroundColor: i === active ? C.accent : C.surface3,
              }}
            />
          ))}
        </View>
        <Pressable
          onPress={goNext}
          style={{ backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18, alignItems: "center" }}
        >
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#000" }}>
            {active === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
