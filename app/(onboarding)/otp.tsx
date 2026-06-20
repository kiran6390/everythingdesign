import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { C } from "@/constants/colors";
import { setOnboarded } from "@/utils/store";
import { supabase } from "@/lib/supabase";

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const { phone, name } = useLocalSearchParams<{ phone: string; name?: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1]?.focus();
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      Alert.alert("Enter the 6-digit code sent to your phone");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: code,
      type: "sms",
    });
    setLoading(false);
    if (error) {
      Alert.alert("Invalid code", error.message);
      return;
    }
    const userName = name || data.user?.user_metadata?.full_name || "Designer";
    setOnboarded(userName);
    router.replace("/(tabs)");
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    await supabase.auth.signInWithOtp({ phone });
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: C.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", marginBottom: 32 }}
        >
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </Pressable>

        {/* Icon */}
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.accentDim, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Ionicons name="phone-portrait-outline" size={28} color={C.accent} />
        </View>

        <Text style={{ fontSize: 32, fontWeight: "900", color: C.text, marginBottom: 8 }}>Enter the code</Text>
        <Text style={{ fontSize: 15, color: C.textSec, marginBottom: 40 }}>
          We sent a 6-digit code to{"\n"}
          <Text style={{ color: C.text, fontWeight: "700" }}>{phone}</Text>
        </Text>

        {/* OTP boxes */}
        <View style={{ flexDirection: "row", gap: 10, justifyContent: "center", marginBottom: 40 }}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => { inputs.current[i] = r; }}
              value={digit}
              onChangeText={(t) => handleChange(t, i)}
              keyboardType="number-pad"
              maxLength={1}
              style={{
                width: 48,
                height: 56,
                borderRadius: 14,
                backgroundColor: C.surface,
                borderWidth: 1.5,
                borderColor: digit ? C.accent : C.border,
                fontSize: 24,
                fontWeight: "800",
                color: C.text,
                textAlign: "center",
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={handleVerify}
          disabled={loading}
          style={{ backgroundColor: C.accent, borderRadius: 16, paddingVertical: 18, alignItems: "center", opacity: loading ? 0.6 : 1 }}
        >
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#000" }}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </Pressable>

        <Pressable onPress={handleResend} style={{ paddingVertical: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 14, color: resendTimer > 0 ? C.textDim : C.accent, fontWeight: "600" }}>
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend code"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
