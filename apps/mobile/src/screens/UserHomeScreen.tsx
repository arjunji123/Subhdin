import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export const APP_CATEGORIES = [
  { name: "Banquet Hall", icon: "business" },
  { name: "Marriage Garden / Farm", icon: "leaf" },
  { name: "Traditional Dhol", icon: "musical-notes" },
  { name: "DJ & Sound System", icon: "volume-high" },
  { name: "Catering Services", icon: "restaurant" },
  { name: "Mehndi Artist", icon: "brush" },
  { name: "Photography & Studio", icon: "camera" },
  { name: "Decoration & Themes", icon: "color-palette" },
  { name: "Tent & Event Setup", icon: "home" },
  { name: "Invitation Cards", icon: "mail" },
  { name: "Travel & Transportation", icon: "car" },
  { name: "Wedding Horse (Ghodi)", icon: "star" },
  { name: "Wedding Band", icon: "musical-notes" },
  { name: "Bridal Makeup & Grooming", icon: "rose" },
  { name: "Choreographer", icon: "people" },
  { name: "Pandit / Priest", icon: "book" },
  { name: "Furniture Rental", icon: "grid" },
  { name: "Lighting & Fireworks", icon: "flash" },
  { name: "Water & Beverage Service", icon: "water" },
  { name: "Other", icon: "apps" },
];

const OFFERS = [];
const FEATURED = [];

type Props = {
  userName?: string;
  homeData?: any;
  onCategoryPress: (category: string) => void;
  onVendorPress: (vendor: any) => void;
  onSearchPress: (query?: string) => void;
};

