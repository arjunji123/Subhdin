import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors } from "../theme/colors";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
}

export function InputField({ label, error, touched, style, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && !!error;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isFocused && { color: colors.primary }, hasError && styles.labelError]}>{label}</Text>
      <View style={[
          styles.inputWrap,
          isFocused && styles.inputFocused,
          hasError && styles.inputError
      ]}>
          <TextInput
            style={[styles.input, style]}
            placeholderTextColor="rgba(148, 163, 184, 0.5)"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", gap: 10 },
  label: { fontSize: 12, fontWeight: "800", color: colors.textMuted, marginLeft: 5, textTransform: 'uppercase', letterSpacing: 1 },
  labelError: { color: colors.error },
  inputWrap: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    height: 62,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  input: {
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 10,
  },
});
