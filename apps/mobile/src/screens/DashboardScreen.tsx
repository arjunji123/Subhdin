import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from "react-native";
import { colors } from "../theme/colors";
import { StatCard } from "../components/StatCard";
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

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
        bounces={false}
      >
        <View style={styles.headerHero}>
          <Text style={styles.greeting}>Performance</Text>
          <Text style={styles.subGreeting}>Real-time business analytics</Text>
        </View>

        <View style={styles.grid}>
          <StatCard label="Leads Generated" value={data?.totalLeads ?? 0} icon="flash-outline" />
          <StatCard label="Profile Views" value={data?.totalViews ?? 0} icon="eye-outline" />
          <StatCard label="WhatsApp" value={data?.totalWhatsappClicks ?? 0} icon="logo-whatsapp" />
          <StatCard label="Inquiries" value={data?.totalContactReveals ?? 0} icon="call-outline" />
        </View>

        <Text style={styles.sectionLabel}>Engagement Hub</Text>

        <TouchableOpacity style={styles.actionCard} onPress={onViewReviews} activeOpacity={0.9}>
          <View style={styles.actionIconBox}>
            <Ionicons name="star" size={24} color={colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Customer Feedback</Text>
            <Text style={styles.actionSub}>Insights from your valued clients</Text>
          </View>
          <View style={styles.ratingPill}>
             <Text style={styles.ratingText}>{data?.avgRating ? data.avgRating.toFixed(1) : "0.0"}</Text>
             <Ionicons name="star" size={10} color={colors.white} />
          </View>
        </TouchableOpacity>

        <View style={styles.brandCard}>
            <View style={styles.brandContent}>
                <Ionicons name="rocket-sharp" size={32} color={colors.primary} />
                <View>
                    <Text style={styles.brandTitle}>Subhdin Elite</Text>
                    <Text style={styles.brandSub}>You are currently on the Premium Partner tier.</Text>
                </View>
            </View>
        </View>

        <View style={styles.footerInfo}>
          <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
          <Text style={styles.footerText}>VERIFIED SERVICE PROVIDER</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 100 },
  headerHero: { marginBottom: 30 },
  greeting: { fontSize: 32, fontWeight: "900", color: colors.text, letterSpacing: -1 },
  subGreeting: { fontSize: 15, color: colors.textMuted, marginTop: 4, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 15, marginBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: "800", color: colors.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, marginLeft: 5 },
  actionCard: { backgroundColor: colors.surface, borderRadius: 30, padding: 20, flexDirection: "row", alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: colors.border, elevation: 10, shadowColor: colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  actionIconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", marginRight: 16 },
  actionContent: { flex: 1 },
  actionTitle: { fontSize: 17, fontWeight: "800", color: colors.text },
  actionSub: { fontSize: 13, color: colors.textMuted, marginTop: 3 },
  ratingPill: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  ratingText: { fontSize: 15, fontWeight: "900", color: colors.white },
  brandCard: { backgroundColor: "#161B2E", borderRadius: 32, padding: 25, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)', marginBottom: 20 },
  brandContent: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  brandTitle: { fontSize: 20, fontWeight: "900", color: colors.primary },
  brandSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: '600' },
  footerInfo: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 40, opacity: 0.5 },
  footerText: { fontSize: 10, color: colors.textMuted, fontWeight: "800", letterSpacing: 2 }
});
