import { FlatList, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { COURSES } from "@/data/courses";

const CATEGORIES = ["All", "UI Design", "Typography", "Color", "Tools", "Process", "Branding"];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = COURSES.filter((c) => {
    const matchCat = cat === "All" || c.category === cat;
    const matchQ = query.length < 1 || c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, paddingBottom: 16, gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: C.text }}>Explore</Text>
          <Ionicons name="options-outline" size={22} color={C.textSec} />
        </View>

        {/* Search */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 14, gap: 10, borderWidth: 1, borderColor: C.border }}>
          <Ionicons name="search" size={18} color={C.textSec} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search courses..."
            placeholderTextColor={C.textDim}
            style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 14 }}
          />
        </View>

        {/* Category pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24 }} contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCat(c)}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: cat === c ? C.accent : C.surface, borderWidth: cat === c ? 0 : 1, borderColor: C.border }}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: cat === c ? "#000" : C.textSec }}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, gap: 14 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/course/${item.id}`)}
            style={{ backgroundColor: C.surface, borderRadius: 20, padding: 18, flexDirection: "row", gap: 16, alignItems: "center", borderWidth: 1, borderColor: C.border }}
          >
            <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: item.color + "22", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }} numberOfLines={1}>{item.title}</Text>
              <Text style={{ fontSize: 12, color: C.textSec }} numberOfLines={1}>{item.instructor} · {item.duration}</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ backgroundColor: item.color + "22", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: item.color }}>{item.level}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="star" size={11} color={C.accent} />
                  <Text style={{ fontSize: 11, fontWeight: "600", color: C.accent }}>{item.rating}</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={C.textDim} />
          </Pressable>
        )}
      />
    </View>
  );
}
