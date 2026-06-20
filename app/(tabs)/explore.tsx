import { FlatList, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { HAPPENINGS, NEIGHBORHOODS } from "@/data/happenings";
import { useStore } from "@/hooks/use-store";
import { toggleSave } from "@/utils/store";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All");

  const all = [...store.shared, ...HAPPENINGS];
  const filtered = all.filter((h) => {
    const matchArea = area === "All" || h.neighborhood === area;
    const q = query.toLowerCase();
    const matchQ =
      query.length < 1 ||
      h.title.toLowerCase().includes(q) ||
      h.category.toLowerCase().includes(q) ||
      h.neighborhood.toLowerCase().includes(q) ||
      h.venue.toLowerCase().includes(q) ||
      h.tags.some((t) => t.toLowerCase().includes(q));
    return matchArea && matchQ;
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, paddingBottom: 16, gap: 16 }}>
        <Text style={{ fontSize: 26, fontWeight: "900", color: C.text }}>Explore Mumbai</Text>

        {/* Search */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 14, gap: 10, borderWidth: 1, borderColor: C.border }}>
          <Ionicons name="search" size={18} color={C.textSec} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search places, vibes, events..."
            placeholderTextColor={C.textDim}
            style={{ flex: 1, fontSize: 15, color: C.text, paddingVertical: 14 }}
          />
        </View>

        {/* Neighborhood pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24 }} contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
          {NEIGHBORHOODS.map((n) => (
            <Pressable
              key={n}
              onPress={() => setArea(n)}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: area === n ? C.accent : C.surface, borderWidth: 1, borderColor: area === n ? C.accent : C.border }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: area === n ? "#000" : C.textSec }}>{n}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, gap: 14 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingVertical: 60, gap: 8 }}>
            <Text style={{ fontSize: 40 }}>🔍</Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>No matches</Text>
            <Text style={{ fontSize: 13, color: C.textSec }}>Try a different area or search.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSaved = store.saved.includes(item.id);
          return (
            <Pressable
              onPress={() => router.push(`/happening/${item.id}`)}
              style={{ backgroundColor: C.surface, borderRadius: 20, padding: 18, flexDirection: "row", gap: 16, alignItems: "center", borderWidth: 1, borderColor: C.border }}
            >
              <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: item.color + "22", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }} numberOfLines={1}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: C.textSec }} numberOfLines={1}>{item.venue} · {item.neighborhood}</Text>
                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                  <View style={{ backgroundColor: item.color + "22", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: item.color }}>{item.category}</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: C.textSec }}>{item.when}</Text>
                </View>
              </View>
              <Pressable onPress={() => toggleSave(item.id)} hitSlop={10}>
                <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={20} color={isSaved ? C.accent : C.textDim} />
              </Pressable>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
