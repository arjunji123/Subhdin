import React, { useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Animated } from "react-native";
import * as Haptics from 'expo-haptics';
import { colors } from "../theme/colors";
import { Button } from "../components/Button";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  phone: string;
  otp: string;
  setOtp: (val: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  loading: boolean;
  error?: string | null;
};

export function OtpVerifyScreen({ phone, otp, setOtp, onVerify, onResend, onBack, loading, error }: Props) {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (error) {
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [error]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.inner}>
        <TouchableOpacity style={[styles.backBtn, { top: 10 }]} onPress={onBack}>
          <Text style={styles.backText}>← Change Number</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
          <Text style={styles.phone}>+91 {phone}</Text>
        </View>

        <View style={styles.form}>
          <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
            <TextInput
              placeholder="000000"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              style={[
                styles.input,
                !!error && styles.inputError
              ]}
              value={otp}
              onChangeText={(v) => {
                setOtp(v);
              }}
              autoFocus
            />
          </Animated.View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Verify & Login"
            onPress={onVerify}
            loading={loading}
            disabled={otp.length < 6}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={onResend}>
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 24,
    zIndex: 1,
  },
  backText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
  },
  phone: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "700",
    marginTop: 4,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    letterSpacing: 10,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  resendLink: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
});
