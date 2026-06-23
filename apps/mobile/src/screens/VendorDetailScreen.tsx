import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Button } from "../components/Button";
import { vendorApi } from "../api";

const { width } = Dimensions.get("window");

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
  const revealAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
    onTrackAction('VIEW');
  }, [vendorId]);

  const handleReveal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsRevealed(true);
    Animated.spring(revealAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
    }).start();
    onTrackAction('CONTACT_REVEAL');
  };

  const handleWhatsApp = () => {
    const vendor = data?.vendor;
    if (!vendor) return;
    onTrackAction('WHATSAPP_CLICK');
    const message = `Hi ${vendor.businessName}, I found your service on Subhdin and I am interested.`;
    Linking.openURL(`whatsapp://send?phone=${vendor.mobileNumber || vendor.phone}&text=${encodeURIComponent(message)}`);
  };

  const handleCall = () => {
    const vendor = data?.vendor;
    if (!vendor) return;
    Linking.openURL(`tel:${vendor.mobileNumber || vendor.phone}`);
  };

  const openSocial = (url: string) => {
    if (url) Linking.openURL(url);
  };

  const getSocialIcon = (url: string) => {
    if (url.includes('youtube.com')) return 'logo-youtube';
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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Gallery Header */}
        <View style={styles.galleryContainer}>
          {vendor?.businessImages?.length > 0 ? (
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
              {vendor.businessImages.map((img: string, index: number) => (
                <Image key={index} source={{ uri: img }} style={styles.headerImage} />
              ))}
            </ScrollView>
          ) : (
            <Image source={{ uri: image }} style={styles.headerImage} />
          )}
          <View style={[styles.headerActions, { top: insets.top + 10 }]}>
            <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <div style={styles.row}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => Share.share({ message: `Check out ${vendor?.businessName} on Subhdin!` })}>
                    <Ionicons name="share-social-outline" size={22} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={onCompare}>
                    <Ionicons name="git-compare-outline" size={22} color={colors.text} />
                </TouchableOpacity>
            </div>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{vendor?.businessName}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={14} color={colors.primary} />
                        <Text style={styles.locationText}>{vendor?.area}, {vendor?.city}</Text>
                    </View>
                </View>
                <View style={styles.ratingBox}>
                    <Text style={styles.ratingVal}>4.5</Text>
                    <View style={styles.row}>
                        <Ionicons name="star" size={10} color={colors.white} />
                        <Text style={styles.reviewCount}>({reviews.length})</Text>
                    </View>
                </View>
            </View>

            {/* Premium Reveal Contact Card */}
            {!isRevealed ? (
                <TouchableOpacity style={styles.revealContainer} onPress={handleReveal} activeOpacity={0.9}>
                    <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                    <View style={styles.revealInner}>
                        <Ionicons name="lock-closed" size={24} color={colors.primary} />
                        <Text style={styles.revealText}>Tap to Reveal Contact Details</Text>
                        <Text style={styles.revealSub}>Get direct access to {vendor?.ownerName || 'the vendor'}</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <Animated.View style={[styles.contactCard, { transform: [{ scale: revealAnim }] }]}>
                    <View style={styles.contactItem}>
                        <View style={styles.contactIcon}>
                            <Ionicons name="person" size={18} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Owner</Text>
                            <Text style={styles.contactValue}>{vendor?.ownerName || "Service Partner"}</Text>
                        </View>
                    </View>
                    <View style={styles.contactItem}>
                        <View style={styles.contactIcon}>
                            <Ionicons name="call" size={18} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.contactLabel}>Phone</Text>
                            <Text style={styles.contactValue}>{vendor?.mobileNumber || vendor?.phone}</Text>
                        </View>
                    </View>
                </Animated.View>
            )}

            {/* Social Links */}
            <View style={styles.socialRow}>
                {vendor?.mapLocationUrl && (
                    <TouchableOpacity style={styles.socialBtn} onPress={() => openSocial(vendor.mapLocationUrl)}>
                        <Ionicons name="map-outline" size={20} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Services Section */}
          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Services & Packages</Text>
             {services.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                    {service.galleryImages?.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceGallery}>
                            {service.galleryImages.map((img: string, i: number) => (
                                <Image key={i} source={{ uri: img }} style={styles.serviceImage} />
                            ))}
                        </ScrollView>
                    )}
                    <View style={styles.serviceBody}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.serviceName}>{service.serviceName}</Text>
                            <Text style={styles.servicePrice}>₹{service.price}</Text>
                        </View>
                        <Text style={styles.serviceDesc}>{service.description}</Text>

                        <View style={styles.serviceFooter}>
                            {service.capacity > 0 && (
                                <View style={styles.tag}>
                                    <Ionicons name="people-outline" size={14} color={colors.textMuted} />
                                    <Text style={styles.tagText}>{service.capacity} Guests</Text>
                                </View>
                            )}
                            {service.videoUrls?.map((url: string, idx: number) => (
                                <TouchableOpacity key={idx} style={styles.videoLink} onPress={() => Linking.openURL(url)}>
                                    <Ionicons name={getSocialIcon(url) as any} size={16} color={colors.primary} />
                                    <Text style={styles.videoText}>Watch Video</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
             ))}
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.rowBetween}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <TouchableOpacity onPress={onAddReview}>
                    <Text style={styles.addReviewText}>Write a Review</Text>
                </TouchableOpacity>
            </View>
            {reviews.length === 0 ? (
                <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
            ) : (
                reviews.map((rev: any) => (
                    <View key={rev.id} style={styles.reviewCard}>
                        <View style={styles.row}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{rev.userName?.[0] || 'A'}</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.reviewerName}>{rev.userName}</Text>
                                <View style={styles.row}>
                                    {[1,2,3,4,5].map(i => (
                                        <Ionicons key={i} name="star" size={12} color={i <= rev.rating ? colors.primary : colors.border} />
                                    ))}
                                </View>
                            </View>
                            <Text style={styles.reviewDate}>{new Date(rev.createdAt).toLocaleDateString()}</Text>
                        </View>
                        <Text style={styles.reviewText}>{rev.comment}</Text>
                    </View>
                ))
            )}
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.bottomActions, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
          <Ionicons name="call" size={24} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={24} color={colors.white} />
          <Text style={styles.whatsappText}>Enquiry on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  galleryContainer: { height: 350, position: 'relative', backgroundColor: colors.surfaceDark },
  headerImage: { width: width, height: 350, resizeMode: 'cover' },
  headerActions: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  content: { flex: 1, backgroundColor: colors.white, marginTop: -30, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24 },
  mainInfo: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '900', color: colors.text, letterSpacing: -0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  locationText: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  ratingBox: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, alignItems: 'center' },
  ratingVal: { color: colors.white, fontSize: 18, fontWeight: '900' },
  reviewCount: { color: colors.white, fontSize: 10, fontWeight: '700', marginLeft: 4, opacity: 0.9 },
  revealContainer: {
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: 'rgba(184, 134, 11, 0.05)',
  },
  revealInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  revealText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  revealSub: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  contactCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.surface,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  contactIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  contactLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  contactValue: { fontSize: 15, color: colors.text, fontWeight: '800' },
  socialRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  socialBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 16 },
  serviceCard: { backgroundColor: colors.surface, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  serviceGallery: { height: 120, borderBottomWidth: 1, borderBottomColor: colors.border },
  serviceImage: { width: 160, height: 120, marginRight: 2 },
  serviceBody: { padding: 16 },
  serviceName: { fontSize: 16, fontWeight: '800', color: colors.text },
  servicePrice: { fontSize: 16, fontWeight: '900', color: colors.primary },
  serviceDesc: { fontSize: 14, color: colors.textMuted, marginTop: 4, lineHeight: 20 },
  serviceFooter: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceDark, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  videoLink: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primaryLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  videoText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  addReviewText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  noReviews: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 10 },
  reviewCard: { padding: 16, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 18, fontWeight: '900' },
  reviewerName: { fontSize: 15, fontWeight: '700', color: colors.text },
  reviewDate: { fontSize: 11, color: colors.textMuted },
  reviewText: { fontSize: 14, color: colors.textMuted, marginTop: 10, lineHeight: 20 },
  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, padding: 20, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: colors.border },
  callBtn: { width: 60, height: 60, backgroundColor: colors.secondary, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  whatsappBtn: { flex: 1, height: 60, backgroundColor: '#25D366', borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  whatsappText: { color: colors.white, fontSize: 16, fontWeight: '800' },
});
