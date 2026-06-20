import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";
import { C } from "@/constants/colors";

function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  if (focused) {
    return (
      <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={name} size={21} color="#000" />
      </View>
    );
  }
  return <Ionicons name={name} size={22} color="rgba(255,255,255,0.55)" />;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 24,
          right: 24,
          bottom: insets.bottom > 0 ? insets.bottom : 16,
          height: 64,
          borderRadius: 32,
          backgroundColor: C.surface,
          borderTopWidth: 0,
          paddingHorizontal: 8,
          // float
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        },
        tabBarItemStyle: { height: 64 },
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon name="flame" focused={focused} /> }} />
      <Tabs.Screen name="explore" options={{ tabBarIcon: ({ focused }) => <TabIcon name="compass" focused={focused} /> }} />
      <Tabs.Screen name="checkin" options={{ tabBarIcon: ({ focused }) => <TabIcon name="location" focused={focused} /> }} />
      <Tabs.Screen name="schedule" options={{ tabBarIcon: ({ focused }) => <TabIcon name="heart" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} /> }} />
    </Tabs>
  );
}
