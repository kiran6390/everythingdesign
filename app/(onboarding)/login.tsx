import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { setOnboarded } from "@/utils/store";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </Pressable>

        <Text style={{ fontSize: 32, fontWeight: "900", color: C.text, marginBottom: 8 }}>Welcome back{"\n"}to Forma</Text>
        <Text style={{ fontSize: 15, color: C.textSec, marginBottom: 40 }}>Log in to continue your design journey</Text>

        <View style={{ gap: 16, flex: 1 }}>
          {[
            { label: "Email", value: email, set: setEmail, placeholder: "you@email.com", secure: false },
            { label: "Password", value: password, set: setPassword, placeholder: "Your password", secure: true },
          ].map((field) => (
            <View key={field.label} style={{ gap: 8 }}>
              <Text style={{ fontSize: 13, color: C.textSec, fontWeight: "600" }}>{field.label}</Text>
              <TextInput
                value={field.value}
                onChangeText={field.set}
                placeholder={field.placeholder}
                placeholderTextColor={C.textDim}
                secureTextEntry={field.secure}
                autoCapitalize="none"
                style={{ backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 16, fontSize: 15, color: C.text, borderWidth: 1, borderColor: C.border }}
              />
            </View>
          ))}

          <Pressable style={{ alignSelf: "flex-end" }}>
            <Text style={{ fontSize: 13, color: C.accent, fontWeight: "600" }}>Forgot password?</Text>
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
            <Text style={{ fontSize: 13, color: C.textSec }}>or log in with</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {[{ icon: "logo-google", label: "Google" }, { icon: "logo-apple", label: "Apple" }].map((s) => (
              <Pressable key={s.label} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 14, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1, borderColor: C.border }}>
                <Ionicons name={s.icon as any} size={18} color={C.text} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: C.text }}>{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={() => { setOnboarded("Emma"); router.replace("/(tabs)"); }} style={{ backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18, alignItems: "center", marginTop: 24 }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#000" }}>Log In</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(onboarding)/signup")} style={{ paddingVertical: 16, alignItems: "center" }}>
          <Text style={{ fontSize: 14, color: C.textSec }}>
            New to Forma?{" "}
            <Text style={{ color: C.accent, fontWeight: "700" }}>Sign up</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
