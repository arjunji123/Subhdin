import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Linking,
  ActivityIndicator,
  Animated,
  Platform,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Button } from "../components/Button";
import { vendorApi } from "../api";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 400;

type Props = {
  token: string;
  vendorId: string;
  onBack: () => void;
  onCompare: () => void;
  onAddReview: () => void;
  onTrackAction: (type: 'VIEW' | 'CONTACT_REVEAL' | 'WHATSAPP_CLICK' | 'LEAD') => void;
};

export function VendorDetailScreen({ token, vendorId, onBack, onCompare, onAddReview, onTrackAction }: Props) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0)).current;

  // Use a ref for the function to avoid hoisting issues or re-definition errors
  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, sData] = await Promise.all([
        vendorApi.getVendorDetail(token, vendorId),
        vendorApi.getVendorServices(token, vendorId)
      ]);
      setData(vData);
      setServices(sData || []);
    } catch (error) {
      console.error("Fetch vendor detail failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
        fetchData();
        onTrackAction('VIEW');
    }
  }, [vendorId]);

  const handleReveal = () => {
    try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch(e) {}
    setIsRevealed(true);
    Animated.spring(revealScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
    }).start();
    onTrackAction('CONTACT_REVEAL');
  };

  const handleWhatsApp = () => {
    const v = data?.vendor;
    if (!v) return;
    onTrackAction('WHATSAPP_CLICK');
    const message = `Hi ${v.businessName}, I found your service on Subhdin and I am interested.`;
    Linking.openURL(`whatsapp://send?phone=${v.mobileNumber || v.phone}&text=${encodeURIComponent(message)}`);
  };

  const handleCall = () => {
    const v = data?.vendor;
    if (!v) return;
    Linking.openURL(`tel:${v.mobileNumber || v.phone}`);
  };

  const getSocialIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'logo-youtube';
    if (url.includes('instagram.com')) return 'logo-instagram';
    if (url.includes('facebook.com')) return 'logo-facebook';
    return 'link-outline';
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const vendor = data?.vendor;
  const reviews = data?.reviews || [];
  const image = vendor?.businessImages?.[0] || "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80";

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT / 1.5],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0],
    outputRange: [2, 1],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[
          styles.headerImageContainer,
          { transform: [{ translateY: headerTranslate }, { scale: imageScale }] }
      ]}>
        {vendor?.businessImages?.length > 1 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {vendor.businessImages.map((img: string, index: number) => (
              <Image key={index} source={{ uri: img }} style={styles.headerImage} />
            ))}
          </ScrollView>
        ) : (
          <Image source={{ uri: image }} style={styles.headerImage} />
        )}
        <View style={styles.imageOverlay} />
      </Animated.View>

      <Animated.View style={[styles.toolbar, { top: insets.top + 10, opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.backPill} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.row}>
            <TouchableOpacity style={styles.actionPill} onPress={() => Share.share({ message: `Check out ${vendor?.businessName} on Subhdin!` })}>
                <Ionicons name="share-social-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionPill} onPress={onCompare}>
                <Ionicons name="git-compare-outline" size={22} color={colors.text} />
            </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT - 80 }}
      >
        <View style={styles.mainContent}>
          <View style={styles.dragIndicator} />

          <View style={styles.vendorHeader}>
            <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                        <Text style={styles.businessName}>{vendor?.businessName}</Text>
                        {vendor?.status === 'APPROVED' && (
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="checkmark-seal" size={20} color={colors.success} />
                            </View>
                        )}
                    </View>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={14} color={colors.primary} />
                        <Text style={styles.locationText}>{vendor?.area}, {vendor?.city}</Text>
                    </View>
                </View>
                <View style={styles.scoreCard}>
                    <Text style={styles.scoreVal}>{vendor?.averageRating?.toFixed(1) || "4.5"}</Text>
                    <View style={styles.row}>
                        <Ionicons name="star" size={10} color={colors.white} />
                        <Text style={styles.revCount}>({vendor?.reviewCount || reviews.length})</Text>
                    </View>
                </View>
            </View>

            {!isRevealed ? (
                <TouchableOpacity style={styles.revealBox} onPress={handleReveal} activeOpacity={0.9}>
                    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.revealInner}>
                        <View style={styles.lockIconBox}>
                            <Ionicons name="lock-closed" size={30} color={colors.white} />
                        </View>
                        <Text style={styles.revealTitle}>Reveal Contact Details</Text>
                        <Text style={styles.revealDesc}>Tap to connect with {vendor?.ownerName || 'Expert'}</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <Animated.View style={[styles.revealedCard, { transform: [{ scale: revealScale }] }]}>
                    <View style={styles.contactPoint}>
                        <View style={styles.pointIcon}><Ionicons name="person" size={20} color={colors.primary} /></View>
                        <View>
                            <Text style={styles.pointLabel}>Owner</Text>
                            <Text style={styles.pointValue}>{vendor?.ownerName}</Text>
                        </View>
                    </View>
                    <View style={styles.contactPoint}>
                        <View style={styles.pointIcon}><Ionicons name="call" size={20} color={colors.primary} /></View>
                        <View>
                            <Text style={styles.pointLabel}>Mobile</Text>
                            <Text style={styles.pointValue}>{vendor?.mobileNumber || vendor?.phone}</Text>
                        </View>
                    </View>
                </Animated.View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Rating Breakdown Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Ratings Analysis</Text>
            <View style={styles.breakdownRow}>
              <View style={styles.averageBox}>
                <Text style={styles.bigRating}>{vendor?.averageRating || "4.5"}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Ionicons key={i} name="star" size={16} color={i <= Math.round(vendor?.averageRating || 4.5) ? colors.primary : colors.border} />
                  ))}
                </View>
                <Text style={styles.totalReviewsText}>{vendor?.reviewCount || reviews.length} Reviews</Text>
              </View>
              <View style={styles.barsContainer}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = vendor?.ratingBreakdown?.[star.toString()] || 0;
                  const total = vendor?.reviewCount || reviews.length || 1;
                  const percentage = (count / total) * 100;
                  return (
                    <View key={star} style={styles.barRow}>
                      <Text style={styles.barStarText}>{star}</Text>
                      <View style={styles.barBg}>
                        <View style={[styles.barFill, { width: `${percentage}%` }]} />
                      </View>
                      <Text style={styles.barCountText}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
             <Text style={styles.sectionHeading}>Services & Packages</Text>
             {services.map((service: any) => (
                <ServiceCard key={service.id} service={service} getSocialIcon={getSocialIcon} />
             ))}
          </View>

          <View style={styles.section}>
            <View style={styles.rowBetween}>
                <Text style={styles.sectionHeading}>Customer Stories</Text>
                <TouchableOpacity onPress={onAddReview} style={styles.writeReviewBtn}>
                    <Text style={styles.writeReviewText}>Share Your Story</Text>
                </TouchableOpacity>
            </View>
            {reviews.length === 0 ? (
                <View style={styles.emptyState}><Text style={styles.emptyStateText}>Be the first to share your magic moment!</Text></View>
            ) : (
                reviews.map((rev: any) => (
                    <View key={rev.id} style={styles.premiumReviewCard}>
                        <View style={styles.reviewAccent} />
                        <View style={styles.row}>
                            <View style={styles.userAvatar}>
                                <Text style={styles.userAvatarText}>{rev.userName?.[0] || 'A'}</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 15 }}>
                                <Text style={styles.revNameText}>{rev.userName}</Text>
                                <View style={styles.starsContainer}>
                                    {[1,2,3,4,5].map(i => (
                                        <Ionicons key={i} name="star" size={14} color={i <= rev.rating ? colors.primary : colors.border} />
                                    ))}
                                </View>
                            </View>
                            <View style={styles.dateLabel}>
                                <Text style={styles.dateLabelText}>{new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
                            </View>
                        </View>
                        <View style={styles.commentBox}>
                            <Ionicons name="quote" size={18} color="rgba(184, 134, 11, 0.1)" style={styles.quoteIcon} />
                            <Text style={styles.revCommentText}>{rev.comment}</Text>
                        </View>
                    </View>
                ))
            )}
          </View>
          <View style={{ height: 140 }} />
        </View>
      </Animated.ScrollView>

      <View style={[styles.actionDock, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity style={styles.dockCall} onPress={handleCall}><Ionicons name="call" size={24} color={colors.white} /></TouchableOpacity>
        <TouchableOpacity style={styles.dockWhatsapp} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={26} color={colors.white} /><Text style={styles.dockWhatsappText}>Enquire Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ServiceCard({ service, getSocialIcon }: any) {
    const [activeIndex, setActiveIndex] = useState(0);
    const hasImages = service.galleryImages?.length > 0;
    const cardWidth = width - 48; // content padding is 24 on each side

    return (
        <View style={styles.offeringCard}>
            {hasImages ? (
                <View style={styles.offeringGalleryWrapper}>
                    <FlatList
                        data={service.galleryImages}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
                            setActiveIndex(index);
                        }}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={[styles.offeringImage, { width: cardWidth }]} />
                        )}
                    />
                    <View style={styles.pagination}>
                        {service.galleryImages.map((_: any, i: number) => (
                            <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
                        ))}
                    </View>
                </View>
            ) : (
                <View style={styles.noServiceImageBox}>
                    <Ionicons name="images-outline" size={32} color={colors.border} />
                </View>
            )}
            <View style={styles.offeringBody}>
                <View style={styles.rowBetween}>
                    <Text style={styles.offeringName}>{service.serviceName}</Text>
                    <Text style={styles.offeringPrice}>₹{service.price}</Text>
                </View>
                <Text style={styles.offeringDesc}>{service.description}</Text>
                <View style={styles.offeringTags}>
                    {service.capacity > 0 && (
                        <View style={styles.badgeTag}>
                            <Ionicons name="people" size={14} color={colors.textMuted} />
                            <Text style={styles.badgeText}>{service.capacity} Guests</Text>
                        </View>
                    )}
                    {service.videoUrls?.map((url: string, idx: number) => (
                        <TouchableOpacity key={idx} style={styles.videoLink} onPress={() => Linking.openURL(url)}>
                            <Ionicons name={getSocialIcon(url) as any} size={16} color={colors.primary} />
                            <Text style={styles.videoLinkText}>Portfolio</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerImageContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT, backgroundColor: colors.surfaceDark },
  headerImage: { width: width, height: HEADER_HEIGHT, resizeMode: 'cover' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  toolbar: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 },
  backPill: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  actionPill: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mainContent: { flex: 1, backgroundColor: colors.white, borderTopLeftRadius: 50, borderTopRightRadius: 50, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -15 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20, marginTop: -20 },
  dragIndicator: { width: 50, height: 6, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 25, opacity: 0.5 },
  vendorHeader: { marginBottom: 20 },
  businessName: { fontSize: 28, fontWeight: '900', color: colors.text, letterSpacing: -0.5 },
  verifiedBadge: { marginLeft: 6, marginTop: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  locationText: { fontSize: 15, color: colors.textMuted, fontWeight: '600' },
  scoreCard: { backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 18, alignItems: 'center' },
  scoreVal: { color: colors.white, fontSize: 20, fontWeight: '900' },
  revCount: { color: colors.white, fontSize: 11, fontWeight: '700', marginLeft: 4, opacity: 0.9 },
  revealBox: { height: 160, borderRadius: 35, overflow: 'hidden', marginTop: 30, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: colors.secondary },
  revealInner: { alignItems: 'center', zIndex: 10 },
  lockIconBox: { width: 75, height: 75, borderRadius: 25, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  revealTitle: { fontSize: 20, fontWeight: '900', color: colors.white, letterSpacing: 0.5 },
  revealDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 6 },
  revealedCard: { padding: 25, borderRadius: 35, backgroundColor: colors.primaryLight, marginTop: 30, gap: 20, borderWidth: 1.5, borderColor: colors.primary },
  contactPoint: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  pointIcon: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  pointLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase' },
  pointValue: { fontSize: 17, color: colors.text, fontWeight: '900' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 15, opacity: 0.5 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 24, backgroundColor: colors.background, padding: 20, borderRadius: 32 },
  averageBox: { alignItems: 'center', gap: 4 },
  bigRating: { fontSize: 44, fontWeight: '900', color: colors.text },
  starsRow: { flexDirection: 'row', marginTop: 4 },
  totalReviewsText: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginTop: 4 },
  barsContainer: { flex: 1, gap: 6 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barStarText: { fontSize: 12, fontWeight: '700', color: colors.text, width: 10 },
  barBg: { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  barCountText: { fontSize: 12, fontWeight: '600', color: colors.textMuted, width: 20, textAlign: 'right' },
  section: { marginTop: 35 },
  sectionHeading: { fontSize: 22, fontWeight: '900', color: colors.text, marginBottom: 20 },
  offeringCard: { backgroundColor: colors.white, borderRadius: 32, marginBottom: 24, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  noServiceImageBox: { height: 120, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  offeringGalleryWrapper: { position: 'relative' },
  offeringImage: { width: width - 48, height: 240, resizeMode: 'cover' },
  pagination: { position: 'absolute', bottom: 15, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  activeDot: { width: 20, backgroundColor: colors.white },
  offeringBody: { padding: 20 },
  offeringName: { fontSize: 18, fontWeight: '800', color: colors.text },
  offeringPrice: { fontSize: 18, fontWeight: '900', color: colors.primary },
  offeringDesc: { fontSize: 14, color: colors.textMuted, marginTop: 10, lineHeight: 22 },
  offeringTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  badgeTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surfaceDark, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  videoLink: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  videoLinkText: { fontSize: 12, fontWeight: '800', color: colors.primary },
  writeReviewBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 15 },
  writeReviewText: { color: colors.primary, fontWeight: '900', fontSize: 13 },
  emptyState: { padding: 50, alignItems: 'center' },
  emptyStateText: { fontSize: 15, color: colors.textMuted, fontWeight: '600' },
  premiumReviewCard: {
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 35,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden'
  },
  reviewAccent: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 6, backgroundColor: colors.primary, opacity: 0.8 },
  userAvatar: { width: 54, height: 54, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { color: colors.white, fontSize: 24, fontWeight: '900' },
  revNameText: { fontSize: 17, fontWeight: '800', color: colors.text },
  starsContainer: { flexDirection: 'row', marginTop: 4 },
  dateLabel: { backgroundColor: colors.surfaceDark, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  dateLabelText: { fontSize: 11, color: colors.textMuted, fontWeight: '700' },
  commentBox: { marginTop: 18, position: 'relative' },
  quoteIcon: { position: 'absolute', top: -5, left: -10 },
  revCommentText: { fontSize: 15, color: colors.text, lineHeight: 24, fontWeight: '500', opacity: 0.8 },
  actionDock: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, padding: 20, flexDirection: 'row', gap: 15, borderTopWidth: 1, borderTopColor: colors.border },
  dockCall: { width: 70, height: 70, backgroundColor: colors.secondary, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  dockWhatsapp: { flex: 1, height: 70, backgroundColor: '#25D366', borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  dockWhatsappText: { color: colors.white, fontSize: 18, fontWeight: '900' },
});
