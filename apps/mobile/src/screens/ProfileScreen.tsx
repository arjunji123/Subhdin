import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Dimensions, Share } from "react-native";
import { colors } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Props = {
  profile: any;
  userRole?: 'user' | 'vendor';
  onUpdate: () => void;
  onLogout: () => void;
  onHelp: () => void;
  onDeleteAccount: () => void;
  loading: boolean;
};

export function ProfileScreen({ profile, userRole, onUpdate, onLogout, onHelp, onDeleteAccount, loading }: Props) {
  const insets = useSafeAreaInsets();
  const isVendor = userRole === 'vendor' || profile?.role === 'vendor' || !!profile?.businessName;
  const name = isVendor ? (profile?.businessName || "Vendor Profile") : (profile?.fullName || profile?.name || "Customer Profile");
  const subInfo = isVendor ? `Owner: ${profile?.ownerName || "Service Partner"}` : (profile?.phone || profile?.mobileNumber || "Personal Account");
  const initials = (isVendor ? (profile?.businessName || "V") : (profile?.fullName || profile?.name || "C"))?.[0] || "S";

  const handleInvite = async () => {
    try {
      await Share.share({
        message: "Join Subhdin - Your Perfect Event Partner! Download now and discover premium vendors for your celebrations.",
        url: "https://subhdin.com"
      });
    } catch (error) {}
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
        {/* Elegant Profile Header */}
        <View style={styles.headerCard}>
          <Image source={require("../../assets/logo.png")} style={styles.bgLogo} resizeMode="contain" />
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials.toUpperCase()}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name={isVendor ? "shield-checkmark" : "person"} size={12} color={colors.white} />
            </View>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userSub}>{subInfo}</Text>

          <TouchableOpacity style={styles.editPill} onPress={onUpdate}>
            <Ionicons name="settings-outline" size={16} color={colors.primary} />
            <Text style={styles.editPillText}>Account Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.main}>
            {/* Account Info */}
            <Text style={styles.sectionTitle}>Profile Details</Text>
            <View style={styles.infoGrid}>
                <InfoItem icon="call-outline" label="Contact" value={profile?.phone || profile?.mobileNumber || "N/A"} />
                {profile?.email && <InfoItem icon="mail-outline" label="Email" value={profile.email} />}
                <InfoItem icon="location-outline" label="Primary City" value={profile?.city || "Select City"} />
            </View>

            {/* Menu Options */}
            <Text style={styles.sectionTitle}>Account Actions</Text>
            <View style={styles.menuBox}>
                <MenuAction icon="help-circle-outline" label="Help & Support" onPress={onHelp} />
                {!isVendor && <MenuAction icon="share-outline" label="Invite Friends" onPress={handleInvite} />}
                <View style={styles.menuDivider} />
                <MenuAction icon="log-out-outline" label="Sign Out" onPress={onLogout} isDestructive />
            </View>

            <TouchableOpacity style={styles.deleteBtn} onPress={() => {
                Alert.alert("Delete Account", "Are you sure? This action cannot be undone.", [
                    { text: "Cancel" },
                    { text: "Delete", style: "destructive", onPress: onDeleteAccount }
                ]);
            }}>
                <Text style={styles.deleteBtnText}>Close My Account Permanently</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

function InfoItem({ icon, label, value }: any) {
    return (
        <View style={styles.infoItem}>
            <View style={styles.itemIcon}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <View>
                <Text style={styles.itemLabel}>{label}</Text>
                <Text style={styles.itemValue}>{value}</Text>
            </View>
        </View>
    );
}

function MenuAction({ icon, label, onPress, isDestructive }: any) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.menuIcon, isDestructive && { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Ionicons name={icon} size={22} color={isDestructive ? colors.error : colors.primary} />
            </View>
            <Text style={[styles.menuText, isDestructive && { color: colors.error }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.border} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { },
  headerCard: {
    backgroundColor: colors.surface,
    padding: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative'
  },
  bgLogo: { position: 'absolute', width: 250, height: 250, opacity: 0.02, top: -50, right: -50, transform: [{ rotate: '15deg' }] },
  avatarWrapper: { marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 35, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
  avatarText: { color: colors.white, fontSize: 40, fontWeight: '900' },
  badge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: colors.success, width: 28, height: 28, borderRadius: 10, borderWidth: 4, borderColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 24, fontWeight: '900', color: colors.text, marginTop: 10 },
  userSub: { fontSize: 14, color: colors.textMuted, fontWeight: '600', marginTop: 4 },
  editPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primaryLight, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 100, marginTop: 25 },
  editPillText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  main: { padding: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: colors.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, marginLeft: 8 },
  infoGrid: { gap: 16, marginBottom: 35 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.surface, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: colors.border },
  itemIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  itemValue: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 2 },
  menuBox: { backgroundColor: colors.surface, borderRadius: 30, padding: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  menuDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: 20, marginVertical: 4, opacity: 0.3 },
  deleteBtn: { padding: 20, alignItems: 'center' },
  deleteBtnText: { fontSize: 13, color: colors.error, fontWeight: '700', opacity: 0.6 },
  footerSpacer: { height: 100 },
});
