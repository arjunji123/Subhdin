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
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Button } from "../components/Button";
import { vendorApi } from "../api";
import { getVendorImage } from "../utils/vendor";

const { width } = Dimensions.get("window");
const HEADER_HEIGHT = 380;

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
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [activeModalImg, setActiveModalImg] = useState(0);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0)).current;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, sData, oData] = await Promise.all([
        vendorApi.getVendorDetail(token, vendorId),
        vendorApi.getVendorServices(token, vendorId),
        vendorApi.getVendorOffers(token, vendorId)
      ]);
      setData(vData);
      setServices(sData || []);
      setOffers(oData || []);
    } catch (error) {
      console.error("Fetch failed:", error);
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

  const handleOpenViewer = (images: string[], index: number) => {
    setViewerImages(images);
    setViewerIndex(index);
    setIsViewerVisible(true);
  };

  const handleReveal = () => {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch(e) {}
    setIsRevealed(true);
    Animated.spring(revealScale, { toValue: 1, useNativeDriver: true, friction: 8, tension: 40 }).start();
    onTrackAction('CONTACT_REVEAL');
  };

  const handleWhatsApp = () => {
    const v = data?.vendor;
    if (!v) return;
    onTrackAction('WHATSAPP_CLICK');
    const message = `Hi ${v.businessName}, I found you on Subhdin and I am interested in your services.`;
    Linking.openURL(`whatsapp://send?phone=${v.mobileNumber || v.phone}&text=${encodeURIComponent(message)}`);
  };

  const handleCall = () => {
    const v = data?.vendor;
    if (!v) return;
    Linking.openURL(`tel:${v.mobileNumber || v.phone}`);
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
  const image = getVendorImage(vendor);

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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerImageContainer, { transform: [{ translateY: headerTranslate }, { scale: imageScale }] }]}>
        <Image source={{ uri: image }} style={styles.headerImage} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
      </Animated.View>

      <View style={[styles.toolbar, { top: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.row}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => Share.share({ message: `Check out ${vendor?.businessName} on Subhdin!` })}>
                <Ionicons name="share-social-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={onCompare}>
                <Ionicons name="git-compare-outline" size={22} color={colors.text} />
            </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT - 60 }}
      >
        <View style={styles.mainContent}>
          <View style={styles.dragIndicator} />

          <View style={styles.vendorHeader}>
            <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.businessName}>{vendor?.businessName}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={14} color={colors.primary} />
                        <Text style={styles.locationText}>{vendor?.area}, {vendor?.city}</Text>
                    </View>
                </View>
                <View style={styles.scoreCard}>
                    <Text style={styles.scoreVal}>{(Number(vendor?.averageRating || 0)).toFixed(1)}</Text>
                    <Ionicons name="star" size={12} color={colors.white} />
                </View>
            </View>

            {!isRevealed ? (
                <TouchableOpacity style={styles.revealBox} onPress={handleReveal} activeOpacity={0.9}>
                    <View style={styles.revealInner}>
                        <View style={styles.lockIconBox}>
                            <Ionicons name="lock-closed" size={24} color={colors.primary} />
                        </View>
                        <View style={{ marginLeft: 15 }}>
                            <Text style={styles.revealTitle}>Unlock Contact Details</Text>
                            <Text style={styles.revealDesc}>Connect directly with the expert</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ) : (
                <Animated.View style={[styles.revealedCard, { transform: [{ scale: revealScale }] }]}>
                    <View style={styles.contactPoint}>
                        <Text style={styles.pointLabel}>OWNER</Text>
                        <Text style={styles.pointValue}>{vendor?.ownerName}</Text>
                    </View>
                    <View style={styles.contactPoint}>
                        <Text style={styles.pointLabel}>MOBILE</Text>
                        <Text style={styles.pointValue}>{vendor?.mobileNumber || vendor?.phone}</Text>
                    </View>
                </Animated.View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Ratings Analysis</Text>
            <View style={styles.breakdownRow}>
              <View style={styles.averageBox}>
                <Text style={styles.bigRating}>{(Number(vendor?.averageRating || 0)).toFixed(1)}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Ionicons key={i} name="star" size={12} color={i <= Math.round(vendor?.averageRating || 0) ? colors.primary : colors.surfaceDark} />
                  ))}
                </View>
              </View>
              <View style={styles.barsContainer}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = vendor?.ratingBreakdown?.[star.toString()] || 0;
                  const total = vendor?.reviewCount || reviews.length || 1;
                  const percentage = (count / total) * 100;
                  return (
                    <View key={star} style={styles.barRow}>
                      <View style={styles.barBg}>
                        <View style={[styles.barFill, { width: `${percentage}%` }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.section}>
             <Text style={styles.sectionHeading}>Services & Packages</Text>
             {services.map((service: any) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    onOpen={() => setSelectedService(service)}
                    onImagePress={(idx: number) => handleOpenViewer(service.galleryImages, idx)}
                />
             ))}
          </View>

          {/* Vendor Active Offers Section */}
          {offers.length > 0 && (
            <View style={styles.section}>
                <Text style={styles.sectionHeading}>Active Deals</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
                    {offers.map((offer: any) => (
                        <View key={offer.id} style={styles.vendorOfferCard}>
                            <View style={styles.offerBadge}>
                                <Text style={styles.offerBadgeText}>{offer.discountPercent}% OFF</Text>
                            </View>
                            <Text style={styles.vOfferTitle} numberOfLines={1}>{offer.title}</Text>
                            <Text style={styles.vOfferDesc} numberOfLines={2}>{offer.description}</Text>
                            <Text style={styles.vOfferExpiry}>Ends: {new Date(offer.endDate).toLocaleDateString()}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.rowBetween}>
                <Text style={styles.sectionHeading}>Reviews</Text>
                <TouchableOpacity onPress={onAddReview} style={styles.writeReviewBtn}>
                    <Text style={styles.writeReviewText}>Write Review</Text>
                </TouchableOpacity>
            </View>
            {reviews.map((rev: any) => (
                <View key={rev.id} style={styles.reviewCard}>
                    <View style={styles.row}>
                        <View style={styles.userAvatar}><Text style={styles.userAvatarText}>{rev.userName?.[0] || 'A'}</Text></View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.revNameText}>{rev.userName}</Text>
                            <View style={styles.starsContainer}>
                                {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={10} color={i <= rev.rating ? colors.primary : colors.surfaceDark} />)}
                            </View>
                        </View>
                    </View>
                    <Text style={styles.revCommentText}>{rev.comment}</Text>
                </View>
            ))}
          </View>
          <View style={{ height: 140 }} />
        </View>
      </Animated.ScrollView>

      <View style={[styles.actionDock, { paddingBottom: Math.max(insets.bottom, 15) }]}>
        <TouchableOpacity style={styles.dockCall} onPress={handleCall}><Ionicons name="call" size={22} color={colors.text} /></TouchableOpacity>
        <TouchableOpacity style={styles.dockAddCompare} onPress={onCompare}>
            <Ionicons name="git-compare-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dockWhatsapp} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={24} color={colors.white} /><Text style={styles.dockWhatsappText}>Enquire Now</Text>
        </TouchableOpacity>
      </View>

      {/* Service Detail Modal */}
      <Modal visible={!!selectedService} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={styles.serviceModal}>
                  <View style={styles.dragIndicator} />
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Service Details</Text>
                      <TouchableOpacity onPress={() => setSelectedService(null)} style={styles.closeBtn}>
                          <Ionicons name="close" size={24} color={colors.text} />
                      </TouchableOpacity>
                  </View>

                  {selectedService && (
                      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                          <View style={styles.modalHero}>
                            {selectedService.galleryImages?.length > 0 ? (
                                <View style={{ position: 'relative' }}>
                                    <FlatList
                                        data={selectedService.galleryImages}
                                        horizontal
                                        pagingEnabled
                                        nestedScrollEnabled
                                        showsHorizontalScrollIndicator={false}
                                        onMomentumScrollEnd={(e) => {
                                            const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
                                            setActiveModalImg(index);
                                        }}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity activeOpacity={0.9} onPress={() => handleOpenViewer(selectedService.galleryImages, index)}>
                                                <Image source={{ uri: item }} style={styles.modalHeroImage} />
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(_, i) => i.toString()}
                                    />
                                    <View style={styles.modalPagination}>
                                        {selectedService.galleryImages.map((_: any, i: number) => (
                                            <View key={i} style={[styles.modalDot, activeModalImg === i && styles.modalDotActive]} />
                                        ))}
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.noImagePlaceholder}>
                                    <Ionicons name="images-outline" size={50} color={colors.border} />
                                </View>
                            )}
                          </View>

                          <View style={styles.modalInfo}>
                              <Text style={styles.modalServiceName}>{selectedService.serviceName}</Text>
                              <View style={styles.modalPriceBadge}>
                                  <Text style={styles.modalPriceText}>₹{selectedService.price}</Text>
                              </View>

                              <Text style={styles.modalLabel}>Description</Text>
                              <Text style={styles.modalDesc}>{selectedService.description}</Text>

                              <View style={styles.modalStatsRow}>
                                  <View style={styles.modalStatItem}>
                                      <Ionicons name="people" size={20} color={colors.primary} />
                                      <Text style={styles.modalStatLabel}>Capacity</Text>
                                      <Text style={styles.modalStatValue}>{selectedService.capacity || "N/A"}</Text>
                                  </View>
                                  <View style={styles.modalStatItem}>
                                      <Ionicons name="pricetag" size={20} color={colors.primary} />
                                      <Text style={styles.modalStatLabel}>Category</Text>
                                      <Text style={styles.modalStatValue}>{selectedService.category}</Text>
                                  </View>
                              </View>
                          </View>
                          <View style={{ height: 40 }} />
                      </ScrollView>
                  )}
              </View>
          </View>
      </Modal>

      {/* Full Screen Image Viewer */}
      <Modal visible={isViewerVisible} transparent animationType="fade">
          <View style={styles.viewerContainer}>
              <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />

              <View style={[styles.viewerHeader, { top: insets.top + 10 }]}>
                  <Text style={styles.viewerIndexText}>{viewerIndex + 1} / {viewerImages.length}</Text>
                  <TouchableOpacity onPress={() => setIsViewerVisible(false)} style={styles.viewerCloseBtn}>
                      <Ionicons name="close" size={30} color={colors.white} />
                  </TouchableOpacity>
              </View>

              <FlatList
                  data={viewerImages}
                  key={`viewer-${viewerImages.length}`}
                  horizontal
                  pagingEnabled
                  initialScrollIndex={viewerIndex}
                  getItemLayout={(_, index) => ({
                      length: width,
                      offset: width * index,
                      index,
                  })}
                  onMomentumScrollEnd={(e) => {
                      const index = Math.round(e.nativeEvent.contentOffset.x / width);
                      setViewerIndex(index);
                  }}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                      <View style={styles.viewerImageWrapper}>
                          <Image source={{ uri: item }} style={styles.viewerFullImage} />
                      </View>
                  )}
                  keyExtractor={(_, i) => i.toString()}
              />
          </View>
      </Modal>
    </View>
  );
}

