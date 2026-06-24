import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Dimensions } from "react-native";
import { colors } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

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
  const subInfo = isVendor ? (profile?.ownerName || "Service Partner") : (profile?.phone || profile?.mobileNumber || "Customer Account");
  const initials = (isVendor ? profile?.businessName : (profile?.fullName || profile?.name))?.[0] || "S";

  const hasLocation = profile?.city && profile?.area;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
                {hasLocation && <InfoItem icon="location-outline" label="Location" value={`${profile.area}, ${profile.city}`} />}
                {isVendor && profile?.address && <InfoItem icon="home-outline" label="Business Address" value={profile.address} />}
            </View>

            {/* Menu Options */}
            <Text style={styles.sectionTitle}>More</Text>
            <View style={styles.menuBox}>
                <MenuAction icon="help-circle-outline" label="Help & Support" onPress={onHelp} />
                <MenuAction icon="share-outline" label="Invite Friends" onPress={() => {}} />
                <View style={styles.menuDivider} />
                <MenuAction icon="log-out-outline" label="Sign Out" onPress={onLogout} isDestructive />
            </View>

            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                Alert.alert("Delete Account", "Are you sure? This action cannot be undone.", [
                    { text: "Cancel" },
                    { text: "Delete", style: "destructive", onPress: onDeleteAccount }
                ]);
                }}
            >
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
            <View style={[styles.menuIcon, isDestructive && { backgroundColor: '#FFF5F5' }]}>
                <Ionicons name={icon} size={22} color={isDestructive ? colors.error : colors.text} />
            </View>
            <Text style={[styles.menuText, isDestructive && { color: colors.error }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.border} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 20 },
  headerCard: {
    backgroundColor: colors.white,
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative'
  },
  bgLogo: { position: 'absolute', width: 200, height: 200, opacity: 0.03, top: -20, right: -40, transform: [{ rotate: '15deg' }] },
  avatarWrapper: { marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 35, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 10 },
  avatarText: { color: colors.white, fontSize: 40, fontWeight: '900' },
  badge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: colors.success, width: 28, height: 28, borderRadius: 10, borderWidth: 4, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 22, fontWeight: '900', color: colors.text },
  userSub: { fontSize: 14, color: colors.textMuted, fontWeight: '600', marginTop: 4 },
  editPill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primaryLight, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100, marginTop: 20 },
  editPillText: { color: colors.primary, fontWeight: '800', fontSize: 13 },
  main: { padding: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16, marginLeft: 8 },
  infoGrid: { gap: 16, marginBottom: 35 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.white, padding: 16, borderRadius: 24, borderWidth: 1, borderColor: colors.border },
  itemIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  itemValue: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 2 },
  menuBox: { backgroundColor: colors.white, borderRadius: 28, padding: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  menuDivider: { height: 1, backgroundColor: colors.border, marginHorizontal: 20, marginVertical: 4, opacity: 0.5 },
  deleteBtn: { padding: 20, alignItems: 'center' },
  deleteBtnText: { fontSize: 13, color: colors.error, fontWeight: '700', opacity: 0.5 },
  footerSpacer: { height: 100 },
});
