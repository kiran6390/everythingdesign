import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { CLUBS, PROGRAMME_TYPES, PROGRAMME_META, VIBES, VIBE_META, type ProgrammeType, type Vibe } from "@/data/happenings";
import { addProgramme } from "@/utils/store";

export default function OperatorScreen() {
  const insets = useSafeAreaInsets();
  const [venueId, setVenueId] = useState<string | null>(null);
  const [type, setType] = useState<ProgrammeType | null>(null);
  const [vibe, setVibe] = useState<Vibe>("filling");
  const [note, setNote] = useState("");

  const publish = () => {
    if (!venueId || !type) {
      Alert.alert("Almost there", "Pick a venue and what's on tonight.");
      return;
    }
    addProgramme({ id: `pr-${Date.now()}`, venueId, type, vibe, note: note.trim() || undefined, by: "You" });
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
          <Text style={{ fontSize: 12, color: C.textSec }}>Drop tonight's vibe — only you & your crew see this screen</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 140 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Venue */}
        <Label>Venue</Label>
        <View style={{ gap: 10 }}>
          {CLUBS.map((c) => {
            const active = c.id === venueId;
            return (
              <Pressable key={c.id} onPress={() => setVenueId(c.id)} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 10, borderRadius: 14, backgroundColor: active ? C.accent : C.surface }}>
                <Image source={{ uri: c.image }} style={{ width: 40, height: 40, borderRadius: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "800", color: active ? "#000" : C.text }}>{c.name}</Text>
                  <Text style={{ fontSize: 12, color: active ? "#222" : C.textSec }}>{c.area}</Text>
                </View>
                {active && <Ionicons name="checkmark-circle" size={20} color="#000" />}
              </Pressable>
            );
          })}
        </View>

        {/* What's on */}
        <Label>What's on tonight?</Label>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {PROGRAMME_TYPES.map((t) => {
            const active = t === type;
            return (
              <Pressable key={t} onPress={() => setType(t)} style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, backgroundColor: active ? C.accent : C.surface, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 14 }}>{PROGRAMME_META[t].emoji}</Text>
                <Text style={{ fontSize: 13, fontWeight: "700", color: active ? "#000" : C.textSec }}>{PROGRAMME_META[t].label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Vibe */}
        <Label>How packed is it?</Label>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {VIBES.map((v) => {
            const active = v === vibe;
            const meta = VIBE_META[v];
            return (
              <Pressable key={v} onPress={() => setVibe(v)} style={{ flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center", backgroundColor: active ? meta.color : C.surface }}>
                <Text style={{ fontSize: 18 }}>{meta.emoji}</Text>
                <Text style={{ fontSize: 12, fontWeight: "800", color: active ? "#000" : C.textSec, marginTop: 4 }}>{meta.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Note */}
        <Label>Note (optional)</Label>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Free entry for ladies till 11"
          placeholderTextColor={C.textDim}
          style={{ backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: C.text }}
        />
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
