import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { colors } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

type Props = {
  label: string;
  value: number | string;
  icon?: any;
};

export function StatCard({ label, value, icon }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
          <Ionicons name={icon || 'stats-chart'} size={24} color={colors.primary} />
      </View>
      <View>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label} numberOfLines={1}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    width: (width - 48 - 15) / 2, // 2 columns with 15 gap, 48 is total horizontal padding
    gap: 15,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -1,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
});
