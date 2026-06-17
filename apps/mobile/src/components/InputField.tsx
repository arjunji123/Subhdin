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
      <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          style
        ]}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginLeft: 4,
  },
  labelError: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 8,
  },
});
