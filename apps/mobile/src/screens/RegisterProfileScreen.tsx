import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type Role = 'user' | 'vendor';

type Props = {
  onComplete: (data: any, role: Role) => void;
  onBack: () => void;
  loading: boolean;
};

export function RegisterProfileScreen({ onComplete, onBack, loading }: Props) {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<Role>('user');
  const [form, setForm] = useState({
    // Vendor Fields
    businessName: "",
    ownerName: "",
    // User Fields
    fullName: "",
    // Shared Fields
    mobileNumber: "",
    email: "",
    city: "",
    area: "",
    address: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const errors: Record<string, string> = {};

    if (role === 'vendor') {
      if (!form.businessName) errors.businessName = "Business name is required";
      if (!form.ownerName) errors.ownerName = "Owner name is required";
      if (!form.city) errors.city = "City is required";
      if (!form.area) errors.area = "Area is required";
      if (!form.address) errors.address = "Full address is required";
    } else {
      if (!form.fullName) errors.fullName = "Full name is required";
    }

    if (!form.mobileNumber) errors.mobileNumber = "Mobile is required";
    else if (form.mobileNumber.length < 10) errors.mobileNumber = "Enter 10 digit number";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email address";
    }

    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Join Subhdin</Text>
          <Text style={styles.subtitle}>
            {role === 'user' ? 'Find the best vendors for your special day' : 'Grow your business with India\'s finest wedding platform'}
          </Text>
        </View>

        {/* Modern Role Switcher */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, role === 'user' && styles.activeTab]}
            onPress={() => setRole('user')}
          >
            <Text style={[styles.tabText, role === 'user' && styles.activeTabText]}>I'm a Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, role === 'vendor' && styles.activeTab]}
            onPress={() => setRole('vendor')}
          >
            <Text style={[styles.tabText, role === 'vendor' && styles.activeTabText]}>I'm a Vendor</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {role === 'user' ? (
            <>
              <InputField
                label="Full Name"
                placeholder="Enter your name"
                value={form.fullName}
                onChangeText={(v) => setForm({...form, fullName: v})}
                onBlur={() => handleBlur("fullName")}
                error={errors.fullName}
                touched={touched.fullName}
              />
            </>
          ) : (
            <>
              <InputField
                label="Business Name"
                placeholder="e.g. Dream Weddings"
                value={form.businessName}
                onChangeText={(v) => setForm({...form, businessName: v})}
                onBlur={() => handleBlur("businessName")}
                error={errors.businessName}
                touched={touched.businessName}
              />

              <InputField
                label="Owner Name"
                placeholder="Your full name"
                value={form.ownerName}
                onChangeText={(v) => setForm({...form, ownerName: v})}
                onBlur={() => handleBlur("ownerName")}
                error={errors.ownerName}
                touched={touched.ownerName}
              />
            </>
          )}

          <InputField
            label="Mobile Number"
            placeholder="10-digit mobile"
            keyboardType="phone-pad"
            maxLength={10}
            value={form.mobileNumber}
            onChangeText={(v) => setForm({...form, mobileNumber: v})}
            onBlur={() => handleBlur("mobileNumber")}
            error={errors.mobileNumber}
            touched={touched.mobileNumber}
          />

          <InputField
            label="Email (Optional)"
            placeholder="hello@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm({...form, email: v})}
            onBlur={() => handleBlur("email")}
            error={errors.email}
            touched={touched.email}
          />

          {role === 'vendor' && (
            <>
              <View style={styles.row}>
                <View style={styles.flex}>
                  <InputField
                    label="City"
                    placeholder="Mumbai"
                    value={form.city}
                    onChangeText={(v) => setForm({...form, city: v})}
                    onBlur={() => handleBlur("city")}
                    error={errors.city}
                    touched={touched.city}
                  />
                </View>
                <View style={{ width: 16 }} />
                <View style={styles.flex}>
                  <InputField
                    label="Area"
                    placeholder="Andheri"
                    value={form.area}
                    onChangeText={(v) => setForm({...form, area: v})}
                    onBlur={() => handleBlur("area")}
                    error={errors.area}
                    touched={touched.area}
                  />
                </View>
              </View>

              <InputField
                label="Full Address"
                placeholder="Shop no, Street..."
                multiline
                style={{ height: 100, textAlignVertical: "top" }}
                value={form.address}
                onChangeText={(v) => setForm({...form, address: v})}
                onBlur={() => handleBlur("address")}
                error={errors.address}
                touched={touched.address}
              />
            </>
          )}

          <View style={styles.spacer} />

          <Button
            title={role === 'user' ? "Create User Account" : "Create Vendor Account"}
            onPress={() => onComplete(form, role)}
            loading={loading}
            disabled={!isValid}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 20,
  },
  backText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 8,
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
  },
  spacer: {
    height: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceDark,
    padding: 6,
    borderRadius: 16,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
});
