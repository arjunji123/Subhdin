import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { vendorApi } from "../api";
import { Button } from "../components/Button";
import { SkeletonLoader } from "../components/Skeleton/SkeletonLoader";

const { width } = Dimensions.get("window");

type Props = {
  token: string;
  onVendorPress: (vendor: any) => void;
};

export function OfferDiscoveryScreen({ token, onVendorPress }: Props) {
  const insets = useSafeAreaInsets();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await vendorApi.getPublicOffers(token);
      setOffers(data || []);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderOfferItem = ({ item }: { item: any }) => (
    <TouchableOpacity
        style={styles.offerCard}
        onPress={() => setSelectedOffer(item)}
        activeOpacity={0.95}
    >
        <View style={styles.cardTop}>
            <View style={styles.vendorBrief}>
                <Image
                    source={{ uri: item.vendor?.businessImages?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" }}
                    style={styles.vAvatar}
                />
                <View>
                    <Text style={styles.vNameText}>{item.vendor?.businessName}</Text>
                    <Text style={styles.vLocText}>{item.vendor?.city}</Text>
                </View>
            </View>
            <View style={styles.discountBadge}>
                <Text style={styles.discountVal}>{item.discountPercent}%</Text>
                <Text style={styles.discountLabel}>OFF</Text>
            </View>
        </View>
        <View style={styles.cardBody}>
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerDesc} numberOfLines={2}>{item.description}</Text>
        </View>
        <View style={styles.cardFooter}>
            <View style={styles.expiryRow}>
                <Ionicons name="time-outline" size={14} color={colors.primary} />
                <Text style={styles.expiryText}>Ends {new Date(item.endDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.viewLink}>
                <Text style={styles.viewLinkText}>Claim Deal</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Subhdin Deals</Text>
        <Text style={styles.subtitle}>Curated luxury offers for you</Text>
      </View>

      {loading ? (
        <View style={{ padding: 24 }}>
            <SkeletonLoader height={180} borderRadius={30} style={{ marginBottom: 20 }} />
            <SkeletonLoader height={180} borderRadius={30} />
        </View>
      ) : (
        <FlatList
          data={offers}
          renderItem={renderOfferItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}><Text style={styles.emptyText}>No active deals right now</Text></View>
          }
        />
      )}

      {/* Modern Offer Detail Modal */}
      <Modal visible={!!selectedOffer} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={styles.detailSheet}>
                  <View style={styles.dragIndicator} />
                  {selectedOffer && (
                      <ScrollView showsVerticalScrollIndicator={false}>
                          <View style={styles.promoHeader}>
                              <View style={styles.goldCircle}>
                                  <Text style={styles.goldVal}>{selectedOffer.discountPercent}%</Text>
                                  <Text style={styles.goldLabel}>OFFER</Text>
                              </View>
                              <Text style={styles.promoTitle}>{selectedOffer.title}</Text>
                          </View>

                          <Text style={styles.sectionLabel}>DEAL DESCRIPTION</Text>
                          <Text style={styles.promoDesc}>{selectedOffer.description}</Text>

                          <View style={styles.divider} />

                          <TouchableOpacity
                            style={styles.vProfileCard}
                            onPress={() => {
                                const v = selectedOffer.vendor;
                                setSelectedOffer(null);
                                onVendorPress(v);
                            }}
                          >
                              <Image source={{ uri: selectedOffer.vendor?.businessImages?.[0] }} style={styles.vBigImg} />
                              <View style={{ flex: 1 }}>
                                  <Text style={styles.vBigName}>{selectedOffer.vendor?.businessName}</Text>
                                  <Text style={styles.vBigLoc}>{selectedOffer.vendor?.area}, {selectedOffer.vendor?.city}</Text>
                                  <Text style={styles.vActionText}>Visit Profile →</Text>
                              </View>
                          </TouchableOpacity>

                          <Button title="Redeem This Deal" onPress={() => onVendorPress(selectedOffer.vendor)} style={{ marginTop: 20 }} />
                          <TouchableOpacity onPress={() => setSelectedOffer(null)} style={styles.closeAction}>
                              <Text style={styles.closeActionText}>Back to Deals</Text>
                          </TouchableOpacity>
                          <View style={{ height: 40 }} />
                      </ScrollView>
                  )}
              </View>
          </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 24, paddingBottom: 20 },
  title: { fontSize: 26, fontWeight: '900', color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.textMuted, fontWeight: '600', marginTop: 4 },
  list: { padding: 24, gap: 24, paddingBottom: 120 },
  offerCard: { backgroundColor: colors.surface, borderRadius: 30, padding: 20, borderWidth: 1, borderColor: colors.border, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  vendorBrief: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vAvatar: { width: 44, height: 44, borderRadius: 15 },
  vNameText: { fontSize: 15, fontWeight: '800', color: colors.text },
  vLocText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  discountBadge: { backgroundColor: colors.primary, width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  discountVal: { color: colors.white, fontSize: 16, fontWeight: '900' },
  discountLabel: { color: colors.white, fontSize: 8, fontWeight: '800', marginTop: -2 },
  cardBody: { marginBottom: 18 },
  offerTitle: { fontSize: 19, fontWeight: '900', color: colors.text, marginBottom: 5 },
  offerDesc: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.border },
  expiryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  expiryText: { fontSize: 12, color: colors.textMuted, fontWeight: '700' },
  viewLink: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  viewLinkText: { fontSize: 13, fontWeight: '800', color: colors.primary },
  empty: { padding: 50, alignItems: 'center' },
  emptyText: { color: colors.textMuted, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  detailSheet: { backgroundColor: colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, height: '85%' },
  dragIndicator: { width: 50, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 25 },
  promoHeader: { alignItems: 'center', marginBottom: 30 },
  goldCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  goldVal: { color: colors.white, fontSize: 32, fontWeight: '900' },
  goldLabel: { color: colors.white, fontSize: 10, fontWeight: '800' },
  promoTitle: { fontSize: 22, fontWeight: '900', color: colors.text, textAlign: 'center' },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: colors.textMuted, letterSpacing: 2, marginBottom: 15 },
  promoDesc: { fontSize: 16, color: colors.text, lineHeight: 26, opacity: 0.8 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 30 },
  vProfileCard: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: colors.background, borderRadius: 25, gap: 15 },
  vBigImg: { width: 70, height: 70, borderRadius: 20 },
  vBigName: { fontSize: 17, fontWeight: '800', color: colors.text },
  vBigLoc: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  vActionText: { fontSize: 13, color: colors.primary, fontWeight: '800', marginTop: 5 },
  closeAction: { alignSelf: 'center', marginTop: 25 },
  closeActionText: { color: colors.textMuted, fontWeight: '700', fontSize: 15 }
});
