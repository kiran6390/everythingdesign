import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { hydrate } from "@/utils/store";
import { supabase } from "@/lib/supabase";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) {
      Alert.alert("Sign up failed", error.message);
      return;
    }
    const firstName = name.split(" ")[0];
    // If email confirmation is enabled, there's no session yet — send them to log in.
    if (!data.session) {
      Alert.alert(
        "Almost there 📧",
        "We sent you a confirmation link. Confirm your email, then log in.",
        [{ text: "OK", onPress: () => router.replace("/(onboarding)/login") }]
      );
      return;
    }
    if (data.user) hydrate(data.user.id, firstName);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </Pressable>

        <Text style={{ fontSize: 32, fontWeight: "900", color: C.text, marginBottom: 8 }}>Create an account</Text>
        <Text style={{ fontSize: 15, color: C.textSec, marginBottom: 40 }}>Join Mumbai's most plugged-in crowd</Text>

        <View style={{ gap: 16 }}>
          {[
            { label: "Full name", value: name, set: setName, placeholder: "Your name", secure: false },
            { label: "Email", value: email, set: setEmail, placeholder: "you@email.com", secure: false },
            { label: "Password", value: password, set: setPassword, placeholder: "Min. 8 characters", secure: true },
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

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 8 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
            <Text style={{ fontSize: 13, color: C.textSec }}>or sign up with</Text>
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

        <Pressable
          onPress={handleContinue}
          disabled={loading}
          style={{ backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18, alignItems: "center", marginTop: 24, opacity: loading ? 0.6 : 1 }}
        >
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#000" }}>{loading ? "Creating account..." : "Continue"}</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(onboarding)/login")} style={{ paddingVertical: 16, alignItems: "center" }}>
          <Text style={{ fontSize: 14, color: C.textSec }}>
            Already have an account?{" "}
            <Text style={{ color: C.accent, fontWeight: "700" }}>Log in</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
