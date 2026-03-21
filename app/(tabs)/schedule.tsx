import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { SCHEDULE } from "@/data/courses";

export default function ScheduleScreen() {
  const insets = useSafeAreaInsets();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 3 + i);
    return d;
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, gap: 24 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: C.text }}>Schedule</Text>
          <Ionicons name="calendar-outline" size={22} color={C.textSec} />
        </View>

        {/* Today's focus */}
        <View style={{ backgroundColor: C.accent + "15", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.accent + "33" }}>
          <Text style={{ fontSize: 13, color: C.accent, fontWeight: "600", marginBottom: 4 }}>Learning Today</Text>
          <Text style={{ fontSize: 28, fontWeight: "900", color: C.text }}>70s / 30Min</Text>
          <Text style={{ fontSize: 13, color: C.textSec, marginTop: 4 }}>Keep it up! You're on a {7}-day streak 🔥</Text>
        </View>

        {/* Week strip */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {dates.map((d, i) => {
            const isToday = i === 3;
            return (
              <View key={i} style={{ alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 12, color: isToday ? C.accent : C.textSec, fontWeight: "600" }}>{d.getDate()}</Text>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isToday ? C.accent : C.surface, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: isToday ? "#000" : C.textSec }}>{days[d.getDay() === 0 ? 6 : d.getDay() - 1]}</Text>
                </View>
                {isToday && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.accent }} />}
              </View>
            );
          })}
        </View>

        {/* My Schedule */}
        <View style={{ gap: 14 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>My Schedule</Text>
          {SCHEDULE.map((item, index) => (
            <View
              key={item.id}
              style={{
                backgroundColor: C.surface,
                borderRadius: 18,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                borderWidth: 1,
                borderColor: C.border,
                borderLeftWidth: 4,
                borderLeftColor: item.color,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: C.textSec, marginTop: 4 }}>{item.time}</Text>
              </View>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: item.color + "22", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="play" size={14} color={item.color} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
