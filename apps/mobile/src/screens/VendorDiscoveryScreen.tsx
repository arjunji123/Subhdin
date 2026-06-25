import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Button } from "../components/Button";
import { vendorApi } from "../api";
import { getVendorImage } from "../utils/vendor";
import { SkeletonLoader } from "../components/Skeleton/SkeletonLoader";

const { width } = Dimensions.get("window");

type SortOption = 'popularity' | 'rating' | 'newest' | 'price_low_to_high' | 'price_high_to_low';

type Props = {
  token: string;
  category?: string;
  initialQuery?: string;
  onBack: () => void;
  onVendorPress: (vendor: any) => void;
  hideSearch?: boolean;
};

export function VendorDiscoveryScreen({ token, category, initialQuery, onBack, onVendorPress, hideSearch = false }: Props) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState(initialQuery || "");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState<SortOption | "">(""); // Default to empty for simple call
  const [showFilters, setShowFilters] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, [category, initialQuery]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 50 };

      // Only add parameters if they have values
      if (category && category !== "Offers") params.category = category;
      if (search) params.search = search;
      if (location) params.location = location;
      if (sortBy) params.sortBy = sortBy;

      const data = await vendorApi.getVendors(token, params);
      setVendors(data || []);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderVendorItem = ({ item, index }: { item: any, index: number }) => {
    const image = getVendorImage(item, index);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onVendorPress(item)}
        activeOpacity={0.95}
      >
        <Image source={{ uri: image }} style={styles.cardImage} />
        <View style={styles.ratingBadge}>
            <Text style={styles.ratingVal}>{(Number(item.averageRating || 0)).toFixed(1)}</Text>
            <Ionicons name="star" size={12} color={colors.white} />
        </View>
        <View style={styles.cardContent}>
            <Text style={styles.vTitle} numberOfLines={1}>{item.businessName || item.name}</Text>
            <View style={styles.locRow}>
                <Ionicons name="location" size={14} color={colors.primary} />
                <Text style={styles.vLocText}>{item.area}, {item.city}</Text>
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.priceText}>From <Text style={{ color: colors.primary, fontWeight: '900' }}>₹{item.minPrice || 0}</Text></Text>
                <View style={styles.viewBtn}>
                    <Ionicons name="arrow-forward" size={16} color={colors.white} />
                </View>
            </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        {!hideSearch && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={28} color={colors.text} />
            </TouchableOpacity>
        )}
        <Text style={[styles.title, hideSearch && { textAlign: 'left', marginLeft: 0 }]}>
            {category || (hideSearch ? "Featured Experts" : "Find Your Expert")}
        </Text>
        {!hideSearch && (
            <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
                <Ionicons name="options" size={22} color={colors.primary} />
            </TouchableOpacity>
        )}
      </View>

      {!hideSearch && (
        <View style={styles.searchSection}>
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color={colors.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Who are you looking for?"
                    placeholderTextColor={colors.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    onSubmitEditing={fetchVendors}
                />
            </View>
        </View>
      )}

      {loading ? (
        <View style={{ padding: 24 }}>
            <SkeletonLoader height={250} borderRadius={35} style={{ marginBottom: 20 }} />
            <SkeletonLoader height={250} borderRadius={35} />
        </View>
      ) : (
        <FlatList
          data={vendors}
          renderItem={renderVendorItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
              <View style={styles.empty}><Text style={styles.emptyText}>No matches found</Text></View>
          }
        />
      )}

      {/* Modern Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Refine Search</Text>
                      <TouchableOpacity onPress={() => setShowFilters(false)}>
                          <Ionicons name="close-circle" size={32} color={colors.textMuted} />
                      </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                      <Text style={styles.label}>Sort By</Text>
                      <View style={styles.chipRow}>
                          {['popularity', 'rating', 'price_low_to_high'].map(opt => (
                              <TouchableOpacity
                                key={opt}
                                style={[styles.chip, sortBy === opt && styles.chipActive]}
                                onPress={() => setSortBy(opt as any)}
                              >
                                  <Text style={[styles.chipText, sortBy === opt && styles.chipTextActive]}>
                                      {opt.replace(/_/g, ' ').toUpperCase()}
                                  </Text>
                              </TouchableOpacity>
                          ))}
                      </View>

                      <Text style={[styles.label, { marginTop: 30 }]}>Location</Text>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Enter City or Area"
                        placeholderTextColor={colors.textMuted}
                        value={location}
                        onChangeText={setLocation}
                      />
                  </ScrollView>

                  <Button title="Apply Filters" onPress={() => { setShowFilters(false); fetchVendors(); }} style={{ marginTop: 20 }} />
              </View>
          </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 15, backgroundColor: colors.background },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
  title: { fontSize: 20, fontWeight: '900', color: colors.text, flex: 1, textAlign: 'center' },
  filterBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  searchSection: { paddingHorizontal: 24, paddingBottom: 20 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, paddingHorizontal: 15, height: 60, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, fontWeight: '600', color: colors.text },
  list: { padding: 24, gap: 20, paddingBottom: 150 },
  card: { backgroundColor: colors.surface, borderRadius: 28, overflow: 'hidden', elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 15 },
  cardImage: { width: '100%', height: 180 },
  cardContent: { padding: 18 },
  vTitle: { fontSize: 17, fontWeight: '900', color: colors.text },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  vLocText: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  ratingBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, zIndex: 10 },
  ratingVal: { color: colors.white, fontSize: 13, fontWeight: '900' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.border },
  priceText: { fontSize: 13, color: colors.textMuted, fontWeight: '700' },
  viewBtn: { backgroundColor: colors.primary, width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  empty: { padding: 50, alignItems: 'center' },
  emptyText: { color: colors.textMuted, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, height: '75%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: colors.text },
  label: { fontSize: 14, fontWeight: '800', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '700', color: colors.text },
  chipTextActive: { color: colors.white },
  modalInput: { backgroundColor: colors.surface, padding: 20, borderRadius: 20, fontSize: 16, fontWeight: '600', color: colors.text, borderWidth: 1, borderColor: colors.border }
});
