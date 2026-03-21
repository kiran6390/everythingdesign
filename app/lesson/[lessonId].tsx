import { Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { C } from "@/constants/colors";
import { COURSES } from "@/data/courses";
import { useStore } from "@/hooks/use-store";
import { completeLesson } from "@/utils/store";

function renderContent(text: string, color: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <Text key={i} style={{ fontSize: 16, fontWeight: "800", color, marginTop: 8, marginBottom: 4 }}>
          {line.replace(/\*\*/g, "")}
        </Text>
      );
    }
    if (line.startsWith("• ")) {
      return (
        <View key={i} style={{ flexDirection: "row", gap: 10, marginVertical: 3 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, marginTop: 8 }} />
          <Text style={{ flex: 1, fontSize: 15, color: C.textSec, lineHeight: 24 }}>{line.slice(2)}</Text>
        </View>
      );
    }
    if (line.trim() === "") return <View key={i} style={{ height: 8 }} />;
    return (
      <Text key={i} style={{ fontSize: 15, color: C.textSec, lineHeight: 24 }}>{line}</Text>
    );
  });
}

function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioPlayer({ audioUrl, color }: { audioUrl: string; color: string }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  async function togglePlay() {
    if (isLoading) return;
    if (!soundRef.current) {
      setIsLoading(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setPosition(status.positionMillis ?? 0);
            setDuration(status.durationMillis ?? 0);
            setIsPlaying(status.isPlaying);
          }
        }
      );
      soundRef.current = sound;
      setIsLoading(false);
    } else {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    }
  }

  async function seek(forward: boolean) {
    if (!soundRef.current) return;
    const newPos = Math.max(0, Math.min(duration, position + (forward ? 15000 : -15000)));
    await soundRef.current.setPositionAsync(newPos);
  }

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={{ backgroundColor: color + "15", borderRadius: 24, padding: 24, gap: 20, borderWidth: 1, borderColor: color + "33" }}>
      {/* Waveform visual */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3, height: 40 }}>
        {Array.from({ length: 28 }).map((_, i) => {
          const heights = [16, 24, 32, 20, 36, 28, 40, 18, 30, 24, 38, 20, 32, 26, 40, 18, 28, 36, 22, 34, 20, 30, 38, 24, 16, 28, 32, 20];
          const h = heights[i] ?? 20;
          const filled = i / 28 <= progress;
          return (
            <View
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                backgroundColor: filled ? color : color + "40",
              }}
            />
          );
        })}
      </View>

      {/* Time */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 12, color: color, fontWeight: "600" }}>{formatTime(position)}</Text>
        <Text style={{ fontSize: 12, color: C.textSec }}>{formatTime(duration)}</Text>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 32 }}>
        <Pressable onPress={() => seek(false)}>
          <Ionicons name="play-back" size={28} color={C.textSec} />
        </Pressable>

        <Pressable
          onPress={togglePlay}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: color,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={isLoading ? "hourglass" : isPlaying ? "pause" : "play"}
            size={28}
            color="#000"
          />
        </Pressable>

        <Pressable onPress={() => seek(true)}>
          <Ionicons name="play-forward" size={28} color={C.textSec} />
        </Pressable>
      </View>
    </View>
  );
}

export default function LessonScreen() {
  const { lessonId, courseId } = useLocalSearchParams<{ lessonId: string; courseId: string }>();
  const insets = useSafeAreaInsets();
  const store = useStore();
  const course = COURSES.find((c) => c.id === courseId);
  const lesson = course?.lessonList.find((l) => l.id === lessonId);

  if (!course || !lesson) return null;

  const lessonIndex = course.lessonList.findIndex((l) => l.id === lessonId);
  const nextLesson = course.lessonList[lessonIndex + 1];
  const isDone = store.completedLessons.includes(lesson.id);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 16, flexDirection: "row", alignItems: "center", gap: 16, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: C.textSec }}>{course.title}</Text>
          <Text style={{ fontSize: 16, fontWeight: "800", color: C.text }} numberOfLines={1}>{lesson.title}</Text>
        </View>
        <View style={{ backgroundColor: course.color + "22", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: course.color }}>{lesson.duration}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ height: 3, backgroundColor: C.surface3 }}>
        <View style={{ height: "100%", width: `${((lessonIndex + 1) / course.lessonList.length) * 100}%`, backgroundColor: course.color }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Lesson type badge */}
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <View style={{ backgroundColor: course.color + "22", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: "row", gap: 6, alignItems: "center" }}>
            <Ionicons name={lesson.type === "quiz" ? "help-circle" : lesson.type === "audio" ? "musical-notes" : "document-text"} size={14} color={course.color} />
            <Text style={{ fontSize: 12, fontWeight: "700", color: course.color, textTransform: "capitalize" }}>{lesson.type}</Text>
          </View>
          <Text style={{ fontSize: 12, color: C.textSec }}>Lesson {lessonIndex + 1} of {course.lessonList.length}</Text>
        </View>

        {/* Title */}
        <Text style={{ fontSize: 28, fontWeight: "900", color: C.text, lineHeight: 36 }}>{lesson.title}</Text>

        {/* Audio Player */}
        {lesson.type === "audio" && lesson.audioUrl && (
          <AudioPlayer audioUrl={lesson.audioUrl} color={course.color} />
        )}

        {/* Content */}
        <View style={{ gap: 4 }}>
          {renderContent(lesson.content, course.color)}
        </View>

        {isDone && (
          <View style={{ backgroundColor: course.color + "22", borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: course.color + "44" }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: course.color, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="checkmark" size={18} color="#000" />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: C.text }}>Lesson completed!</Text>
              <Text style={{ fontSize: 12, color: C.textSec }}>+20 XP earned</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, paddingBottom: insets.bottom + 16, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border, flexDirection: "row", gap: 12 }}>
        {!isDone && (
          <Pressable
            onPress={() => completeLesson(lesson.id)}
            style={{ flex: 1, backgroundColor: C.surface, borderRadius: 16, paddingVertical: 16, alignItems: "center", borderWidth: 1, borderColor: C.border }}
          >
            <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>Mark Complete ✓</Text>
          </Pressable>
        )}
        {nextLesson ? (
          <Pressable
            onPress={() => router.replace(`/lesson/${nextLesson.id}?courseId=${courseId}`)}
            style={{ flex: 1, backgroundColor: course.color, borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
          >
            <Text style={{ fontSize: 15, fontWeight: "800", color: "#000" }}>Next Lesson →</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.back()}
            style={{ flex: 1, backgroundColor: course.color, borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
          >
            <Text style={{ fontSize: 15, fontWeight: "800", color: "#000" }}>Finish Course 🎉</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
