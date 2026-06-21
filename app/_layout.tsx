import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";
import { C } from "@/constants/colors";

// Phone-width column centered on wide screens (web/tablet); full width on phones.
const APP_MAX_WIDTH = 480;

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center" }}>
      <GestureHandlerRootView style={{ flex: 1, width: "100%", maxWidth: APP_MAX_WIDTH, backgroundColor: C.bg }}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="happening/[id]" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="operator" options={{ animation: "slide_from_right" }} />
        </Stack>
      </GestureHandlerRootView>
    </View>
  );
}
