import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { COURSES } from "@/data/courses";
import { useStore } from "@/hooks/use-store";

const TABS = ["Active", "Score", "Finished", "Paused"];

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const enrolledCourses = COURSES.filter((c) => store.enrolledCourses.includes(c.id));
  const completedCount = store.completedLessons.length;

  // Weekly bar data (mock)
  const weekBars = [40, 65, 30, 80, 55, 90, 45];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxBar = Math.max(...weekBars);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24, gap: 24 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: C.text }}>Learning Progress</Text>
          <Ionicons name="search-outline" size={22} color={C.textSec} />
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: "row", backgroundColor: C.surface, borderRadius: 14, padding: 4, gap: 4 }}>
          {TABS.map((tab, i) => (
            <Pressable key={tab} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: i === 0 ? C.accent : "transparent", alignItems: "center" }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: i === 0 ? "#000" : C.textSec }}>{tab}</Text>
            </Pressable>
          ))}
        </View>

        {/* XP Circle */}
        <View style={{ backgroundColor: C.surface, borderRadius: 24, padding: 28, alignItems: "center", gap: 20, borderWidth: 1, borderColor: C.border }}>
          <View style={{ width: 140, height: 140, borderRadius: 70, borderWidth: 10, borderColor: C.surface3, alignItems: "center", justifyContent: "center", position: "relative" }}>
            <View style={{ position: "absolute", width: 140, height: 140, borderRadius: 70, borderWidth: 10, borderColor: C.accent, borderTopColor: "transparent", borderRightColor: "transparent", transform: [{ rotate: "-30deg" }] }} />
            <Text style={{ fontSize: 42, fontWeight: "900", color: C.text }}>{store.xp}</Text>
            <Text style={{ fontSize: 12, color: C.textSec, fontWeight: "600" }}>XP Points</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 24 }}>
            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: C.accent }}>{store.streak}</Text>
              <Text style={{ fontSize: 12, color: C.textSec }}>Day Streak 🔥</Text>
            </View>
            <View style={{ width: 1, backgroundColor: C.border }} />
            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>{completedCount}</Text>
              <Text style={{ fontSize: 12, color: C.textSec }}>Lessons Done</Text>
            </View>
            <View style={{ width: 1, backgroundColor: C.border }} />
            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>{enrolledCourses.length}</Text>
              <Text style={{ fontSize: 12, color: C.textSec }}>Courses</Text>
            </View>
          </View>

          <Pressable style={{ backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accent, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: C.accent }}>Go to practice Pro →</Text>
          </Pressable>
        </View>

        {/* Weekly chart */}
        <View style={{ backgroundColor: C.surface, borderRadius: 24, padding: 20, gap: 16, borderWidth: 1, borderColor: C.border }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }}>Weekly Activity</Text>
          <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 100 }}>
            {weekBars.map((val, i) => (
              <View key={i} style={{ alignItems: "center", gap: 8, flex: 1 }}>
                <View style={{ width: "60%", height: (val / maxBar) * 80, backgroundColor: i === 5 ? C.accent : C.surface3, borderRadius: 6 }} />
                <Text style={{ fontSize: 11, color: i === 5 ? C.accent : C.textSec, fontWeight: i === 5 ? "700" : "400" }}>{days[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Enrolled courses */}
        <View style={{ gap: 14 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: C.text }}>My Courses</Text>
          {enrolledCourses.map((course) => {
            const done = store.completedLessons.filter((id) => id.startsWith(course.id + "-")).length;
            const pct = Math.round((done / course.lessonList.length) * 100);
            return (
              <View key={course.id} style={{ backgroundColor: C.surface, borderRadius: 20, padding: 18, gap: 12, borderWidth: 1, borderColor: C.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: course.color + "22", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 24 }}>{course.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>{course.title}</Text>
                    <Text style={{ fontSize: 12, color: C.textSec }}>{done}/{course.lessonList.length} lessons · {course.instructor}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: course.color }}>{pct}%</Text>
                </View>
                <View style={{ height: 6, backgroundColor: C.surface3, borderRadius: 3, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: `${pct}%`, backgroundColor: course.color, borderRadius: 3 }} />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
