import React, { useState } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

type Props = {
  phone: string;
  setPhone: (val: string) => void;
  onSendOtp: () => void;
  onGoToSignup: () => void;
  loading: boolean;
};

export function LoginScreen({ phone, setPhone, onSendOtp, onGoToSignup, loading }: Props) {
  const [touched, setTouched] = useState(false);
  const insets = useSafeAreaInsets();

  const getError = () => {
    if (!phone) return "Mobile number is required";
    if (phone.length < 10) return "Number must be 10 digits";
    return undefined;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={[styles.inner, { paddingTop: insets.top }]}>
        <View style={styles.logoBox}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          <View style={styles.logoShadow} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome to{'\n'}Subhdin</Text>
          <Text style={styles.subtitle}>The elite marketplace for your celebrations</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Mobile Number"
            placeholder="9876543210"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            onBlur={() => setTouched(true)}
            error={getError()}
            touched={touched}
          />

          <Button
            title="Get Started"
            onPress={onSendOtp}
            loading={loading}
            disabled={!!getError()}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to Subhdin? </Text>
          <TouchableOpacity onPress={onGoToSignup}>
            <Text style={styles.signupLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, padding: 30, justifyContent: "center" },
  logoBox: { alignItems: "center", marginBottom: 40 },
  logo: { width: 140, height: 140, zIndex: 1 },
  logoShadow: { position: 'absolute', bottom: 10, width: 80, height: 20, backgroundColor: 'rgba(212, 175, 55, 0.2)', borderRadius: 40, filter: 'blur(10px)' as any },
  header: { marginBottom: 40 },
  title: { fontSize: 40, fontWeight: "900", color: colors.text, letterSpacing: -1.5, lineHeight: 45 },
  subtitle: { fontSize: 16, color: colors.textMuted, marginTop: 10, fontWeight: "600", lineHeight: 24 },
  form: { gap: 25 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 40 },
  footerText: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
  signupLink: { color: colors.primary, fontWeight: "800", fontSize: 15 },
});
