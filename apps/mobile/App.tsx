import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar as RNStatusBar,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { authApi, vendorApi } from "./src/api";
import { uploadToCloudinary } from "./src/api/cloudinary";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterProfileScreen } from "./src/screens/RegisterProfileScreen";
import { EditProfileScreen } from "./src/screens/EditProfileScreen";
import { OtpVerifyScreen } from "./src/screens/OtpVerifyScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { ServiceListScreen } from "./src/screens/ServiceListScreen";
import { ServicesScreen } from "./src/screens/ServicesScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { ReviewsScreen } from "./src/screens/ReviewsScreen";
import { GrowBusinessScreen } from "./src/screens/GrowBusinessScreen";
import { OfferListScreen } from "./src/screens/OfferListScreen";
import { OfferFormScreen } from "./src/screens/OfferFormScreen";
import { HelpSupportScreen } from "./src/screens/HelpSupportScreen";
import { UserHomeScreen } from "./src/screens/UserHomeScreen";
import { VendorDiscoveryScreen } from "./src/screens/VendorDiscoveryScreen";
import { VendorDetailScreen } from "./src/screens/VendorDetailScreen";
import { VendorCompareScreen } from "./src/screens/VendorCompareScreen";
import { AddReviewScreen } from "./src/screens/AddReviewScreen";
import { colors } from "./src/theme/colors";

type Tab = "dashboard" | "services" | "offers" | "profile" | "user_home" | "user_search" | "user_vendors";
type ViewState =
  | "login" | "signup" | "otp_verify" | "main" | "service_form"
  | "reviews" | "edit_profile" | "grow_business" | "offer_form" | "help_support"
  | "user_discovery" | "user_vendor_detail" | "user_compare" | "user_add_review" | "celebration";

const TOKEN_KEY = "@subhdin_token";
const ROLE_KEY = "@subhdin_role";