function ServiceCard({ service, onOpen, onImagePress }: any) {
    const [activeIndex, setActiveIndex] = useState(0);
    const hasImages = service.galleryImages?.length > 0;
    const cardWidth = width - 40;

    return (
        <View style={styles.offeringCard}>
            {hasImages && (
                <View style={styles.offeringGalleryWrapper}>
                    <FlatList
                        data={service.galleryImages} horizontal pagingEnabled nestedScrollEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / cardWidth))}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity activeOpacity={0.95} onPress={() => onImagePress?.(index)}>
                                <Image source={{ uri: item }} style={[styles.offeringImage, { width: cardWidth }]} />
                            </TouchableOpacity>
                        )}
                    />
                    <View style={styles.pagination}>
                        {service.galleryImages.map((_: any, i: number) => (
                            <View key={i} style={[styles.dot, activeIndex === i && styles.pDotActive]} />
                        ))}
                    </View>
                </View>
            )}
            <TouchableOpacity style={styles.offeringBody} activeOpacity={0.9} onPress={onOpen}>
                <View style={styles.rowBetween}>
                    <Text style={styles.offeringName}>{service.serviceName}</Text>
                    <Text style={styles.offeringPrice}>₹{service.price}</Text>
                </View>
                <Text style={styles.offeringDesc} numberOfLines={2}>{service.description}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white },
  headerImageContainer: { position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_HEIGHT, backgroundColor: colors.surfaceDark },
  headerImage: { width: width, height: HEADER_HEIGHT, resizeMode: 'cover' },
  toolbar: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 100 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  actionBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', marginLeft: 12, elevation: 3 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mainContent: { flex: 1, backgroundColor: colors.white, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 20, marginTop: -20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  dragIndicator: { width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  vendorHeader: { marginBottom: 20 },
  businessName: { fontSize: 24, fontWeight: '900', color: colors.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  locationText: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  scoreCard: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  scoreVal: { color: colors.white, fontSize: 16, fontWeight: '900' },
  revealBox: { height: 80, borderRadius: 20, overflow: 'hidden', marginTop: 20, backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.primary },
  revealInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: '100%' },
  revealTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  revealDesc: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  revealedCard: { padding: 20, borderRadius: 20, backgroundColor: colors.surface, marginTop: 20, flexDirection: 'row', justifyContent: 'space-around', borderWidth: 1, borderColor: colors.primary },
  contactPoint: { alignItems: 'center' },
  pointLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '800' },
  pointValue: { fontSize: 15, color: colors.text, fontWeight: '800', marginTop: 2 },
  section: { marginTop: 30 },
  sectionHeading: { fontSize: 18, fontWeight: '900', color: colors.text, marginBottom: 15 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 20, backgroundColor: colors.surface, padding: 15, borderRadius: 24, borderWidth: 1, borderColor: colors.border },
  averageBox: { alignItems: 'center' },
  bigRating: { fontSize: 32, fontWeight: '900', color: colors.text },
  starsRow: { flexDirection: 'row' },
  barsContainer: { flex: 1, gap: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center' },
  barBg: { flex: 1, height: 4, backgroundColor: colors.surfaceDark, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  offeringCard: { backgroundColor: colors.surface, borderRadius: 24, marginBottom: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  offeringImage: { height: 200, resizeMode: 'cover' },
  pagination: { position: 'absolute', bottom: 10, alignSelf: 'center', flexDirection: 'row', gap: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  pDotActive: { width: 12, backgroundColor: colors.white },
  offeringBody: { padding: 15 },
  offeringName: { fontSize: 16, fontWeight: '800', color: colors.text },
  offeringPrice: { fontSize: 16, fontWeight: '900', color: colors.primary },
  offeringDesc: { fontSize: 13, color: colors.textMuted, marginTop: 5 },
  writeReviewBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  writeReviewText: { color: colors.primary, fontWeight: '900', fontSize: 12 },
  reviewCard: { padding: 20, backgroundColor: colors.surface, borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: colors.border },
  userAvatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { color: colors.white, fontSize: 18, fontWeight: '900' },
  revNameText: { fontSize: 14, fontWeight: '800', color: colors.text },
  starsContainer: { flexDirection: 'row', marginTop: 2 },
  revCommentText: { fontSize: 13, color: colors.text, marginTop: 10, lineHeight: 18 },
  actionDock: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, padding: 15, flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: colors.border },
  dockCall: { width: 56, height: 56, backgroundColor: colors.surfaceDark, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dockAddCompare: { width: 56, height: 56, backgroundColor: colors.primaryLight, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  dockWhatsapp: { flex: 1, height: 56, backgroundColor: colors.primary, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dockWhatsappText: { color: colors.white, fontSize: 18, fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  serviceModal: { backgroundColor: colors.white, borderTopLeftRadius: 35, borderTopRightRadius: 35, height: '85%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: colors.text },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center' },
  modalHero: { height: 250, borderRadius: 25, overflow: 'hidden', marginBottom: 20 },
  modalHeroImage: { width: width - 40, height: 250, resizeMode: 'cover' },
  noImagePlaceholder: { flex: 1, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center' },
  modalInfo: { gap: 12 },
  modalServiceName: { fontSize: 20, fontWeight: '900', color: colors.text },
  modalPriceBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignSelf: 'flex-start' },
  modalPriceText: { color: colors.primary, fontSize: 16, fontWeight: '900' },
  modalLabel: { fontSize: 11, fontWeight: '800', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 5 },
  modalDesc: { fontSize: 14, color: colors.text, lineHeight: 22, opacity: 0.8 },
  modalStatsRow: { flexDirection: 'row', gap: 15, marginTop: 5 },
  modalStatItem: { flex: 1, backgroundColor: colors.background, padding: 12, borderRadius: 16, alignItems: 'center', gap: 4 },
  modalStatLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '700' },
  modalStatValue: { fontSize: 14, fontWeight: '800', color: colors.text },
  modalPagination: { position: 'absolute', bottom: 15, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  modalDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  modalDotActive: { width: 15, backgroundColor: colors.white },
  viewerContainer: { flex: 1, backgroundColor: 'black' },
  viewerHeader: { position: 'absolute', left: 0, right: 0, zIndex: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  viewerIndexText: { color: colors.white, fontSize: 16, fontWeight: '800' },
  viewerCloseBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  viewerImageWrapper: { width: width, height: '100%', justifyContent: 'center', alignItems: 'center' },
  viewerFullImage: { width: width, height: '80%', resizeMode: 'contain' },
  vendorOfferCard: { backgroundColor: colors.primaryLight, padding: 20, borderRadius: 24, width: width * 0.7, borderWidth: 1, borderColor: colors.primary, gap: 8 },
  offerBadge: { backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  offerBadgeText: { color: colors.white, fontSize: 12, fontWeight: '900' },
  vOfferTitle: { fontSize: 16, fontWeight: '900', color: colors.text },
  vOfferDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  vOfferExpiry: { fontSize: 10, color: colors.primary, fontWeight: '700', marginTop: 4 },
  emptyState: { padding: 30, alignItems: 'center' },
  emptyStateText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
});
