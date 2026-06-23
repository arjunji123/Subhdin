import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onBack: () => void;
};

export function HelpSupportScreen({ onBack }: Props) {
  const insets = useSafeAreaInsets();

  const handleEmail = () => {
    Linking.openURL('mailto:help@subhdin.com');
  };

  const handleCall = () => {
    Linking.openURL('tel:+911212121212');
  };

  const handleWhatsapp = () => {
    Linking.openURL('whatsapp://send?phone=+911212121212&text=Hello Subhdin Support, I need help with my vendor account.');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Ionicons name="headset-outline" size={40} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSub}>Our support team is available 24/7 to assist you with your business needs.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CONTACT US</Text>

          <ContactCard
            icon="mail-outline"
            title="Email Support"
            value="help@subhdin.com"
            onPress={handleEmail}
            color="#3B82F6"
          />

          <ContactCard
            icon="call-outline"
            title="Phone Support"
            value="+91 1212121212"
            onPress={handleCall}
            color="#10B981"
          />

          <ContactCard
            icon="logo-whatsapp"
            title="WhatsApp Support"
            value="Chat with us"
            onPress={handleWhatsapp}
            color="#25D366"
          />
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
          <FaqItem question="How to add a new service?" answer="Go to the Services tab and click on the (+) icon at the top right corner." />
          <FaqItem question="How to update my business details?" answer="Navigate to Account > Edit Profile to update your business information." />
          <FaqItem question="Is my data secure?" answer="Yes, we use enterprise-grade encryption to protect all your business and customer data." />
        </View>
      </ScrollView>
    </View>
  );
}

function ContactCard({ icon, title, value, onPress, color }: any) {
  return (
    <TouchableOpacity style={styles.contactCard} onPress={onPress}>
      <View style={[styles.contactIcon, { backgroundColor: color + '10' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.border} />
    </TouchableOpacity>
  );
}

function FaqItem({ question, answer }: any) {
  return (
    <View style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{question}</Text>
      <Text style={styles.faqAnswer}>{answer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 10 },
  backBtn: { padding: 8 },
  title: { fontSize: 18, fontWeight: "800", color: colors.text },
  content: { padding: 24 },
  hero: { alignItems: "center", marginBottom: 40 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  heroTitle: { fontSize: 22, fontWeight: "900", color: colors.text },
  heroSub: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginTop: 8, lineHeight: 22 },
  section: { gap: 16, marginBottom: 40 },
  sectionLabel: { fontSize: 12, fontWeight: "800", color: colors.textMuted, letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  contactCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.white, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  contactIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 16 },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 14, color: colors.textMuted, fontWeight: "600" },
  contactValue: { fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 2 },
  faqSection: { gap: 20 },
  faqItem: { gap: 6 },
  faqQuestion: { fontSize: 16, fontWeight: "700", color: colors.text },
  faqAnswer: { fontSize: 14, color: colors.textMuted, lineHeight: 20 }
});