function AppContent() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<ViewState>("login");
  const [tab, setTab] = useState<Tab>("user_home");
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const [userRole, setUserRole] = useState<"user" | "vendor">("user");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [signupData, setSignupData] = useState<any>(null);

  const [dashboard, setDashboard] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // User Side States
  const [homeData, setHomeData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [compareList, setCompareList] = useState<any[]>([]);

  const isLoggedIn = useMemo(() => token.length > 0, [token]);

  useEffect(() => {
    checkPersistedToken();
  }, []);

  async function checkPersistedToken() {
    try {
      const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const savedRole = await AsyncStorage.getItem(ROLE_KEY);
      const savedProfile = await AsyncStorage.getItem("@subhdin_user_data");

      if (savedToken) {
        if (savedRole) setUserRole(savedRole as any);
        if (savedProfile) setProfile(JSON.parse(savedProfile));
        setToken(savedToken);
      }
    } catch (e) {
    } finally {
      setLoading(false);
      setAppReady(true);
    }
  }

  useEffect(() => {
    if (isLoggedIn && appReady) {
      loadInitialData();
    }
  }, [isLoggedIn, appReady]);

  async function loadInitialData() {
    if (!token) return;
    setLoading(true);
    try {
      // Get role directly from storage to be 100% sure we have the latest
      const savedRole = await AsyncStorage.getItem(ROLE_KEY);
      const currentRole = savedRole || userRole || 'user';

      console.log("🔄 Loading initial data for role:", currentRole);

      if (currentRole === 'vendor') {
        const prof = await vendorApi.getProfile(token);
        setProfile(prof);
        // Load vendor specific data
        const [dash, srvs, offs] = await Promise.all([
            vendorApi.getDashboard(token),
            vendorApi.getServices(token),
            vendorApi.getOffers(token)
        ]);
        setDashboard(dash);
        setServices(srvs);
        setOffers(offs);
      } else {
        // FOR USERS
        try {
            const prof = await vendorApi.getUserProfile(token);
            setProfile(prof);
            await AsyncStorage.setItem("@subhdin_user_data", JSON.stringify(prof));
        } catch (e) {
            const savedProfile = await AsyncStorage.getItem("@subhdin_user_data");
            if (savedProfile) setProfile(JSON.parse(savedProfile));
        }
        await loadFeaturedVendors();
      }

      // Finalize view state
      setUserRole(currentRole as any);
      setView("main");
      setTab(currentRole === "vendor" ? "dashboard" : "user_home");
    } catch (err: any) {
      console.error("Initial load failed:", err);
      if (err.message?.includes("401") || err.status === 401) {
        await handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadFeaturedVendors() {
    try {
      console.log("Loading vendors for home screen...");
      const data = await vendorApi.getVendors(token, { limit: 10 });
      setHomeData({ featuredVendors: data, banners: [] });
    } catch (err) {
      console.error("Home vendors load failed:", err);
    }
  }

  async function loadDashboard() {
    try {
      const data = await vendorApi.getDashboard(token);
      setDashboard(data);
    } catch (err) {}
  }

  async function loadServices() {
    try {
      const data = await vendorApi.getServices(token);
      setServices(data);
    } catch (err) {}
  }

  async function loadOffers() {
    try {
      const data = await vendorApi.getOffers(token);
      setOffers(data);
    } catch (err) {}
  }

  async function requestOtp(targetPhone: string, type: "login" | "signup" = "login") {
    if (!targetPhone || targetPhone.length < 10) {
      return Alert.alert("Invalid Number", "Enter a valid 10-digit number");
    }
    setLoading(true);
    setAuthType(type);
    setAuthError(null);
    try {
      // Always use requestOtp unified endpoint
      await authApi.requestOtp(targetPhone);
      setPhone(targetPhone);
      setView("otp_verify");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err: any) {
      Alert.alert("Oops!", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!otp || otp.length < 6) {
      setAuthError("Please enter 6-digit OTP");
      return;
    }
    setLoading(true);
    setAuthError(null);
    try {
      const role = authType === "signup" ? signupData.role : userRole;
      const data = await authApi.verifyOtp(phone, otp, role, authType === "signup" ? signupData : {});

      // Use the actual role from the backend response
      const verifiedRole = data.user.role;

      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(ROLE_KEY, verifiedRole);
      await AsyncStorage.setItem("@subhdin_user_data", JSON.stringify(data.user));

      setUserRole(verifiedRole);
      setProfile(data.user);
      setToken(data.token);
      setSignupData(null);

      // Navigate to the correct flow immediately
      setView("main");
      setTab(verifiedRole === "vendor" ? "dashboard" : "user_home");

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setAuthError("Incorrect code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
        await AsyncStorage.multiRemove([TOKEN_KEY, ROLE_KEY, "@subhdin_user_data"]);
    } catch(e) {}
    setToken("");
    setPhone("");
    setOtp("");
    setUserRole("user");
    setProfile(null);
    setDashboard(null);
    setServices([]);
    setOffers([]);
    setView("login");
  }

  async function handleUpdateProfile(data: any) {
    setLoading(true);
    try {
      await vendorApi.updateProfile(token, data);
      await loadInitialData();
      setView("main");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Profile updated");
    } catch (err) {
      Alert.alert("Error", "Update failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveService(data: any, selectedImages: string[]) {
    setLoading(true);
    try {
      const existingUrls = selectedImages.filter(uri => uri.startsWith('http'));
      const localUris = selectedImages.filter(uri => !uri.startsWith('http'));
      const newUrls = await Promise.all(localUris.map(uri => uploadToCloudinary(token, uri)));
      const finalData = { ...data, galleryImages: [...existingUrls, ...newUrls] };

      if (editingService) {
        await vendorApi.updateService(token, editingService.id, finalData);
      } else {
        await vendorApi.createService(token, finalData);
      }
      await loadServices();
      setView("main");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Service listing saved!");
    } catch (err: any) {
      Alert.alert("Error", "Failed to save service. Check all required fields.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteService(id: string) {
    try {
      await vendorApi.deleteService(token, id);
      await loadServices();
      Alert.alert("Success", "Listing removed.");
    } catch (err) {
      Alert.alert("Error", "Could not delete. Please try again.");
    }
  }

  async function handleSaveOffer(data: any) {
    setLoading(true);
    try {
      if (editingOffer) {
        await vendorApi.updateOffer(token, editingOffer.id, data);
      } else {
        await vendorApi.createOffer(token, data);
      }
      await loadOffers();
      setView("main");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Offer published!");
    } catch (err) {
      Alert.alert("Error", "Failed to save offer.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteOffer(id: string) {
    try {
      await vendorApi.deleteOffer(token, id);
      await loadOffers();
      Alert.alert("Success", "Offer removed.");
    } catch (err) {
      Alert.alert("Error", "Delete failed.");
    }
  }

  async function handleToggleOffer(offer: any) {
    try {
        await vendorApi.updateOffer(token, offer.id, { isActive: !offer.isActive });
        await loadOffers();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {}
  }

  if (loading && !isLoggedIn && view === "login") {
    return (
      <View style={styles.centered}>
        <Image source={require("./assets/logo.png")} style={{ width: 150, height: 150, marginBottom: 20 }} resizeMode="contain" />
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  async function handleTrackEvent(vendorId: string, type: 'VIEW' | 'CONTACT_REVEAL' | 'WHATSAPP_CLICK' | 'LEAD') {
    if (!token) return;
    try {
      await vendorApi.trackEvent(token, vendorId, type);
    } catch (err) {}
  }

  async function handleReviewSubmit(rating: number, comment: string, userName: string) {
    setLoading(true);
    try {
      await vendorApi.submitReview(token, selectedVendor.id, { rating, comment, userName });
      setView("celebration");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Auto close celebration after 3s
      setTimeout(() => {
        setView("user_vendor_detail");
      }, 3500);
    } catch (error) {
      Alert.alert("Error", "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.flex}>
        {view === "login" && (
          <View style={styles.centerContent}>
            <LoginScreen phone={phone} setPhone={setPhone} onSendOtp={() => requestOtp(phone, "login")} onGoToSignup={() => setView("signup")} loading={loading} />
          </View>
        )}

        {view === "signup" && (
          <RegisterProfileScreen onComplete={(data, role) => {
            setSignupData({...data, role});
            requestOtp(data.mobileNumber, "signup");
          }} onBack={() => setView("login")} loading={loading} />
        )}

        {view === "otp_verify" && (
          <OtpVerifyScreen phone={phone} otp={otp} setOtp={(v) => { setOtp(v); setAuthError(null); }} onVerify={verifyOtp} onResend={() => requestOtp(phone, authType)} onBack={() => setView("login")} loading={loading} error={authError} />
        )}

        {view === "reviews" && <ReviewsScreen reviews={[]} onBack={() => setView("main")} />}
        {view === "grow_business" && <GrowBusinessScreen onBack={() => setView("main")} onContactSupport={() => setView("help_support")} />}
        {view === "help_support" && <HelpSupportScreen onBack={() => setView(isLoggedIn ? "main" : "login")} />}
        {view === "edit_profile" && <EditProfileScreen profile={profile} onSave={handleUpdateProfile} onBack={() => setView("main")} loading={loading} />}
        {view === "service_form" && <ServicesScreen initialData={editingService} onSave={handleSaveService} onCancel={() => setView("main")} loading={loading} isReadOnly={isReadOnly} />}
        {view === "offer_form" && <OfferFormScreen initialData={editingOffer} onSave={handleSaveOffer} onCancel={() => setView("main")} loading={loading} />}

        {/* User Discovery Views */}
        {view === "user_discovery" && (
            <VendorDiscoveryScreen
                token={token}
                category={selectedCategory}
                initialQuery={searchQuery}
                onBack={() => setView("main")}
                onVendorPress={(v) => { setSelectedVendor(v); setView("user_vendor_detail"); }}
            />
        )}
        {view === "user_vendor_detail" && (
            <VendorDetailScreen
                token={token}
                vendorId={selectedVendor?.id}
                onBack={() => setView(selectedCategory || searchQuery ? "user_discovery" : "main")}
                onCompare={() => {
                    setCompareList([selectedVendor, ...compareList.filter(x => x.id !== selectedVendor.id)].slice(0,3));
                    setView("user_compare");
                }}
                onAddReview={() => setView("user_add_review")}
                onTrackAction={(type) => handleTrackEvent(selectedVendor.id, type)}
            />
        )}
        {view === "user_compare" && (
            <VendorCompareScreen
                vendors={compareList}
                onBack={() => setView("user_vendor_detail")}
            />
        )}
        {view === "user_add_review" && (
            <AddReviewScreen
                vendorName={selectedVendor?.businessName}
                userName={profile?.fullName || profile?.name || "Customer"}
                onBack={() => setView("user_vendor_detail")}
                onSubmit={(r, c) => handleReviewSubmit(r, c, profile?.fullName || profile?.name || "Customer")}
                loading={loading}
            />
        )}

        {view === "celebration" && (
            <View style={styles.celebrationContainer}>
                <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
                <Animated.View style={styles.celebrationContent}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="star" size={50} color={colors.primary} />
                    </View>
                    <Text style={styles.celebrationTitle}>Magical Review!</Text>
                    <Text style={styles.celebrationSub}>Your story has been added to our community. Thank you for making Subhdin better.</Text>
                    <View style={styles.goldLine} />
                </Animated.View>
            </View>
        )}

        {view === "main" && (
          <View style={styles.flex}>
            {userRole === "vendor" ? (
              <>
                {tab === "dashboard" && (
                  <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                    <Image source={require("./assets/logo.png")} style={styles.headerLogo} resizeMode="contain" />
                    <View style={styles.headerInfo}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.ownerName} numberOfLines={1}>{profile?.ownerName || "Partner"}</Text>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={14} color="#B8860B" />
                          <Text style={styles.headerRatingText}>{dashboard?.avgRating ? dashboard.avgRating.toFixed(1) : "5.0"}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.growBtn} onPress={() => setView("grow_business")}>
                        <Ionicons name="rocket-sharp" size={24} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View style={[styles.mainContent, tab !== "dashboard" && { paddingTop: insets.top + 10 }]}>
                  {tab === "dashboard" && <DashboardScreen data={dashboard} loading={loading} onRefresh={loadDashboard} onViewReviews={() => setView("reviews")} />}
                  {tab === "services" && <ServiceListScreen services={services} onAdd={() => { setEditingService(null); setIsReadOnly(false); setView("service_form"); }} onEdit={(s) => { setEditingService(s); setIsReadOnly(false); setView("service_form"); }} onView={(s) => { setEditingService(s); setIsReadOnly(true); setView("service_form"); }} onDelete={handleDeleteService} loading={loading} />}
                  {tab === "offers" && <OfferListScreen offers={offers} onAdd={() => { setEditingOffer(null); setView("offer_form"); }} onEdit={(o) => { setEditingOffer(o); setView("offer_form"); }} onDelete={handleDeleteOffer} onToggleActive={handleToggleOffer} loading={loading} />}
                  {tab === "profile" && <ProfileScreen profile={profile} onUpdate={() => setView("edit_profile")} onLogout={handleLogout} onHelp={() => setView("help_support")} onDeleteAccount={handleLogout} loading={loading} />}
                </View>
              </>
            ) : (
              <View style={styles.mainContent}>
                 {tab === "user_home" && (
                    <UserHomeScreen
                        userName={profile?.fullName || profile?.name}
                        homeData={homeData}
                        onCategoryPress={(cat) => {
                            setSelectedCategory(cat);
                            setSearchQuery("");
                            setView("user_discovery");
                        }}
                        onVendorPress={(v) => { setSelectedVendor(v); setView("user_vendor_detail"); }}
                        onSearchPress={(q) => {
                            setSelectedCategory("");
                            setSearchQuery(q || "");
                            setView("user_discovery");
                        }}
                    />
                 )}
                 {tab === "user_vendors" && (
                     <VendorDiscoveryScreen
                        token={token}
                        onBack={() => setTab("user_home")}
                        onVendorPress={(v) => { setSelectedVendor(v); setView("user_vendor_detail"); }}
                    />
                 )}
                 {tab === "offers" && (
                     <VendorDiscoveryScreen
                        token={token}
                        category="Offers"
                        onBack={() => setTab("user_home")}
                        onVendorPress={(v) => { setSelectedVendor(v); setView("user_vendor_detail"); }}
                    />
                 )}
                 {tab === "profile" && <ProfileScreen profile={profile} onUpdate={() => setView("edit_profile")} onLogout={handleLogout} onHelp={() => setView("help_support")} onDeleteAccount={handleLogout} loading={loading} />}
              </View>
            )}

            {/* Glassy Bottom Navigation Bar */}
            <View style={[styles.navContainer, { paddingBottom: insets.bottom }]}>
               {Platform.OS === 'ios' ? (
                 <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="light" />
               ) : (
                 <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]} />
               )}
              <View style={styles.bottomNav}>
                {userRole === "vendor" ? (
                  <>
                    <NavButton active={tab === "dashboard"} icon="grid" label="Home" onPress={() => setTab("dashboard")} />
                    <NavButton active={tab === "services"} icon="briefcase" label="Services" onPress={() => setTab("services")} />
                    <NavButton active={tab === "offers"} icon="flame" label="Offers" onPress={() => setTab("offers")} />
                    <NavButton active={tab === "profile"} icon="person" label="Account" onPress={() => setTab("profile")} />
                  </>
                ) : (
                  <>
                    <NavButton active={tab === "user_home"} icon="home" label="Explore" onPress={() => setTab("user_home")} />
                    <NavButton active={tab === "user_vendors"} icon="people" label="Vendors" onPress={() => setTab("user_vendors")} />
                    <NavButton active={tab === "offers"} icon="flame" label="Offers" onPress={() => setTab("offers")} />
                    <NavButton active={tab === "profile"} icon="person" label="Profile" onPress={() => setTab("profile")} />
                  </>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

function NavButton({ active, icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.navBtn} onPress={onPress}>
      <Ionicons name={active ? icon : `${icon}-outline`} size={24} color={active ? colors.primary : colors.textMuted} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white },
  centerContent: { flex: 1, padding: 24, justifyContent: "center" },
  mainContent: { flex: 1, paddingBottom: 80 }, // Account for absolute bottom nav
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.white },
  headerLogo: { width: 72, height: 72, marginLeft: -10 },
  headerInfo: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginLeft: 8 },
  welcomeText: { fontSize: 12, color: colors.textMuted, fontWeight: "600", textTransform: 'uppercase' },
  ownerName: { fontSize: 18, fontWeight: "900", color: colors.text, letterSpacing: -0.5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  headerRatingText: { fontSize: 13, fontWeight: "800", color: "#B8860B" },
  growBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  bottomNav: {
    flexDirection: "row",
    height: 65,
    paddingTop: 10,
  },
  navBtn: { flex: 1, alignItems: "center", justifyContent: "center" },
  navLabel: { fontSize: 10, color: colors.textMuted, marginTop: 5, fontWeight: "600" },
  navLabelActive: { color: colors.primary, fontWeight: "800" },
  textMuted: { color: colors.textMuted, fontSize: 16, fontWeight: "600" },
  celebrationContainer: { ...StyleSheet.absoluteFillObject, zIndex: 999, alignItems: 'center', justifyContent: 'center' },
  celebrationContent: {
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'rgba(15, 15, 15, 0.98)',
    padding: 40,
    borderRadius: 45,
    width: 350,
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15
  },
  iconCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(184, 134, 11, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary },
  celebrationTitle: { fontSize: 30, fontWeight: '900', color: colors.primary, textAlign: 'center', letterSpacing: -0.5 },
  celebrationSub: { fontSize: 15, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 24, fontWeight: '600', paddingHorizontal: 10 },
  goldLine: { width: 80, height: 3, backgroundColor: colors.primary, borderRadius: 2, marginTop: 5, opacity: 0.6 },
});
