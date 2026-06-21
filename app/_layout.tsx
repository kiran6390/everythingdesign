import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { C } from "@/constants/colors";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="happening/[id]" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="operator" options={{ animation: "slide_from_right" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
