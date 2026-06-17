import React, { useState } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";

type Props = {
  phone: string;
  setPhone: (val: string) => void;
  onSendOtp: () => void;
  onGoToSignup: () => void;
  loading: boolean;
};

export function LoginScreen({ phone, setPhone, onSendOtp, onGoToSignup, loading }: Props) {
  const [touched, setTouched] = useState(false);

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
      <View style={styles.inner}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your mobile number to login</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Mobile Number"
            placeholder="e.g. 9876543210"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            onBlur={() => setTouched(true)}
            error={getError()}
            touched={touched}
          />

          <Button
            title="Get OTP"
            onPress={onSendOtp}
            loading={loading}
            disabled={!!getError()}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onGoToSignup}>
            <Text style={styles.signupLink}>Sign Up</Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: -40,
  },
  logo: {
    width: 200,
    height: 200,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 6,
  },
  form: {
    gap: 24,
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
  signupLink: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
});
