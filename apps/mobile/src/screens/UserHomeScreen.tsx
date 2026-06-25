import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Modal,
  Animated,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { getVendorImage } from "../utils/vendor";
import { SkeletonLoader } from "../components/Skeleton/SkeletonLoader";
import { BlurView } from "expo-blur";

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

const HERO_BANNERS = [
  {
    id: 1,
    title: "Perfect Venues for Your Big Day",
    subtitle: "STUNNING SPACES",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    category: "Banquet Hall",
    btnText: "Explore Now"
  },
  {
    id: 2,
    title: "Capture Magic in Every Frame",
    subtitle: "STORYTELLERS",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
    category: "Photography",
    btnText: "View Experts"
  }
];

type Props = {
  userName?: string;
  homeData?: any;
  loading?: boolean;
  onCategoryPress: (category: string) => void;
  onVendorPress: (vendor: any) => void;
  onSearchPress: (query?: string) => void;
};

export function UserHomeScreen({ userName, homeData, loading, onCategoryPress, onVendorPress, onSearchPress }: Props) {
  const insets = useSafeAreaInsets();
  const [showAllCats, setShowAllCats] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
      ]).start();
    }
  }, [loading]);

  const featured = homeData?.featuredVendors || [];
  const popular = homeData?.popularVendors || [];
  const nearby = homeData?.nearbyVendors || [];

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.headerLeft}>
        <View style={styles.logoCircle}>
            <Image source={require("../../assets/logo.png")} style={styles.miniLogo} resizeMode="contain" />
        </View>
        <View>
            <Text style={styles.greeting}>Welcome to Subhdin,</Text>
            <Text style={styles.userName}>{userName || "Guest Expert"}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.searchPill} onPress={() => onSearchPress()}>
          <Ionicons name="search" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderHeroCarousel = () => (
      <View style={styles.carouselWrapper}>
          <FlatList
            data={HERO_BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveBanner(index);
            }}
            renderItem={({ item }) => (
                <View style={styles.heroSection}>
                    <Image source={{ uri: item.image }} style={styles.heroImage} />
                    <View style={styles.heroOverlay}>
                        <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
                        <Text style={styles.heroTitle}>{item.title}</Text>
                        <TouchableOpacity style={styles.heroBtn} onPress={() => onCategoryPress(item.category)}>
                            <Text style={styles.heroBtnText}>{item.btnText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
          />
          <View style={styles.pagination}>
              {HERO_BANNERS.map((_, i) => (
                  <View key={i} style={[styles.pDot, activeBanner === i && styles.pActiveDot]} />
              ))}
          </View>
      </View>
  );

  const renderVendorList = (title: string, data: any[]) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => onSearchPress("")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredScroll}
        renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.vendorCard} onPress={() => onVendorPress(item)} activeOpacity={0.9}>
              <Image source={{ uri: getVendorImage(item, index) }} style={styles.vendorImage} />
              <View style={styles.cardInfoOverlay}>
                <View style={styles.vRatingPill}>
                    <Ionicons name="star" size={12} color={colors.white} />
                    <Text style={styles.vRatingText}>
                        {(Number(item.averageRating || item.avgRating || item.rating || 0)).toFixed(1)}
                    </Text>
                </View>
                <View>
                    <Text style={styles.vName} numberOfLines={1}>{item.businessName || item.name}</Text>
                    <Text style={styles.vLocText}>{item.area}, {item.city}</Text>
                </View>
              </View>
            </TouchableOpacity>
        )}
      />
    </View>
  );

  if (loading) {
    return (
        <View style={styles.container}>
            {renderHeader()}
            <View style={{ padding: 24 }}><SkeletonLoader height={230} borderRadius={30} /></View>
            <View style={{ padding: 24 }}><SkeletonLoader height={40} width={150} /></View>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {renderHeader()}

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {renderHeroCarousel()}

            <View style={styles.catGrid}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Event Services</Text>
                    <TouchableOpacity onPress={() => setShowAllCats(true)}>
                        <Ionicons name="apps" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                    {APP_CATEGORIES.slice(0, 10).map(cat => (
                        <TouchableOpacity key={cat.name} style={styles.catItem} onPress={() => onCategoryPress(cat.name)}>
                            <View style={styles.catIconBox}>
                                <Ionicons name={cat.icon as any} size={24} color={colors.primary} />
                            </View>
                            <Text style={styles.catNameText}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {renderVendorList("Handpicked Experts", featured)}
            {renderVendorList("Most Popular", popular)}
            {nearby.length > 0 && renderVendorList("Around You", nearby)}

            <View style={{ height: 120 }} />
        </Animated.View>
      </ScrollView>

      {/* Modern Categories Modal */}
      <Modal visible={showAllCats} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>All Categories</Text>
                      <TouchableOpacity onPress={() => setShowAllCats(false)}>
                          <Ionicons name="close-circle" size={32} color={colors.textMuted} />
                      </TouchableOpacity>
                  </View>
                  <FlatList
                    data={APP_CATEGORIES}
                    numColumns={3}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.modalCatItem}
                            onPress={() => {
                                setShowAllCats(false);
                                onCategoryPress(item.name);
                            }}
                        >
                            <View style={styles.catIconBox}>
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingBottom: 25 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  logoCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5 },
  miniLogo: { width: 30, height: 30 },
  greeting: { fontSize: 13, color: colors.textMuted, fontWeight: "600", letterSpacing: 1 },
  userName: { fontSize: 20, fontWeight: "900", color: colors.text, marginTop: -2 },
  searchPill: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },

  carouselWrapper: { marginBottom: 35 },
  heroSection: { width: width, paddingHorizontal: 24, height: 260 },
  heroImage: { width: '100%', height: '100%', borderRadius: 35 },
  heroOverlay: { position: 'absolute', bottom: 20, left: 44, right: 44, padding: 25, borderRadius: 25, backgroundColor: "rgba(255, 255, 255, 0.9)", borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  heroSubtitle: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 2 },
  heroTitle: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: 5 },
  heroBtn: { backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, alignSelf: 'flex-start', marginTop: 15 },
  heroBtnText: { color: colors.white, fontWeight: '800', fontSize: 12 },
  pagination: { flexDirection: 'row', gap: 6, position: 'absolute', bottom: -15, alignSelf: 'center' },
  pDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  pActiveDot: { width: 20, backgroundColor: colors.primary },

  catGrid: { marginBottom: 35 },
  catScroll: { paddingHorizontal: 20, gap: 18 },
  catItem: { alignItems: 'center', width: 85 },
  catIconBox: { width: 64, height: 64, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, elevation: 2 },
  catNameText: { fontSize: 11, fontWeight: '700', color: colors.text, marginTop: 10, textAlign: 'center' },

  section: { marginBottom: 35 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: colors.text },
  seeAll: { fontSize: 14, fontWeight: "700", color: colors.primary },
  featuredScroll: { paddingHorizontal: 20, gap: 20 },
  vendorCard: { width: width * 0.7, height: 240, borderRadius: 35, overflow: "hidden", position: 'relative', backgroundColor: colors.surface, elevation: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15 },
  vendorImage: { width: "100%", height: "100%", resizeMode: 'cover' },
  cardInfoOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: "rgba(255, 255, 255, 0.95)" },
  vRatingPill: { position: 'absolute', top: -35, right: 20, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  vRatingText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  vName: { color: colors.text, fontSize: 18, fontWeight: '900' },
  vLocText: { color: colors.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, height: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: colors.text },
  modalCatItem: { flex: 1, alignItems: 'center', marginBottom: 25 },
  modalCatName: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 10 }
});
