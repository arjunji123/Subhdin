import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ImageBackground } from "react-native";
import { colors } from "../theme/colors";
import { StatCard } from "../components/StatCard";
import { Ionicons } from '@expo/vector-icons';

type Props = {
  data: any;
  loading: boolean;
  onRefresh: () => void;
  onViewReviews: () => void;
};

export function DashboardScreen({ data, loading, onRefresh, onViewReviews }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.greeting}>Performance Overview</Text>
          <Text style={styles.subGreeting}>Monitor your business impact</Text>
        </View>

        <View style={styles.grid}>
          <StatCard label="Leads" value={data?.totalLeads ?? 0} />
          <StatCard label="Views" value={data?.totalViews ?? 0} />
          <StatCard label="WhatsApp" value={data?.totalWhatsappClicks ?? 0} />
          <StatCard label="Contacts" value={data?.totalContactReveals ?? 0} />
        </View>

        <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>ENGAGEMENT</Text>
        </View>

        <TouchableOpacity style={styles.actionCard} onPress={onViewReviews}>
          <View style={styles.actionIcon}>
            <Ionicons name="star" size={20} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Customer Reviews</Text>
            <Text style={styles.actionSub}>Read what clients say about you</Text>
          </View>
          <View style={styles.ratingBox}>
             <Text style={styles.ratingText}>{data?.avgRating ? data.avgRating.toFixed(1) : "--"}</Text>
             <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        </TouchableOpacity>

        <View style={styles.eventCard}>
            <View style={styles.eventOverlay}>
                <Ionicons name="sparkles" size={24} color={colors.primary} style={styles.sparkle} />
                <Text style={styles.eventTitle}>Subhdin Events</Text>
                <Text style={styles.eventSub}>We help you create magical moments for your clients.</Text>
            </View>
        </View>

        <View style={styles.footerBadge}>
          <Ionicons name="ribbon-outline" size={14} color={colors.primary} />
          <Text style={styles.partnerText}>PREMIUM VENDOR PARTNER</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { padding: 24, paddingBottom: 40 },
  headerSection: { marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: "900", color: colors.text, letterSpacing: -0.8 },
  subGreeting: { fontSize: 14, color: colors.textMuted, marginTop: 4, fontWeight: "500" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 12 },
  sectionLabelRow: { marginBottom: 16, marginTop: 12 },
  sectionLabel: { fontSize: 11, fontWeight: "800", color: colors.textMuted, letterSpacing: 1.5 },
  actionCard: { backgroundColor: colors.white, borderRadius: 24, padding: 20, flexDirection: "row", alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: colors.border, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } },
  actionIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginRight: 16 },
  actionContent: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  actionSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  ratingBox: { flexDirection: "row", alignItems: "center", gap: 8 },
  ratingText: { fontSize: 16, fontWeight: "900", color: colors.primary },
  eventCard: { backgroundColor: colors.white, borderRadius: 28, height: 140, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  eventOverlay: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: 'rgba(184, 134, 11, 0.03)' },
  sparkle: { marginBottom: 12 },
  eventTitle: { fontSize: 20, fontWeight: "900", color: colors.text, letterSpacing: -0.5 },
  eventSub: { fontSize: 14, color: colors.textMuted, marginTop: 4, lineHeight: 20, maxWidth: '80%' },
  footerBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 32, opacity: 0.5 },
  partnerText: { fontSize: 10, color: colors.textMuted, fontWeight: "800", letterSpacing: 2 }
});
