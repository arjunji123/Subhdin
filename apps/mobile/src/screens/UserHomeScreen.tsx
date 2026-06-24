import React, { useState } from "react";
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
];

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

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.headerLeft}>
        <Image source={require("../../assets/logo.png")} style={styles.miniLogo} resizeMode="contain" />
        <View>
            <Text style={styles.greeting}>Namaste,</Text>
            <Text style={styles.userName}>{userName || "Subhdin Guest"}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.notificationBtn}>
        <Ionicons name="notifications-outline" size={22} color={colors.text} />
        <View style={styles.notifDot} />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchSection}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          placeholder="What are you planning today?"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={() => onSearchPress(searchInput)}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchGo} onPress={() => onSearchPress(searchInput)}>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Wedding Services</Text>
        <TouchableOpacity onPress={() => setShowAllCats(true)}>
          <Text style={styles.seeAll}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
        {APP_CATEGORIES.slice(0, 10).map((item) => (
          <TouchableOpacity key={item.name} style={styles.catItem} onPress={() => onCategoryPress(item.name)}>
            <View style={styles.catIconContainer}>
                <View style={styles.catIconInner}>
                    <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                </View>
            </View>
            <Text style={styles.catName} numberOfLines={2}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderHeroSection = () => (
      <View style={styles.heroSection}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80" }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
              <Text style={styles.heroSubtitle}>CELEBRATE WITH STYLE</Text>
              <Text style={styles.heroTitle}>Your Perfect Wedding{'\n'}Starts Here</Text>
              <TouchableOpacity style={styles.heroBtn} onPress={() => onSearchPress()}>
                  <Text style={styles.heroBtnText}>Explore Vendors</Text>
              </TouchableOpacity>
          </View>
      </View>
  );

  const renderFeatured = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Curated for You</Text>
        <TouchableOpacity onPress={() => onSearchPress("")}>
          <Text style={styles.seeAll}>Explore More</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={featured}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.featuredScroll}
        renderItem={({ item }) => {
          const image = item.thumbnail || (item.businessImages && item.businessImages[0]) || "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80";
          return (
            <TouchableOpacity style={styles.vendorCard} onPress={() => onVendorPress(item)}>
              <Image source={{ uri: image }} style={styles.vendorImage} />
              <View style={styles.vendorOverlay}>
                <View style={styles.vRating}>
                    <Ionicons name="star" size={10} color={colors.white} />
                    <Text style={styles.vRatingText}>{item.averageRating ? item.averageRating.toFixed(1) : "0"}</Text>
                </View>
                <View style={styles.vendorDetails}>
                    <Text style={styles.vName} numberOfLines={1}>{item.businessName || item.name}</Text>
                    <View style={styles.vRow}>
                        <Ionicons name="location" size={12} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.vLoc}>{item.area}, {item.city}</Text>
                    </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {renderHeader()}
        {renderSearchBar()}
        {renderHeroSection()}
        <View style={styles.content}>
          {renderCategories()}
          {renderFeatured()}
          <View style={styles.spacer} />
        </View>
      </ScrollView>

      {/* Modern Categories Modal */}
      <Modal visible={showAllCats} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>All Categories</Text>
                    <TouchableOpacity onPress={() => setShowAllCats(false)} style={styles.closeBtn}>
                        <Ionicons name="close" size={24} color={colors.text} />
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
                                <Ionicons name={item.icon as any} size={28} color={colors.primary} />
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
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: colors.white,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  miniLogo: { width: 40, height: 40, borderRadius: 10 },
  greeting: { fontSize: 13, color: colors.textMuted, fontWeight: "600", letterSpacing: 1 },
  userName: { fontSize: 18, fontWeight: "900", color: colors.text, marginTop: -2 },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 12,
    right: 13,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 25,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceDark,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 60,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: "600", color: colors.text },
  searchGo: { backgroundColor: colors.primary, width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  heroSection: { paddingHorizontal: 24, height: 220, marginBottom: 30 },
  heroImage: { width: '100%', height: '100%', borderRadius: 32 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, padding: 30, justifyContent: 'center', left: 24, right: 24 },
  heroSubtitle: { color: colors.white, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  heroTitle: { color: colors.white, fontSize: 28, fontWeight: '900', marginTop: 8, lineHeight: 34 },
  heroBtn: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start', marginTop: 20 },
  heroBtnText: { color: colors.white, fontWeight: '800', fontSize: 13 },
  content: { flex: 1 },
  section: { marginBottom: 35 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: colors.text },
  seeAll: { fontSize: 13, fontWeight: "700", color: colors.primary },
  catScroll: { paddingHorizontal: 18 },
  catItem: { alignItems: "center", width: 85, marginRight: 10 },
  catIconContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  catIconInner: { width: 50, height: 50, borderRadius: 16, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  catName: { fontSize: 11, fontWeight: "700", color: colors.text, textAlign: 'center', lineHeight: 14 },
  featuredScroll: { paddingHorizontal: 20 },
  vendorCard: {
    width: width * 0.75,
    height: 200,
    borderRadius: 30,
    marginRight: 16,
    overflow: "hidden",
    position: 'relative'
  },
  vendorImage: { width: "100%", height: "100%" },
  vendorOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', padding: 20, justifyContent: 'space-between' },
  vRating: { alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.25)', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  vRatingText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  vendorDetails: { gap: 4 },
  vName: { color: colors.white, fontSize: 20, fontWeight: '900' },
  vRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vLoc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  spacer: { height: 120 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, height: '85%', paddingBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 22, fontWeight: '900', color: colors.text },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center' },
  modalList: { padding: 16 },
  modalCatItem: { width: (width - 32) / 3, alignItems: 'center', marginBottom: 25 },
  modalCatIcon: { width: 70, height: 70, borderRadius: 24, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  modalCatName: { fontSize: 11, fontWeight: '700', color: colors.text, textAlign: 'center', paddingHorizontal: 5 },
});
