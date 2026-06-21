import { useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { CLUBS, PROGRAMME_TYPES, PROGRAMME_META, VIBES, VIBE_META, type ProgrammeType, type Vibe } from "@/data/happenings";
import { addProgramme } from "@/utils/store";
import { googleSearch, type SearchVenue } from "@/lib/placesGoogle";

type Picked = { id: string; name: string; area: string; image?: string };

export default function OperatorScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchVenue[]>([]);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [type, setType] = useState<ProgrammeType | null>(null);
  const [vibe, setVibe] = useState<Vibe>("filling");
  const [note, setNote] = useState("");

  const search = async () => {
    if (query.trim().length < 2) return;
    setSearching(true);
    try {
      const r = await googleSearch(query.trim(), 19.076, 72.877); // Mumbai bias
      setResults(r);
    } catch {
      Alert.alert("Search unavailable", "Google Places isn't connected yet — pick from popular venues below.");
      setResults([]);
    }
    setSearching(false);
  };

  const publish = () => {
    if (!picked || !type) {
      Alert.alert("Almost there", "Pick a venue and what's on tonight.");
      return;
    }
    addProgramme({
      id: `pr-${Date.now()}`,
      venueId: picked.id,
      type,
      vibe,
      note: note.trim() || undefined,
      by: "You",
      venueName: picked.name,
      venueArea: picked.area,
      venueImage: picked.image,
    });
    Alert.alert("Published 🔥", "It's live on the Tonight feed.");
    router.back();
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <Text style={{ fontSize: 13, fontWeight: "700", color: C.textSec, marginBottom: 10, marginTop: 22 }}>{children}</Text>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", gap: 14 }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </Pressable>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "900", color: C.text }}>Operator</Text>
          <Text style={{ fontSize: 12, color: C.textSec }}>Drop tonight's vibe — only you & your crew see this</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Search any venue (Google) */}
        <Label>Find a venue</Label>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 14 }}>
            <Ionicons name="search" size={18} color={C.textSec} />
            <TextInput value={query} onChangeText={setQuery} onSubmitEditing={search} returnKeyType="search" placeholder="Search any Mumbai venue…" placeholderTextColor={C.textDim} style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: C.text }} />
          </View>
          <Pressable onPress={search} style={{ width: 50, borderRadius: 14, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" }}>
            {searching ? <ActivityIndicator color="#000" /> : <Ionicons name="arrow-forward" size={20} color="#000" />}
          </Pressable>
        </View>

        {results.map((r) => {
          const on = picked?.id === r.id;
          return (
            <Pressable key={r.id} onPress={() => setPicked({ id: r.id, name: r.name, area: r.area })} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, backgroundColor: on ? C.accent : C.surface, marginTop: 8 }}>
              <Ionicons name="location" size={18} color={on ? "#000" : C.textSec} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "800", color: on ? "#000" : C.text }} numberOfLines={1}>{r.name}</Text>
                <Text style={{ fontSize: 12, color: on ? "#222" : C.textSec }} numberOfLines={1}>{r.area}</Text>
              </View>
              {on && <Ionicons name="checkmark-circle" size={20} color="#000" />}
            </Pressable>
          );
        })}

        {/* Popular quick-picks */}
        <Label>Or pick a popular spot</Label>
        <View style={{ gap: 10 }}>
          {CLUBS.map((c) => {
            const on = picked?.id === c.id;
            return (
              <Pressable key={c.id} onPress={() => setPicked({ id: c.id, name: c.name, area: c.area, image: c.image })} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 10, borderRadius: 14, backgroundColor: on ? C.accent : C.surface }}>
                <Image source={{ uri: c.image }} style={{ width: 40, height: 40, borderRadius: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "800", color: on ? "#000" : C.text }}>{c.name}</Text>
                  <Text style={{ fontSize: 12, color: on ? "#222" : C.textSec }}>{c.area}</Text>
                </View>
                {on && <Ionicons name="checkmark-circle" size={20} color="#000" />}
              </Pressable>
            );
          })}
        </View>

        {/* What's on */}
        <Label>What's on tonight?</Label>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {PROGRAMME_TYPES.map((t) => {
            const on = t === type;
            return (
              <Pressable key={t} onPress={() => setType(t)} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: on ? C.accent : C.surface, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 14 }}>{PROGRAMME_META[t].emoji}</Text>
                <Text style={{ fontSize: 13, fontWeight: "700", color: on ? "#000" : C.textSec }}>{PROGRAMME_META[t].label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Vibe */}
        <Label>How packed is it?</Label>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {VIBES.map((v) => {
            const on = v === vibe;
            const meta = VIBE_META[v];
            return (
              <Pressable key={v} onPress={() => setVibe(v)} style={{ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: on ? meta.color : C.surface }}>
                <Text style={{ fontSize: 18 }}>{meta.emoji}</Text>
                <Text style={{ fontSize: 12, fontWeight: "800", color: on ? "#000" : C.textSec, marginTop: 4 }}>{meta.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Note */}
        <Label>Note (optional)</Label>
        <TextInput value={note} onChangeText={setNote} placeholder="e.g. Free entry for ladies till 11" placeholderTextColor={C.textDim} style={{ backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: C.text }} />
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: insets.bottom + 16, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border }}>
        <Pressable onPress={publish} style={{ backgroundColor: C.accent, borderRadius: 16, paddingVertical: 17, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}>
          <Ionicons name="megaphone" size={18} color="#000" />
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#000" }}>Publish to Tonight</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
