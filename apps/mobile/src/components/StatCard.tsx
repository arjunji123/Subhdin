import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  value: number | string;
};

const iconMap: Record<string, any> = {
    'Leads': 'people',
    'Views': 'eye',
    'WhatsApp': 'logo-whatsapp',
    'Contacts': 'call'
};

export function StatCard({ label, value }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
            <Ionicons name={iconMap[label] || 'stats-chart'} size={14} color={colors.primary} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    width: "48%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 26,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -1,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
