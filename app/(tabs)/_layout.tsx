import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import { C } from "@/constants/colors";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60 + insets.bottom,
          borderTopWidth: 0.5,
          borderTopColor: "rgba(255,255,255,0.1)",
          backgroundColor: "transparent",
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700", marginTop: 2 },
        tabBarItemStyle: { paddingVertical: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Now",
          tabBarIcon: ({ color }) => <Ionicons name="flame" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Ionicons name="compass" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: "Check in",
          tabBarIcon: () => (
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: C.accent,
                alignItems: "center",
                justifyContent: "center",
                marginTop: -6,
              }}
            >
              <Ionicons name="location" size={24} color="#000" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <Ionicons name="bookmark" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
