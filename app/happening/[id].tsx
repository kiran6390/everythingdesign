import { Linking, Pressable, ScrollView, Share, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { HAPPENINGS } from "@/data/happenings";
import { useStore } from "@/hooks/use-store";
import { toggleSave, toggleGoing } from "@/utils/store";

export default function HappeningDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const store = useStore();

  const all = [...store.shared, ...HAPPENINGS];
  const item = all.find((h) => h.id === id);
  if (!item) return null;

  const isSaved = store.saved.includes(item.id);
  const isGoing = store.going.includes(item.id);

  const openMaps = () => {
    const q = encodeURIComponent(item.address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  const onShare = () => {
    Share.share({
      message: `${item.emoji} ${item.title}\n${item.venue}, ${item.neighborhood} · ${item.when} · ${item.price}\n\nFound on GetIn`,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Hero */}
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 28, backgroundColor: item.color + "18" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="arrow-back" size={20} color={C.text} />
          </Pressable>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable onPress={onShare} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="share-outline" size={20} color={C.text} />
            </Pressable>
            <Pressable onPress={() => toggleSave(item.id)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={20} color={isSaved ? C.accent : C.text} />
            </Pressable>
          </View>
        </View>

        <Text style={{ fontSize: 52 }}>{item.emoji}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 8 }}>
          <View style={{ backgroundColor: item.color + "33", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: item.color }}>{item.category}</Text>
          </View>
          <View style={{ backgroundColor: C.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: C.textSec }}>{item.vibe}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 28, fontWeight: "900", color: C.text, lineHeight: 34 }}>{item.title}</Text>
        <Text style={{ fontSize: 14, color: C.textSec, marginTop: 6 }}>Hosted by {item.host}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Quick facts */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {[
            { icon: "time-outline", label: item.when },
            { icon: "cash-outline", label: item.price },
            { icon: "people-outline", label: `${item.hype + (isGoing ? 1 : 0)} going` },
          ].map((f) => (
            <View key={f.label} style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: C.surface, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: C.border }}>
              <Ionicons name={f.icon as any} size={15} color={item.color} />
              <Text style={{ fontSize: 13, fontWeight: "700", color: C.text }}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Location */}
        <Pressable onPress={openMaps} style={{ backgroundColor: C.surface, borderRadius: 18, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1, borderColor: C.border }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: item.color + "22", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="location" size={20} color={item.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "800", color: C.text }}>{item.venue}</Text>
            <Text style={{ fontSize: 12, color: C.textSec }}>{item.neighborhood} · Tap for directions</Text>
          </View>
          <Ionicons name="navigate" size={18} color={item.color} />
        </Pressable>

        {/* About */}
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: C.text }}>The lowdown</Text>
          <Text style={{ fontSize: 14, color: C.textSec, lineHeight: 22 }}>{item.description}</Text>
        </View>

        {/* Tags */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {item.tags.map((tag) => (
            <View key={tag} style={{ backgroundColor: item.color + "22", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: item.color }}>#{tag.replace(/\s/g, "")}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: insets.bottom + 16, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border, flexDirection: "row", gap: 12 }}>
        <Pressable onPress={openMaps} style={{ width: 56, borderRadius: 16, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.border }}>
          <Ionicons name="navigate-outline" size={22} color={C.text} />
        </Pressable>
        <Pressable
          onPress={() => toggleGoing(item.id)}
          style={{ flex: 1, backgroundColor: isGoing ? C.surface : item.color, borderRadius: 16, paddingVertical: 18, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8, borderWidth: isGoing ? 1 : 0, borderColor: item.color }}
        >
          <Ionicons name={isGoing ? "checkmark-circle" : "flame"} size={18} color={isGoing ? item.color : "#000"} />
          <Text style={{ fontSize: 17, fontWeight: "800", color: isGoing ? item.color : "#000" }}>
            {isGoing ? "You're going" : "I'm going"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
