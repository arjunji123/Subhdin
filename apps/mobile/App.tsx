import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { apiRequest } from "./src/api/client";
import { StatCard } from "./src/components/StatCard";
import { colors } from "./src/theme/colors";

type Tab = "dashboard" | "services" | "offers" | "profile";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [dashboard, setDashboard] = useState<any>(null);

  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("Banquet Hall");
  const [servicePrice, setServicePrice] = useState("");

  const [offerTitle, setOfferTitle] = useState("");
  const [offerDiscount, setOfferDiscount] = useState("");

  const isLoggedIn = useMemo(() => token.length > 0, [token]);

  async function requestOtp() {
    const data = await apiRequest<{ debugCode: string }>("/auth/request-otp", {
      method: "POST",
      body: { phone },
    });

    Alert.alert("OTP Sent", `Demo OTP: ${data.debugCode}`);
  }

  async function verifyOtp() {
    const data = await apiRequest<{ token: string }>("/auth/verify-otp", {
      method: "POST",
      body: { phone, code: otp },
    });

    setToken(data.token);
    Alert.alert("Success", "Vendor login successful");
  }

  async function loadDashboard() {
    const data = await apiRequest("/vendor/dashboard", {
      token,
    });

    setDashboard(data);
  }

  async function saveService() {
    await apiRequest("/vendor/services", {
      method: "POST",
      token,
      body: {
        category: serviceCategory,
        serviceName,
        description: `${serviceName} premium package`,
        price: Number(servicePrice),
        capacity: 300,
        galleryImages: [],
        videoUrls: [],
        highlights: ["Wedding", "Reception"],
      },
    });

    Alert.alert("Saved", "Service created");
  }

  async function saveOffer() {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);

    await apiRequest("/vendor/offers", {
      method: "POST",
      token,
      body: {
        title: offerTitle,
        description: `${offerTitle} limited period discount`,
        discountPercent: Number(offerDiscount),
        startDate: today.toISOString(),
        endDate: nextMonth.toISOString(),
      },
    });

    Alert.alert("Saved", "Offer created");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>ShaadiHub Vendor Console</Text>
        <Text style={styles.subheading}>Milestone 1 vendor module (responsive)</Text>

        {!isLoggedIn && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login with OTP</Text>
            <TextInput
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              placeholder="Enter OTP"
              keyboardType="number-pad"
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
            />
            <View style={styles.row}>
              <Pressable style={styles.buttonSecondary} onPress={requestOtp}>
                <Text style={styles.buttonSecondaryText}>Request OTP</Text>
              </Pressable>
              <Pressable style={styles.buttonPrimary} onPress={verifyOtp}>
                <Text style={styles.buttonPrimaryText}>Verify</Text>
              </Pressable>
            </View>
          </View>
        )}

        {isLoggedIn && (
          <>
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

            {tab === "dashboard" && (
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.cardTitle}>Analytics</Text>
                  <Pressable style={styles.smallBtn} onPress={loadDashboard}>
                    <Text style={styles.smallBtnText}>Refresh</Text>
                  </Pressable>
                </View>
                <View style={styles.grid}>
                  <StatCard label="Views" value={dashboard?.totalViews ?? 0} />
                  <StatCard label="Leads" value={dashboard?.totalLeads ?? 0} />
                  <StatCard label="Contact Reveal" value={dashboard?.totalContactReveals ?? 0} />
                  <StatCard label="WhatsApp Clicks" value={dashboard?.totalWhatsappClicks ?? 0} />
                </View>
              </View>
            )}

            {tab === "services" && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Add Service</Text>
                <TextInput
                  placeholder="Service Name"
                  style={styles.input}
                  value={serviceName}
                  onChangeText={setServiceName}
                />
                <TextInput
                  placeholder="Category"
                  style={styles.input}
                  value={serviceCategory}
                  onChangeText={setServiceCategory}
                />
                <TextInput
                  placeholder="Starting Price"
                  keyboardType="numeric"
                  style={styles.input}
                  value={servicePrice}
                  onChangeText={setServicePrice}
                />
                <Pressable style={styles.buttonPrimaryFull} onPress={saveService}>
                  <Text style={styles.buttonPrimaryText}>Save Service</Text>
                </Pressable>
              </View>
            )}

            {tab === "offers" && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Create Offer</Text>
                <TextInput
                  placeholder="Offer Title"
                  style={styles.input}
                  value={offerTitle}
                  onChangeText={setOfferTitle}
                />
                <TextInput
                  placeholder="Discount %"
                  keyboardType="numeric"
                  style={styles.input}
                  value={offerDiscount}
                  onChangeText={setOfferDiscount}
                />
                <Pressable style={styles.buttonPrimaryFull} onPress={saveOffer}>
                  <Text style={styles.buttonPrimaryText}>Save Offer</Text>
                </Pressable>
              </View>
            )}

            {tab === "profile" && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Profile Setup</Text>
                <Text style={styles.profileText}>Business profile APIs are ready in backend:</Text>
                <Text style={styles.profileText}>PUT /api/vendor/me</Text>
                <Text style={styles.profileText}>Fields: business name, owner, city, area, images, map link.</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
    gap: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subheading: {
    color: colors.muted,
    marginBottom: 6,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
    textTransform: "capitalize",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    flex: 1,
    alignItems: "center",
  },
  buttonPrimaryFull: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F3E8FF",
  },
  buttonPrimaryText: {
    color: "#FFF",
    fontWeight: "700",
  },
  buttonSecondaryText: {
    color: colors.primary,
    fontWeight: "700",
  },
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tabButton: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.card,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.text,
    textTransform: "capitalize",
  },
  tabTextActive: {
    color: "#FFF",
  },
  smallBtn: {
    backgroundColor: "#EDE9FE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  smallBtnText: {
    color: colors.primary,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  profileText: {
    color: colors.muted,
    marginBottom: 6,
  },
});

