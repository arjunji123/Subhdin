import React from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { StatCard } from "../components/StatCard";

type Props = {
  data: any;
  loading: boolean;
  onRefresh: () => void;
  onViewReviews: () => void;
};

export function DashboardScreen({ data, loading, onRefresh, onViewReviews }: Props) {
  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      contentContainerStyle={styles.content}
    >
      <View style={styles.welcomeRow}>
        <View>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.businessName}>{data?.businessName || "Subhdin Partner"}</Text>
        </View>
        <TouchableOpacity style={styles.ratingBadge} onPress={onViewReviews}>
          <Text style={styles.ratingText}>★ {data?.avgRating || "0.0"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Performance Overview</Text>
      <View style={styles.grid}>
        <StatCard label="Total Leads" value={data?.totalLeads ?? 0} />
        <StatCard label="Profile Views" value={data?.totalViews ?? 0} />
        <StatCard label="WhatsApp Clicks" value={data?.totalWhatsappClicks ?? 0} />
        <StatCard label="Contact Reveals" value={data?.totalContactReveals ?? 0} />
      </View>

      <TouchableOpacity style={styles.reviewsCard} onPress={onViewReviews}>
        <View>
          <Text style={styles.reviewsTitle}>Customer Reviews</Text>
          <Text style={styles.reviewsSub}>Check what people are saying about you</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Growth Tip</Text>
        <Text style={styles.tipText}>Respond to reviews and keep your services updated to improve your platform ranking.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcome: {
    fontSize: 16,
    color: colors.textMuted,
  },
  businessName: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  ratingBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  reviewsCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  reviewsSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
  tipCard: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  tipTitle: {
    color: "#92400E",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
  },
  tipText: {
    color: "#B45309",
    fontSize: 13,
    lineHeight: 18,
  },
});
