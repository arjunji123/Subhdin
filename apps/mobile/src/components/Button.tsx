import React, { useRef } from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, Platform, Animated } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: any;
};

export function Button({ title, onPress, variant = "primary", loading, disabled, style }: Props) {
  const isOutline = variant === "outline";
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles[variant],
          (disabled || loading) && styles.disabled,
        ]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        android_ripple={{ color: isOutline ? colors.primaryLight : 'rgba(255,255,255,0.2)' }}
      >
        {loading ? (
          <ActivityIndicator color={isOutline ? colors.primary : colors.white} />
        ) : (
          <Text style={[styles.text, isOutline ? styles.textOutline : styles.textFull]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  textFull: {
    color: colors.white,
  },
  textOutline: {
    color: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
