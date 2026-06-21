import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { useStore } from "@/hooks/use-store";
import { PEOPLE } from "@/data/happenings";
import { supabase } from "@/lib/supabase";

const MENU = [
  { icon: "megaphone-outline", label: "Operator mode", color: C.accent },
  { icon: "bookmark-outline", label: "Saved", color: C.purple },
  { icon: "location-outline", label: "Change neighborhood", color: C.teal },
  { icon: "notifications-outline", label: "Notifications", color: C.orange },
  { icon: "shield-outline", label: "Privacy", color: C.pink },
  { icon: "help-circle-outline", label: "Help & Support", color: C.accent },
  { icon: "log-out-outline", label: "Log Out", color: "#888" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const store = useStore();

  const handleMenu = async (label: string) => {
    if (label === "Operator mode") router.push("/operator");
    if (label === "Saved") router.push("/(tabs)/schedule");
    if (label === "Log Out") {
      await supabase.auth.signOut();
      router.replace("/(onboarding)");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, gap: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: C.text }}>Profile</Text>
          <Ionicons name="settings-outline" size={22} color={C.textSec} />
        </View>

        {/* Profile card */}
        <View style={{ backgroundColor: C.surface, borderRadius: 24, padding: 24, alignItems: "center", gap: 16, borderWidth: 1, borderColor: C.border }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: C.accent + "55" }}>
            <Text style={{ fontSize: 32, fontWeight: "900", color: "#000" }}>{(store.userName[0] || "?").toUpperCase()}</Text>
          </View>
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>{store.userName}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="location" size={13} color={C.accent} />
              <Text style={{ fontSize: 14, color: C.textSec }}>Mumbai · {store.neighborhood}</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={{ flexDirection: "row", width: "100%", borderTopWidth: 1, borderTopColor: C.border, paddingTop: 16, justifyContent: "space-around" }}>
            {[
              { label: "Saved", value: store.saved.length },
              { label: "Going", value: store.going.length },
              { label: "Shared", value: store.shared.filter((h) => h.mine).length },
            ].map((stat) => (
              <View key={stat.label} style={{ alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: C.text }}>{stat.value}</Text>
                <Text style={{ fontSize: 11, color: C.textSec }}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Friends out */}
        <View style={{ gap: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>Out tonight</Text>
            <Text style={{ fontSize: 13, color: C.accent, fontWeight: "600" }}>Find friends</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {PEOPLE.map((m) => (
              <View key={m.id} style={{ alignItems: "center", gap: 6 }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: m.color + "22", borderWidth: 2, borderColor: m.color, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: m.color }}>{m.initial}</Text>
                </View>
                <Text style={{ fontSize: 11, color: C.textSec }}>{m.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={{ backgroundColor: C.surface, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: C.border }}>
          {MENU.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => handleMenu(item.label)}
              style={{ flexDirection: "row", alignItems: "center", padding: 18, gap: 14, borderBottomWidth: i < MENU.length - 1 ? 1 : 0, borderBottomColor: C.border }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: item.color + "22", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={{ flex: 1, fontSize: 15, fontWeight: "600", color: item.label === "Log Out" ? C.textSec : C.text }}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={C.textDim} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
