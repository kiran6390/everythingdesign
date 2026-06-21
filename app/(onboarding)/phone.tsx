import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { supabase } from "@/lib/supabase";

export default function PhoneScreen() {
  const insets = useSafeAreaInsets();
  const [num, setNum] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const digits = num.replace(/\D/g, "");
    if (digits.length !== 10) {
      Alert.alert("Enter a valid 10-digit mobile number");
      return;
    }
    const phone = `+91${digits}`;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) {
      Alert.alert("Couldn't send code", error.message);
      return;
    }
    router.push({ pathname: "/(onboarding)/otp", params: { phone } });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </Pressable>

        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color={C.accent} />
        </View>

        <Text style={{ fontSize: 32, fontWeight: "900", color: C.text, marginBottom: 8 }}>What's your{"\n"}number?</Text>
        <Text style={{ fontSize: 15, color: C.textSec, marginBottom: 36 }}>We'll text you a 6-digit code to sign you in. No passwords.</Text>

        {/* Phone input */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16, borderWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: C.text }}>🇮🇳 +91</Text>
          </View>
          <TextInput
            value={num}
            onChangeText={(t) => setNum(t.replace(/\D/g, "").slice(0, 10))}
            placeholder="98765 43210"
            placeholderTextColor={C.textDim}
            keyboardType="number-pad"
            autoFocus
            style={{ flex: 1, backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: C.text, borderWidth: 1, borderColor: C.border, letterSpacing: 1 }}
          />
        </View>

        <Pressable
          onPress={send}
          disabled={loading}
          style={{ backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18, alignItems: "center", marginTop: 28, opacity: loading ? 0.6 : 1 }}
        >
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#000" }}>{loading ? "Sending…" : "Send code"}</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(onboarding)/login")} style={{ paddingVertical: 16, alignItems: "center", marginTop: 4 }}>
          <Text style={{ fontSize: 14, color: C.textSec }}>Use email instead</Text>
        </Pressable>

        <Text style={{ fontSize: 11, color: C.textDim, textAlign: "center", marginTop: "auto", lineHeight: 16 }}>
          By continuing you agree to our Terms & Privacy. Standard SMS rates may apply.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
