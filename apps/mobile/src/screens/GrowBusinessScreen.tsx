import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';
import { Button } from "../components/Button";

type Props = {
  onBack: () => void;
  onContactSupport: () => void;
};

export function GrowBusinessScreen({ onBack, onContactSupport }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Grow Your Business</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Ionicons name="rocket" size={48} color={colors.white} />
          <Text style={styles.heroTitle}>Unlock Premium Growth</Text>
          <Text style={styles.heroSub}>Reach 5x more customers with these simple steps.</Text>
        </View>

        <TipItem
          icon="camera-outline"
          title="High Quality Images"
          desc="Profiles with 10+ high-quality photos get 3x more bookings. Showcase your best work."
        />

        <TipItem
          icon="star-outline"
          title="Collect Reviews"
          desc="Ask your happy clients to rate you. High ratings improve your ranking on the homepage."
        />

        <TipItem
          icon="checkmark-done-circle-outline"
          title="Complete Profile"
          desc="A fully filled profile with address, map location, and description builds trust instantly."
        />

        <TipItem
          icon="flash-outline"
          title="Quick Response"
          desc="Responding to WhatsApp leads within 30 minutes increases conversion by 60%."
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Need personalized advice for your business?</Text>
          <Button
            title="Get Expert Support"
            onPress={onContactSupport}
            variant="primary"
          />
        </View>

        <View style={styles.partnerBadge}>
            <Text style={styles.partnerText}>Subhdin verified partner</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function TipItem({ icon, title, desc }: any) {
  return (
    <View style={styles.tipCard}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{title}</Text>
        <Text style={styles.tipDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 10 },
  backBtn: { padding: 8 },
  title: { fontSize: 18, fontWeight: "800", color: colors.text },
  content: { padding: 24 },
  heroCard: { backgroundColor: colors.primary, borderRadius: 24, padding: 30, alignItems: "center", marginBottom: 32 },
  heroTitle: { color: colors.white, fontSize: 22, fontWeight: "900", marginTop: 16 },
  heroSub: { color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 8, fontSize: 14, lineHeight: 20 },
  tipCard: { flexDirection: "row", gap: 16, marginBottom: 24 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  tipDesc: { fontSize: 14, color: colors.textMuted, marginTop: 4, lineHeight: 20 },
  footer: { marginTop: 20, padding: 24, backgroundColor: colors.surface, borderRadius: 24, gap: 16 },
  footerText: { fontSize: 14, color: colors.text, fontWeight: "600", textAlign: "center" },
  partnerBadge: { alignItems: "center", marginTop: 40, opacity: 0.3 },
  partnerText: { fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 1 }
});
