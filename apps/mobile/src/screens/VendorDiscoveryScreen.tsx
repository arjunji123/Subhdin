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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Button } from "../components/Button";
import { vendorApi } from "../api";

const { width } = Dimensions.get("window");

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
      if (search) params.search = search;

      params.sortBy = "popularity";

      const data = await vendorApi.getVendors(token, params);
      setVendors(data);

      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Fetch vendors failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorPress = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onVendorPress(item);
  };

  const renderVendorItem = ({ item, index }: { item: any, index: number }) => {
    const hasImages = item.businessImages && item.businessImages.length > 0;
    const image = hasImages ? item.businessImages[0] : "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80";

    const translateY = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [40 * (index % 5 + 1), 0],
    });

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
          <TouchableOpacity style={styles.card} onPress={() => handleVendorPress(item)} activeOpacity={0.98}>
            <View style={styles.imageBox}>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.cardOverlay}>
                    <View style={styles.priceTag}>
                        <Text style={styles.priceText}>From ₹{item.minPrice || item.price || "--"}</Text>
                    </View>
                    <View style={styles.ratingPill}>
                        <Ionicons name="star" size={10} color={colors.white} />
                        <Text style={styles.ratingText}>{item.averageRating || "4.5"}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.cardInfo}>
                <Text style={styles.vTitle}>{item.businessName || item.name}</Text>
                <View style={styles.vMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="location-sharp" size={14} color={colors.primary} />
                        <Text style={styles.metaText} numberOfLines={1}>{item.area}, {item.city}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="ribbon" size={14} color={colors.success} />
                        <Text style={[styles.metaText, { color: colors.success }]}>Verified</Text>
                    </View>
                </View>
            </View>
          </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backPill}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{category || (search ? `Searching "${search}"` : "Subhdin Vendors")}</Text>
        <TouchableOpacity style={styles.filterPill} onPress={() => setShowFilters(true)}>
           <Ionicons name="options" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            placeholder="Search venue, artist, area..."
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={fetchVendors}
            returnKeyType="search"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Curating the best for you...</Text>
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
              <Ionicons name="search" size={60} color={colors.border} />
              <Text style={styles.emptyText}>No vendors found. Try a different search.</Text>
            </View>
          }
        />
      )}

      {/* Modern Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Refine Your Search</Text>
                <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.modalClose}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
             </View>

             <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.filterGroup}>
                    <Text style={styles.filterLabel}>Sort By</Text>
                    <View style={styles.chipRow}>
                        {["Popularity", "Rating", "Price: Low to High"].map(chip => (
                            <TouchableOpacity key={chip} style={styles.chip}>
                                <Text style={styles.chipText}>{chip}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
             </ScrollView>

             <View style={styles.modalFooter}>
                <Button title="Apply Filters" onPress={() => setShowFilters(false)} />
             </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, height: 70 },
  backPill: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.surfaceDark, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "900", color: colors.text, flex: 1, textAlign: 'center' },
  filterPill: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  searchSection: { paddingHorizontal: 20, marginBottom: 15 },
  searchBox: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surfaceDark, borderRadius: 18, paddingHorizontal: 16, height: 56 },
  input: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: "600", color: colors.text },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 15 },
  loadingText: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  list: { padding: 20, paddingBottom: 120 },
  card: { backgroundColor: colors.white, borderRadius: 35, marginBottom: 25, overflow: "hidden", borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 5 },
  imageBox: { width: "100%", height: 230, position: 'relative' },
  image: { width: "100%", height: "100%", resizeMode: 'cover' },
  cardOverlay: { position: 'absolute', top: 15, left: 15, right: 15, flexDirection: 'row', justifyContent: 'space-between' },
  priceTag: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  priceText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  ratingPill: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  ratingText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  cardInfo: { padding: 22 },
  vTitle: { fontSize: 20, fontWeight: "900", color: colors.text },
  vMeta: { flexDirection: 'row', gap: 15, marginTop: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13, fontWeight: '700', color: colors.textMuted, maxWidth: 150 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 100, gap: 15 },
  emptyText: { fontSize: 15, color: colors.textMuted, fontWeight: "600", textAlign: 'center', paddingHorizontal: 50 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 24, height: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: colors.text },
  modalClose: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center' },
  filterGroup: { marginBottom: 30 },
  filterLabel: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 15 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.surfaceDark, borderWidth: 1, borderColor: colors.border },
  chipText: { fontSize: 14, fontWeight: '700', color: colors.text },
  modalFooter: { marginTop: 'auto', paddingTop: 20 },
});
