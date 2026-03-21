import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { COURSES } from "@/data/courses";
import { useStore } from "@/hooks/use-store";

const CATEGORIES = ["All", "UI/UX", "Type", "Color", "Tools", "Brand"];

const MOCK_AVATARS = ["A", "B", "C", "D", "E"];
const AVATAR_COLORS = [C.purple, C.orange, C.pink, C.teal, "#888"];

function OverlappingAvatars({ count = 3 }: { count?: number }) {
  const shown = MOCK_AVATARS.slice(0, 3);
  const extra = count - 3;
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {shown.map((letter, i) => (
        <View
          key={i}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: AVATAR_COLORS[i],
            alignItems: "center",
            justifyContent: "center",
            marginLeft: i === 0 ? 0 : -10,
            borderWidth: 2,
            borderColor: C.accent, // border matches card bg
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "800", color: "#000" }}>
            {letter}
          </Text>
        </View>
      ))}
      {extra > 0 && (
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#222",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: -10,
            borderWidth: 2,
            borderColor: C.accent,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "800", color: "#FFF" }}>
            +{extra}
          </Text>
        </View>
      )}
    </View>
  );
}

function CourseCard({
  course,
  index,
}: {
  course: (typeof COURSES)[0];
  index: number;
}) {
  const isYellow = index === 0;
  const bg = isYellow ? C.accent : C.surface;
  const textPrimary = isYellow ? "#000" : C.text;
  const textSec = isYellow ? "#333" : C.textSec;
  const borderColor = isYellow ? "transparent" : C.border;

  return (
    <Pressable
      onPress={() => router.push(`/course/${course.id}`)}
      style={{
        backgroundColor: bg,
        borderRadius: 24,
        padding: 20,
        gap: 14,
        borderWidth: 1,
        borderColor,
      }}
    >
      {/* Top row */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: isYellow ? "#000" : C.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}>{course.emoji}</Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: "700", color: textSec, letterSpacing: 1 }}>
            COURSE {index + 1}
          </Text>
        </View>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: isYellow ? "#000" : C.surface2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: isYellow ? "#FFF" : C.textSec, fontSize: 18, lineHeight: 20 }}>
            ···
          </Text>
        </View>
      </View>

      {/* Subtitle */}
      <Text style={{ fontSize: 13, color: textSec }}>
        {course.subtitle}
      </Text>

      {/* Main title + level + teacher */}
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text style={{ fontSize: 30, fontWeight: "900", color: textPrimary, lineHeight: 34 }}>
            {course.title.split(" ")[0]}
          </Text>
          <View
            style={{
              backgroundColor: isYellow ? "#000" : C.surface2,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
              marginTop: 4,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: isYellow ? C.accent : C.textSec }}>
              {course.level}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 30, fontWeight: "900", color: textPrimary, lineHeight: 34 }}>
          {course.title.split(" ").slice(1).join(" ")}
        </Text>
      </View>

      {/* Stats */}
      <Text style={{ fontSize: 13, color: textSec }}>
        {course.duration}{"   "}⭐ {course.rating} Rating
      </Text>

      {/* Bottom: avatars + CTA */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <OverlappingAvatars count={course.students > 1000 ? course.students % 10 + 3 : 3} />
        <Pressable
          onPress={() => router.push(`/course/${course.id}`)}
          style={{
            backgroundColor: isYellow ? "#000" : C.accent,
            borderRadius: 24,
            paddingHorizontal: 20,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "800", color: isYellow ? C.accent : "#000" }}>
            {index === 0 ? "Join Now" : "Start Now"}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={isYellow ? C.accent : "#000"} />
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [selectedCat, setSelectedCat] = useState("All");

  const filtered =
    selectedCat === "All"
      ? COURSES
      : COURSES.filter((c) => c.category.toLowerCase().includes(selectedCat.toLowerCase()) || c.tags.some((t) => t.toLowerCase().includes(selectedCat.toLowerCase())));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 24,
            paddingBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: C.accent,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: C.accent + "66",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "900", color: "#000" }}>
                {store.userName[0]}
              </Text>
            </View>
            <Text style={{ fontSize: 30, fontWeight: "900", color: C.text }}>
              Hi, {store.userName}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/explore")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: C.surface,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <Ionicons name="search" size={20} color={C.text} />
          </Pressable>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 24, marginBottom: 20 }} />

        {/* My Course + search */}
        <View
          style={{
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "900", color: C.text }}>
            My Course
          </Text>
        </View>

        {/* Category pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === selectedCat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCat(cat)}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isActive ? C.text : C.surface,
                  borderWidth: 1,
                  borderColor: isActive ? C.text : C.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: isActive ? C.bg : C.textSec,
                  }}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Course cards */}
        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          {(filtered.length > 0 ? filtered : COURSES).map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
