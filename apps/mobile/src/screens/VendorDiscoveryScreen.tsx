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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Button } from "../components/Button";
import { vendorApi } from "../api";

type Props = {
  token: string;
  category?: string;
  initialQuery?: string;
  onBack: () => void;
  onVendorPress: (vendor: any) => void;
};

export function VendorDiscoveryScreen({ token, category, initialQuery, onBack, onVendorPress }: Props) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState(initialQuery || "");
  const [showFilters, setShowFilters] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchVendors();
  }, [category, initialQuery]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category) params.category = category;
      if (search) params.q = search;
      const data = await vendorApi.getVendors(token, params);
      setVendors(data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Fetch vendors failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorPress = (item: any) => {
    Haptics.selectionAsync();
    onVendorPress(item);
  };

  const renderVendorItem = ({ item, index }: { item: any, index: number }) => {
    const hasImages = item.businessImages && item.businessImages.length > 0;
    const image = hasImages ? item.businessImages[0] : "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80";

    const translateY = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50 * (index + 1), 0],
    });

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
          <TouchableOpacity style={styles.card} onPress={() => handleVendorPress(item)} activeOpacity={0.9}>
            <Image source={{ uri: image }} style={styles.image} />
            {!hasImages && (
                <View style={styles.noImageOverlay}>
                    <Ionicons name="image-outline" size={24} color={colors.white} />
                </View>
            )}
            <View style={styles.content}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.businessName}</Text>
                  <Text style={styles.categoryText}>{item.area || item.city}</Text>
                </View>
                <View style={styles.ratingRowSmall}>
                   <Ionicons name="star" size={12} color={colors.primary} />
                   <Text style={styles.ratingTextSmall}>4.5</Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                <Text style={styles.locationText}>{item.area}, {item.city}</Text>
              </View>
            </View>
          </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{category || "Find Vendors"}</Text>
        <TouchableOpacity style={styles.compareBtn}>
           <Ionicons name="git-compare-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            placeholder="Search by name or area..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.id}
          renderItem={renderVendorItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No vendors found</Text>
            </View>
          }
        />
      )}

      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filters</Text>
                <TouchableOpacity onPress={() => setShowFilters(false)}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
             </View>
             <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Sort By</Text>
                <View style={styles.chipRow}>
                    {["Popularity", "Rating", "Price: Low to High", "Price: High to Low"].map(chip => (
                        <TouchableOpacity key={chip} style={styles.chip}>
                            <Text style={styles.chipText}>{chip}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
             </View>
             <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Budget</Text>
                <View style={styles.chipRow}>
                    {["Under ₹50k", "₹50k - ₹1L", "₹1L - ₹5L", "Above ₹5L"].map(chip => (
                        <TouchableOpacity key={chip} style={styles.chip}>
                            <Text style={styles.chipText}>{chip}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
             </View>
             <View style={{ marginTop: 'auto', gap: 12 }}>
                <Button title="Apply Filters" onPress={() => setShowFilters(false)} />
                <Button title="Reset" variant="outline" onPress={() => setShowFilters(false)} />
             </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, height: 60 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "800", color: colors.text },
  compareBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  searchSection: { flexDirection: "row", paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.white, borderRadius: 14, paddingHorizontal: 12, height: 50, borderWidth: 1, borderColor: colors.border },
  input: { flex: 1, marginLeft: 10, fontSize: 14, fontWeight: "600" },
  filterBtn: { width: 50, height: 50, backgroundColor: colors.primary, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 20, gap: 20 },
  card: { backgroundColor: colors.white, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  noImageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 200, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' },
  image: { width: "100%", height: 200 },
  content: { padding: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  ratingRowSmall: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primaryLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  ratingTextSmall: { fontSize: 12, fontWeight: '700', color: colors.primary },
  name: { fontSize: 17, fontWeight: "800", color: colors.text },
  categoryText: { fontSize: 12, color: colors.textMuted, fontWeight: "600", marginTop: 2 },
  price: { fontSize: 16, fontWeight: "900", color: colors.primary },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 10 },
  locationText: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  capacityRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  capacityText: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100 },
  emptyText: { fontSize: 16, color: colors.textMuted, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: colors.text },
  filterGroup: { marginBottom: 24 },
  filterLabel: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.surfaceDark, borderWidth: 1, borderColor: colors.border },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
});