export function UserHomeScreen({ userName, homeData, onCategoryPress, onVendorPress, onSearchPress }: Props) {
  const insets = useSafeAreaInsets();
  const [showAllCats, setShowAllCats] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const banners = homeData?.banners || [];
  const featured = homeData?.featuredVendors || [];

  useEffect(() => {
      console.log("UserHomeScreen received homeData:", !!homeData, "Featured count:", featured.length);
      // Clean up any old static references if they persist in state
  }, [homeData, userName]);

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
      <View>
        <Text style={styles.greeting}>Hello, {userName || "Guest"} 👋</Text>
        <TouchableOpacity style={styles.locationSelector}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.locationText}>Jaipur, Rajasthan</Text>
          <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.notificationBtn}>
        <Ionicons name="notifications-outline" size={24} color={colors.text} />
        <View style={styles.notifDot} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          placeholder="Search for photographers, venues..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={() => onSearchPress(searchInput)}
          returnKeyType="search"
        />
        <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => onSearchPress(searchInput)}
        >
          <Ionicons name="options-outline" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity onPress={() => setShowAllCats(true)}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
        {APP_CATEGORIES.slice(0, 8).map((item) => (
          <TouchableOpacity key={item.name} style={styles.catItem} onPress={() => onCategoryPress(item.name)}>
            <View style={styles.catIconContainer}>
              <Ionicons name={item.icon as any} size={28} color={colors.primary} />
            </View>
            <Text style={styles.catName} numberOfLines={1}>{item.name.split(" ")[0]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderOffers = () => (
    <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.offerScroll}
        contentContainerStyle={{ paddingHorizontal: 20 }}
    >
      {banners.map((offer: any) => (
        <TouchableOpacity key={offer.id} style={[styles.offerCard]}>
          <Image source={{ uri: offer.image }} style={styles.offerBg} />
          <View style={styles.offerOverlay}>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerSub}>{offer.subtitle || offer.sub}</Text>
            <View style={styles.claimBtn}>
                <Text style={styles.claimText}>Claim Now</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFeatured = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Vendors</Text>
        <TouchableOpacity onPress={() => onSearchPress("")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={featured}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.featuredScroll}
        renderItem={({ item }) => {
          const image = item.thumbnail || item.image || (item.businessImages?.[0]);
          return (
            <TouchableOpacity style={styles.vendorCard} onPress={() => onVendorPress(item)}>
              <Image source={{ uri: image }} style={styles.vendorImage} />
              <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color={colors.white} />
                  <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
              </View>
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>{item.businessName || item.name}</Text>
                <View style={styles.vendorRow}>
                  <Text style={styles.vendorCat}>{item.category}</Text>
                  <View style={styles.dot} />
                  <Text style={styles.vendorLoc}>{item.location || (item.area + ", " + item.city)}</Text>
                </View>
                <Text style={styles.vendorPrice}>Starts from <Text style={{ color: colors.primary, fontWeight: "800" }}>{item.priceRange || item.price || "Contact for Price"}</Text></Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        {renderHeader()}
        {renderSearchBar()}
        <View style={styles.content}>
          {renderOffers()}
          {renderCategories()}
          {renderFeatured()}
          <View style={styles.spacer} />
        </View>
      </ScrollView>

      {/* All Categories Modal */}
      <Modal visible={showAllCats} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>All Categories</Text>
                    <TouchableOpacity onPress={() => setShowAllCats(false)}>
                        <Ionicons name="close" size={26} color={colors.text} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={APP_CATEGORIES}
                    numColumns={3}
                    keyExtractor={item => item.name}
                    contentContainerStyle={styles.modalList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.modalCatItem}
                            onPress={() => {
                                setShowAllCats(false);
                                onCategoryPress(item.name);
                            }}
                        >
                            <View style={styles.modalCatIcon}>
                                <Ionicons name={item.icon as any} size={30} color={colors.primary} />
                            </View>
                            <Text style={styles.modalCatName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: colors.background,
  },
  greeting: { fontSize: 14, color: colors.textMuted, fontWeight: "600" },
  locationSelector: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 4 },
  locationText: { fontSize: 16, fontWeight: "800", color: colors.text },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: "600", color: colors.text },
  searchPlaceholder: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: "600", color: colors.textMuted },
  filterBtn: {
    backgroundColor: colors.primary,
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { marginTop: 10 },
  section: { marginTop: 25 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.text, letterSpacing: -0.5 },
  seeAll: { fontSize: 14, fontWeight: "700", color: colors.primary },
  catScroll: { paddingHorizontal: 18 },
  catItem: { alignItems: "center", marginRight: 20 },
  catIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catName: { fontSize: 12, fontWeight: "700", color: colors.text },
  offerScroll: { marginTop: 10 },
  offerCard: {
    width: width - 40,
    height: 160,
    borderRadius: 24,
    marginRight: 15,
    overflow: "hidden",
    position: "relative"
  },
  offerBg: { width: '100%', height: '100%', position: 'absolute' },
  offerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 24,
    justifyContent: 'center'
  },
  offerTitle: { fontSize: 24, fontWeight: "900", color: colors.white },
  offerSub: { fontSize: 14, fontWeight: "600", color: colors.white, opacity: 0.9, marginTop: 4 },
  claimBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 15
  },
  claimText: { fontSize: 12, fontWeight: "800", color: colors.primary },
  featuredScroll: { paddingHorizontal: 20 },
  vendorCard: {
    width: width * 0.7,
    backgroundColor: colors.white,
    borderRadius: 24,
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  vendorImage: { width: "100%", height: 150 },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4
  },
  ratingText: { color: colors.white, fontSize: 12, fontWeight: "700" },
  vendorInfo: { padding: 16 },
  vendorName: { fontSize: 16, fontWeight: "800", color: colors.text },
  vendorRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 6 },
  vendorCat: { fontSize: 12, fontWeight: "600", color: colors.textMuted },
  vendorLoc: { fontSize: 12, fontWeight: "600", color: colors.textMuted },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textMuted },
  vendorPrice: { fontSize: 13, fontWeight: "600", color: colors.textMuted, marginTop: 10 },
  spacer: { height: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, height: '85%', paddingBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 22, fontWeight: '900', color: colors.text },
  modalList: { padding: 16 },
  modalCatItem: { width: (width - 32) / 3, alignItems: 'center', marginBottom: 24, paddingHorizontal: 4 },
  modalCatIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  modalCatName: { fontSize: 11, fontWeight: '700', color: colors.text, textAlign: 'center' },
});
