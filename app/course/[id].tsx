import { Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { COURSES } from "@/data/courses";
import { useStore } from "@/hooks/use-store";
import { enrollCourse } from "@/utils/store";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const store = useStore();
  const course = COURSES.find((c) => c.id === id);

  if (!course) return null;

  const isEnrolled = store.enrolledCourses.includes(course.id);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Hero */}
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 28, backgroundColor: course.color + "18" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="arrow-back" size={20} color={C.text} />
          </Pressable>
          <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="bookmark-outline" size={20} color={C.text} />
          </Pressable>
        </View>

        <Text style={{ fontSize: 44 }}>{course.emoji}</Text>
        <View style={{ backgroundColor: course.color + "33", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start", marginTop: 12, marginBottom: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: course.color }}>{course.category}</Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: "900", color: C.text, lineHeight: 32 }}>{course.title}</Text>
        <Text style={{ fontSize: 14, color: C.textSec, marginTop: 6 }}>by {course.instructor}</Text>

        {/* Stats */}
        <View style={{ flexDirection: "row", gap: 20, marginTop: 20 }}>
          {[
            { icon: "time-outline", label: course.duration },
            { icon: "book-outline", label: `${course.lessons} Lessons` },
            { icon: "star", label: `${course.rating}` },
            { icon: "people-outline", label: `${course.students.toLocaleString()}` },
          ].map((stat) => (
            <View key={stat.label} style={{ alignItems: "center", gap: 4 }}>
              <Ionicons name={stat.icon as any} size={16} color={course.color} />
              <Text style={{ fontSize: 12, color: C.textSec, fontWeight: "600" }}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Description */}
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: C.text }}>About this course</Text>
          <Text style={{ fontSize: 14, color: C.textSec, lineHeight: 22 }}>{course.description}</Text>
        </View>

        {/* Tags */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {course.tags.map((tag) => (
            <View key={tag} style={{ backgroundColor: course.color + "22", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: course.color }}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Lessons */}
        <View style={{ gap: 14 }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: C.text }}>Lessons</Text>
          {course.lessonList.map((lesson, i) => {
            const isDone = store.completedLessons.includes(lesson.id);
            return (
              <Pressable
                key={lesson.id}
                onPress={() => router.push(`/lesson/${lesson.id}?courseId=${course.id}`)}
                style={{ backgroundColor: C.surface, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1, borderColor: isDone ? course.color + "44" : C.border }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDone ? course.color : C.surface2, alignItems: "center", justifyContent: "center" }}>
                  {isDone
                    ? <Ionicons name="checkmark" size={18} color="#000" />
                    : <Text style={{ fontSize: 14, fontWeight: "700", color: C.textSec }}>{i + 1}</Text>
                  }
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>{lesson.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <Ionicons name={lesson.type === "quiz" ? "help-circle-outline" : lesson.type === "audio" ? "musical-notes-outline" : "document-text-outline"} size={12} color={C.textSec} />
                    <Text style={{ fontSize: 12, color: C.textSec }}>{lesson.duration}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={C.textDim} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: insets.bottom + 16, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border }}>
        <Pressable
          onPress={() => {
            if (!isEnrolled) enrollCourse(course.id);
            router.push(`/lesson/${course.lessonList[0].id}?courseId=${course.id}`);
          }}
          style={{ backgroundColor: course.color, borderRadius: 16, paddingVertical: 18, alignItems: "center" }}
        >
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#000" }}>
            {isEnrolled ? "Continue Course →" : "Start course now"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
