import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  Platform,
  StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { authApi, vendorApi } from "./src/api";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterProfileScreen } from "./src/screens/RegisterProfileScreen";
import { OtpVerifyScreen } from "./src/screens/OtpVerifyScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { ServiceListScreen } from "./src/screens/ServiceListScreen";
import { ServicesScreen } from "./src/screens/ServicesScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { ReviewsScreen } from "./src/screens/ReviewsScreen";
import { colors } from "./src/theme/colors";

type Tab = "dashboard" | "services" | "offers" | "profile";
type ViewState = "login" | "signup" | "otp_verify" | "main" | "service_form" | "reviews";

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.success, backgroundColor: colors.white, borderRadius: 12 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '700', color: colors.text }}
      text2Style={{ fontSize: 13, color: colors.textMuted }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: colors.error, backgroundColor: colors.white, borderRadius: 12 }}
      text1Style={{ fontSize: 16, fontWeight: '700', color: colors.text }}
      text2Style={{ fontSize: 13, color: colors.textMuted }}
    />
  )
};

export default function App() {
  const [view, setView] = useState<ViewState>("login");
  const [tab, setTab] = useState<Tab>("dashboard");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [signupData, setSignupData] = useState<any>(null);

  const [dashboard, setDashboard] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const isLoggedIn = useMemo(() => token.length > 0, [token]);

  useEffect(() => {
    if (isLoggedIn) {
      loadInitialData();
    }
  }, [isLoggedIn, token]);

  async function loadInitialData() {
    setLoading(true);
    try {
      const prof = await vendorApi.getProfile(token);
      setProfile(prof);

      if (signupData) {
        await vendorApi.updateProfile(token, signupData);
        const updatedProf = await vendorApi.getProfile(token);
        setProfile(updatedProf);
        setSignupData(null);
      }

      if (!prof.businessName && !signupData) {
        setView("signup");
      } else {
        setView("main");
        await Promise.all([loadDashboard(), loadServices()]);
      }
    } catch (err) {
      setToken("");
      setView("login");
    } finally {
      setLoading(false);
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

  // --- Auth Actions ---
  async function requestOtp(targetPhone: string, type: "login" | "signup" = "login") {
    if (!targetPhone || targetPhone.length < 10) {
      return Toast.show({ type: 'error', text1: 'Invalid Number', text2: 'Enter a valid 10-digit number' });
    }
    setLoading(true);
    try {
      const data = type === "login"
        ? await authApi.loginRequestOtp(targetPhone)
        : await authApi.requestOtp(targetPhone);

      setPhone(targetPhone);
      setView("otp_verify");
      Toast.show({ type: 'success', text1: 'OTP Sent', text2: `Use code ${data.debugCode} for testing` });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Failed', text2: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!otp || otp.length < 6) {
      return Toast.show({ type: 'error', text1: 'Invalid OTP', text2: 'Please enter the 6-digit code' });
    }
    setLoading(true);
    try {
      const data = await authApi.verifyOtp(phone, otp);
      setToken(data.token);
      Toast.show({ type: 'success', text1: 'Verified', text2: 'Login successful!' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Verification Failed', text2: err.message });
    } finally {
      setLoading(false);
    }
  }

  // --- Service Actions ---
  async function handleSaveService(data: any) {
    setLoading(true);
    try {
      if (editingService) {
        await vendorApi.updateService(token, editingService.id, data);
        Toast.show({ type: 'success', text1: 'Updated', text2: 'Service updated successfully' });
      } else {
        await vendorApi.createService(token, data);
        Toast.show({ type: 'success', text1: 'Created', text2: 'New service added successfully' });
      }
      await loadServices();
      setView("main");
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save service' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteService(id: string) {
    try {
      await vendorApi.deleteService(token, id);
      Toast.show({ type: 'success', text1: 'Deleted', text2: 'Service removed' });
      await loadServices();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete service' });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {view === "main" && (
        <View style={styles.header}>
          <Image source={require("./assets/logo.png")} style={styles.headerLogo} resizeMode="contain" />
          <View>
            <Text style={styles.subheading}>Events Made Easy</Text>
          </View>
        </View>
      )}

      <View style={styles.flex}>
        {view === "login" && (
          <View style={styles.centerContent}>
            <LoginScreen
              phone={phone} setPhone={setPhone}
              onSendOtp={() => requestOtp(phone, "login")}
              onGoToSignup={() => setView("signup")}
              loading={loading}
            />
          </View>
        )}

        {view === "signup" && (
          <RegisterProfileScreen
            onComplete={(data) => {
              setSignupData(data);
              requestOtp(data.mobileNumber, "signup");
            }}
            onBack={() => setView("login")}
            loading={loading}
          />
        )}

        {view === "otp_verify" && (
          <OtpVerifyScreen
            phone={phone}
            otp={otp}
            setOtp={setOtp}
            onVerify={verifyOtp}
            onResend={() => requestOtp(phone)}
            onBack={() => setView("login")}
            loading={loading}
          />
        )}

        {view === "reviews" && (
          <ReviewsScreen reviews={[]} onBack={() => setView("main")} />
        )}

        {view === "service_form" && (
          <ServicesScreen
            initialData={editingService}
            onSave={handleSaveService}
            onCancel={() => setView("main")}
            loading={loading}
          />
        )}

        {view === "main" && (
          <View style={styles.flex}>
            <View style={styles.tabRow}>
              {(["dashboard", "services", "offers", "profile"] as Tab[]).map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setTab(item)}
                  style={[styles.tabButton, tab === item && styles.tabButtonActive]}
                >
                  <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.mainContent}>
              {tab === "dashboard" && (
                <DashboardScreen
                  data={dashboard} loading={loading}
                  onRefresh={loadDashboard} onViewReviews={() => setView("reviews")}
                />
              )}

              {tab === "services" && (
                <ServiceListScreen
                  services={services}
                  onAdd={() => { setEditingService(null); setView("service_form"); }}
                  onEdit={(s) => { setEditingService(s); setView("service_form"); }}
                  onDelete={handleDeleteService}
                  loading={loading}
                />
              )}

              {tab === "profile" && (
                <ProfileScreen
                  profile={profile}
                  onUpdate={() => setView("signup")}
                  onLogout={() => { setToken(""); setView("login"); setPhone(""); setOtp(""); }}
                  onDeleteAccount={() => { setToken(""); setView("login"); }}
                  loading={loading}
                />
              )}

              {tab === "offers" && (
                <View style={styles.empty}><Text style={styles.muted}>Offers Management Coming Soon</Text></View>
              )}
            </View>
          </View>
        )}
      </View>
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0
  },
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerContent: { flex: 1, padding: 24, justifyContent: "center" },
  mainContent: { flex: 1, padding: 24, paddingTop: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  headerLogo: { width: 50, height: 50 },
  subheading: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 8,
    marginVertical: 12,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: { color: colors.text, fontWeight: "700", fontSize: 13, textTransform: "capitalize" },
  tabTextActive: { color: colors.white },
  empty: { flex: 1, padding: 40, alignItems: "center", justifyContent: "center" },
  muted: { color: colors.textMuted },
});
