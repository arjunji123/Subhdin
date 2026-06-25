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
  Dimensions,
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
import { OfferDiscoveryScreen } from "./src/screens/OfferDiscoveryScreen";
import { VendorDetailScreen } from "./src/screens/VendorDetailScreen";
import { VendorCompareScreen } from "./src/screens/VendorCompareScreen";
import { AddReviewScreen } from "./src/screens/AddReviewScreen";
import { colors } from "./src/theme/colors";

const { width } = Dimensions.get("window");

type Tab = "dashboard" | "services" | "offers" | "profile" | "user_home" | "user_vendors";
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
      const savedRole = await AsyncStorage.getItem(ROLE_KEY);
      const currentRole = savedRole || userRole || 'user';

      if (currentRole === 'vendor') {
        const prof = await vendorApi.getProfile(token);
        setProfile(prof);
        const [dash, srvs, offs] = await Promise.all([
            vendorApi.getDashboard(token),
            vendorApi.getServices(token),
            vendorApi.getOffers(token)
        ]);
        setDashboard(dash);
        setServices(srvs);
        setOffers(offs);
      } else {
        let userProf = null;
        try {
            userProf = await vendorApi.getUserProfile(token);
            setProfile(userProf);
            await AsyncStorage.setItem("@subhdin_user_data", JSON.stringify(userProf));
        } catch (e) {
            const savedProfile = await AsyncStorage.getItem("@subhdin_user_data");
            if (savedProfile) {
                userProf = JSON.parse(savedProfile);
                setProfile(userProf);
            }
        }
        await loadHomeData(userProf?.city);
      }

      setUserRole(currentRole as any);
      setView("main");
      setTab(currentRole === "vendor" ? "dashboard" : "user_home");
    } catch (err: any) {
      if (err.message?.includes("401") || err.status === 401) {
        await handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadHomeData(city?: string) {
    try {
      const [featured, popular, nearby] = await Promise.all([
          vendorApi.getVendors(token, { limit: 8 }),
          vendorApi.getVendors(token, { limit: 8, sortBy: 'rating' }),
          city ? vendorApi.getVendors(token, { limit: 8, location: city }) : Promise.resolve([])
      ]);

      setHomeData({
          featuredVendors: featured,
          popularVendors: popular,
          nearbyVendors: nearby,
          banners: []
      });
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
      await authApi.requestOtp(targetPhone);
      setPhone(targetPhone);
      setView("otp_verify");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err: any) {
      Alert.alert("Oops!", "Something went wrong.");
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
      const role = authType === "signup" ? signupData.role : undefined;
      const data = await authApi.verifyOtp(phone, otp, role, authType === "signup" ? signupData : {});

      const verifiedRole = data.user.role;
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(ROLE_KEY, verifiedRole);
      await AsyncStorage.setItem("@subhdin_user_data", JSON.stringify(data.user));

      setUserRole(verifiedRole);
      setProfile(data.user);
      setToken(data.token);
      setSignupData(null);
      setView("main");
      setTab(verifiedRole === "vendor" ? "dashboard" : "user_home");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      setAuthError("Incorrect code. Try again.");
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
      if (userRole === 'vendor') {
        await vendorApi.updateProfile(token, data);
      } else {
        await vendorApi.updateUserProfile(token, data);
      }
      await loadInitialData();
      setView("main");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Profile updated!");
    } catch (err) {
      Alert.alert("Error", "Update failed.");
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
      await loadInitialData();
      setView("main");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      Alert.alert("Error", "Save failed.");
    } finally {
      setLoading(false);
    }
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
      setTimeout(() => setView("user_vendor_detail"), 3500);
    } catch (error) {
      Alert.alert("Error", "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCompare = (vendor: any) => {
    if (compareList.find(v => v.id === vendor.id)) {
        setView("user_compare");
        return;
    }
    const newList = [...compareList, vendor];
    setCompareList(newList);
    if (newList.length >= 2) {
        setView("user_compare");
    } else {
        Alert.alert("Added to Compare", "Select one more expert to see side-by-side comparison.");
    }
  };

  const handleRemoveFromCompare = (vendorId: string) => {
    setCompareList(prev => prev.filter(v => v.id !== vendorId));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.flex}>
        {view === "login" && <LoginScreen phone={phone} setPhone={setPhone} onSendOtp={() => requestOtp(phone, "login")} onGoToSignup={() => setView("signup")} loading={loading} />}
        {view === "signup" && <RegisterProfileScreen onComplete={(data, role) => { setSignupData({...data, role}); requestOtp(data.mobileNumber, "signup"); }} onBack={() => setView("login")} loading={loading} />}
        {view === "otp_verify" && <OtpVerifyScreen phone={phone} otp={otp} setOtp={(v) => { setOtp(v); setAuthError(null); }} onVerify={verifyOtp} onResend={() => requestOtp(phone, authType)} onBack={() => setView("login")} loading={loading} error={authError} />}
        {view === "edit_profile" && <EditProfileScreen profile={profile} onSave={handleUpdateProfile} onBack={() => setView("main")} loading={loading} />}
        {view === "service_form" && <ServicesScreen initialData={editingService} onSave={handleSaveService} onCancel={() => setView("main")} loading={loading} isReadOnly={isReadOnly} />}
        {view === "offer_form" && <OfferFormScreen initialData={editingOffer} onSave={(d) => {}} onCancel={() => setView("main")} loading={loading} />}
        {view === "user_discovery" && <VendorDiscoveryScreen token={token} category={selectedCategory} initialQuery={searchQuery} onBack={() => setView("main")} onVendorPress={(v) => { setSelectedVendor(v); setView("user_vendor_detail"); }} />}
        {view === "user_vendor_detail" && <VendorDetailScreen token={token} vendorId={selectedVendor?.id} onBack={() => setView(selectedCategory || searchQuery ? "user_discovery" : "main")} onCompare={() => handleAddToCompare(selectedVendor)} compareCount={compareList.length} onAddReview={() => setView("user_add_review")} onTrackAction={(type) => handleTrackEvent(selectedVendor.id, type)} />}
        {view === "user_compare" && <VendorCompareScreen vendors={compareList} onBack={() => setView("user_vendor_detail")} onRemove={handleRemoveFromCompare} />}
        {view === "user_add_review" && <AddReviewScreen vendorName={selectedVendor?.businessName} userName={profile?.fullName || profile?.name || "Customer"} onBack={() => setView("user_vendor_detail")} onSubmit={(r, c) => handleReviewSubmit(r, c, profile?.fullName || profile?.name || "Customer")} loading={loading} />}

        {view === "celebration" && (
            <View style={styles.celebrationContainer}>
                <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
                <Animated.View style={styles.celebrationContent}>
                    <View style={styles.celebrationIconBox}>
                        <Ionicons name="sparkles" size={60} color={colors.primary} />
                    </View>
                    <Text style={styles.celebrationTitle}>Magical Review!</Text>
                    <Text style={styles.celebrationSub}>Your story has been added. Thank you for helping our community grow.</Text>
                    <View style={styles.celebrationBar} />
                </Animated.View>
            </View>
        )}

        {view === "main" && (
          <View style={styles.flex}>
            <View style={styles.mainContent}>
                {userRole === "vendor" ? (
                    <>
                        {tab === "dashboard" && <DashboardScreen data={dashboard} loading={loading} onRefresh={loadInitialData} onViewReviews={() => setView("reviews")} />}
                        {tab === "services" && <ServiceListScreen services={services} onAdd={() => { setEditingService(null); setIsReadOnly(false); setView("service_form"); }} onEdit={(s) => { setEditingService(s); setIsReadOnly(false); setView("service_form"); }} onView={(s) => { setEditingService(s); setIsReadOnly(true); setView("service_form"); }} onDelete={() => {}} loading={loading} />}
                        {tab === "profile" && <ProfileScreen profile={profile} userRole={userRole} onUpdate={() => setView("edit_profile")} onLogout={handleLogout} onHelp={() => {}} onDeleteAccount={handleLogout} loading={loading} />}
                    </>
                ) : (
                    <>
                        {tab === "user_home" && <UserHomeScreen userName={profile?.fullName || profile?.name} homeData={homeData} loading={loading} onCategoryPress={(cat) => { setSelectedCategory(cat); setSearchQuery(""); setView("user_discovery"); }} onVendorPress={(v) => { setSelectedVendor(v); setView("user_vendor_detail"); }} onSearchPress={(q) => { setSelectedCategory(""); setSearchQuery(q || ""); setView("user_discovery"); }} />}
                        {tab === "user_vendors" && <VendorDiscoveryScreen token={token} hideSearch={true} onBack={() => setTab("user_home")} onVendorPress={(v) => { setSelectedVendor(v); setView("user_vendor_detail"); }} />}
                        {tab === "offers" && <OfferDiscoveryScreen token={token} onVendorPress={(v) => { setSelectedVendor(v); setView("user_vendor_detail"); }} />}
                        {tab === "profile" && <ProfileScreen profile={profile} userRole={userRole} onUpdate={() => setView("edit_profile")} onLogout={handleLogout} onHelp={() => {}} onDeleteAccount={handleLogout} loading={loading} />}
                    </>
                )}
            </View>

            <View style={styles.navContainer}>
              <View style={styles.bottomNav}>
                {userRole === "vendor" ? (
                  <>
                    <NavButton active={tab === "dashboard"} icon="stats-chart" label="Stats" onPress={() => setTab("dashboard")} />
                    <NavButton active={tab === "services"} icon="briefcase" label="Services" onPress={() => setTab("services")} />
                    <NavButton active={tab === "profile"} icon="person" label="Profile" onPress={() => setTab("profile")} />
                  </>
                ) : (
                  <>
                    <NavButton active={tab === "user_home"} icon="home" label="Explore" onPress={() => setTab("user_home")} />
                    <NavButton active={tab === "user_vendors"} icon="people" label="Experts" onPress={() => setTab("user_vendors")} />
                    <NavButton active={tab === "offers"} icon="flame" label="Deals" onPress={() => setTab("offers")} />
                    <NavButton active={tab === "profile"} icon="person" label="Account" onPress={() => setTab("profile")} />
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
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  mainContent: { flex: 1 },
  navContainer: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    borderRadius: 35,
    backgroundColor: colors.surface,
    elevation: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border
  },
  bottomNav: { flexDirection: "row", height: 75, alignItems: 'center' },
  navBtn: { flex: 1, alignItems: "center", justifyContent: "center" },
  navLabel: { fontSize: 10, color: colors.textMuted, marginTop: 5, fontWeight: "600" },
  navLabelActive: { color: colors.primary, fontWeight: "800" },
  celebrationContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  celebrationContent: {
    alignItems: 'center',
    gap: 20,
    backgroundColor: colors.surface,
    padding: 40,
    borderRadius: 45,
    width: 350,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 20
  },
  celebrationIconBox: { width: 110, height: 110, borderRadius: 55, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.primary },
  celebrationTitle: { fontSize: 28, fontWeight: '900', color: colors.text, textAlign: 'center' },
  celebrationSub: { fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 24, fontWeight: '600' },
  celebrationBar: { width: 80, height: 4, backgroundColor: colors.primary, borderRadius: 2, marginTop: 10 },
});
