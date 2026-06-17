import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";

type Props = {
  profile: any;
  onUpdate: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  loading: boolean;
};

export function ProfileScreen({ profile, onUpdate, onLogout, onDeleteAccount, loading }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{profile?.businessName?.[0] || "S"}</Text>
        </View>
        <Text style={styles.name}>{profile?.businessName || "Business Name"}</Text>
        <Text style={styles.sub}>{profile?.ownerName} • {profile?.city}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Mobile" value={profile?.phone} />
          <InfoRow label="Email" value={profile?.email || "Not provided"} />
          <InfoRow label="Area" value={profile?.area} />
          <InfoRow label="Address" value={profile?.address || "Not provided"} />
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Edit Profile" onPress={onUpdate} variant="outline" />

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => {
            Alert.alert(
              "Delete Account",
              "This action is permanent. All your services and leads will be lost.",
              [
                { text: "Cancel" },
                { text: "Delete", style: "destructive", onPress: onDeleteAccount }
              ]
            );
          }}
        >
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string, value?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "800",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  sub: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  actions: {
    gap: 16,
  },
  logoutBtn: {
    alignItems: "center",
    padding: 14,
  },
  logoutText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 16,
  },
  deleteBtn: {
    alignItems: "center",
    padding: 14,
  },
  deleteText: {
    color: colors.error,
    fontWeight: "600",
    fontSize: 14,
  },
});
