import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { colors } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';

type Props = {
  profile: any;
  onUpdate: () => void;
  onLogout: () => void;
  onHelp: () => void;
  onDeleteAccount: () => void;
  loading: boolean;
};

export function ProfileScreen({ profile, onUpdate, onLogout, onHelp, onDeleteAccount, loading }: Props) {
  const isVendor = profile?.role === 'vendor';
  const name = isVendor ? (profile?.businessName || "Business Profile") : (profile?.fullName || profile?.name || "User Profile");
  const subInfo = isVendor ? (profile?.ownerName || "Service Partner") : (profile?.phone || "Customer");
  const initials = (isVendor ? profile?.businessName : (profile?.fullName || profile?.name))?.[0] || "S";

  const hasLocation = profile?.city && profile?.area;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials.toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.badge}>
            <Ionicons name={isVendor ? "shield-checkmark" : "person"} size={12} color={colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.businessName}>{name}</Text>
        <Text style={styles.ownerInfo}>{subInfo}</Text>

        <TouchableOpacity style={styles.editBtn} onPress={onUpdate}>
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>CONTACT & INFO</Text>
        <View style={styles.infoCard}>
          <InfoRow icon="call-outline" label="Phone" value={profile?.phone || profile?.mobileNumber} />
          {profile?.email && (
            <InfoRow icon="mail-outline" label="Email" value={profile.email} />
          )}
          {hasLocation && (
            <InfoRow icon="location-outline" label="Location" value={`${profile.area}, ${profile.city}`} />
          )}
          {isVendor && profile?.address && (
            <InfoRow icon="home-outline" label="Address" value={profile.address} />
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SUPPORT</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={onHelp}
          />
          <MenuItem
            icon="log-out-outline"
            label="Logout"
            color={colors.error}
            onPress={onLogout}
            hideChevron
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteLink}
        onPress={() => {
          Alert.alert("Delete Account", "All your data will be permanently removed. Continue?", [
            { text: "Cancel" },
            { text: "Delete", style: "destructive", onPress: onDeleteAccount }
          ]);
        }}
      >
        <Text style={styles.deleteText}>Permanent Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabelText}>{label}</Text>
        <Text style={styles.infoValueText} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

function MenuItem({ icon, label, color = colors.text, onPress, hideChevron }: any) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIconBox, color === colors.error && { backgroundColor: '#FEE2E2' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.menuLabelText, { color }]}>{label}</Text>
      {!hideChevron && <Ionicons name="chevron-forward" size={18} color={colors.border} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 120 }, // Increased padding for glassy nav
  profileHeaderCard: { backgroundColor: colors.white, borderRadius: 28, padding: 24, alignItems: "center", marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.white, fontSize: 36, fontWeight: "900" },
  badge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.success, padding: 6, borderRadius: 12, borderWidth: 3, borderColor: colors.white },
  businessName: { fontSize: 20, fontWeight: "800", color: colors.text },
  ownerInfo: { fontSize: 14, color: colors.textMuted, marginTop: 4, marginBottom: 20 },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.primaryLight, borderRadius: 100 },
  editBtnText: { color: colors.primary, fontWeight: "700", fontSize: 14 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, marginLeft: 16, marginBottom: 10 },
  infoCard: { backgroundColor: colors.white, borderRadius: 24, padding: 20, gap: 20, borderWidth: 1, borderColor: colors.border },
  infoRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: 16 },
  infoContent: { flex: 1 },
  infoLabelText: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  infoValueText: { fontSize: 15, fontWeight: "700", color: colors.text, marginTop: 2 },
  menuCard: { backgroundColor: colors.white, borderRadius: 24, paddingVertical: 8, borderWidth: 1, borderColor: colors.border },
  menuItem: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14 },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surfaceDark, alignItems: "center", justifyContent: "center", marginRight: 16 },
  menuLabelText: { flex: 1, fontSize: 16, fontWeight: "600" },
  deleteLink: { padding: 20, alignItems: "center" },
  deleteText: { color: colors.error, fontSize: 14, fontWeight: "700", opacity: 0.6 }
});
