import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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
    businessName: "",
    ownerName: "",
    fullName: "",
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
    } else {
      if (!form.fullName) errors.fullName = "Full name is required";
    }
    if (!form.mobileNumber || form.mobileNumber.length < 10) errors.mobileNumber = "Valid mobile required";
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
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
            <Text style={styles.backText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Join Subhdin</Text>
          <Text style={styles.subtitle}>
            {role === 'user' ? 'Find the best experts for your special day' : 'Grow your business with the elite community'}
          </Text>
        </View>

        <View style={styles.rolePicker}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'user' && styles.activeRoleTab]}
            onPress={() => setRole('user')}
          >
            <Ionicons name="person" size={18} color={role === 'user' ? colors.white : colors.textMuted} />
            <Text style={[styles.roleText, role === 'user' && styles.activeRoleText]}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleTab, role === 'vendor' && styles.activeRoleTab]}
            onPress={() => setRole('vendor')}
          >
            <Ionicons name="business" size={18} color={role === 'vendor' ? colors.white : colors.textMuted} />
            <Text style={[styles.roleText, role === 'vendor' && styles.activeRoleText]}>Partner</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {role === 'user' ? (
            <InputField
              label="Full Name"
              placeholder="Enter your name"
              value={form.fullName}
              onChangeText={(v) => setForm({...form, fullName: v})}
              onBlur={() => handleBlur("fullName")}
              error={errors.fullName}
              touched={touched.fullName}
            />
          ) : (
            <>
              <InputField
                label="Business Name"
                placeholder="e.g. Royal Events"
                value={form.businessName}
                onChangeText={(v) => setForm({...form, businessName: v})}
                onBlur={() => handleBlur("businessName")}
                error={errors.businessName}
                touched={touched.businessName}
              />
              <InputField
                label="Owner Name"
                placeholder="Manager/Owner name"
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

          {role === 'vendor' && (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <InputField
                    label="City"
                    placeholder="City"
                    value={form.city}
                    onChangeText={(v) => setForm({...form, city: v})}
                  />
                </View>
                <View style={{ width: 16 }} />
                <View style={{ flex: 1 }}>
                  <InputField
                    label="Area"
                    placeholder="Area"
                    value={form.area}
                    onChangeText={(v) => setForm({...form, area: v})}
                  />
                </View>
              </View>
          )}

          <View style={{ height: 20 }} />

          <Button
            title="Create Account"
            onPress={() => onComplete(form, role)}
            loading={loading}
            disabled={!isValid}
          />
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 30 },
  backText: { color: colors.primary, fontWeight: "800", fontSize: 16 },
  header: { marginBottom: 35 },
  title: { fontSize: 36, fontWeight: "900", color: colors.text, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: colors.textMuted, marginTop: 8, fontWeight: "600", lineHeight: 22 },
  rolePicker: { flexDirection: 'row', backgroundColor: colors.surface, padding: 6, borderRadius: 20, marginBottom: 35, borderWidth: 1, borderColor: colors.border },
  roleTab: { flex: 1, flexDirection: 'row', paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 16, gap: 8 },
  activeRoleTab: { backgroundColor: colors.primary, elevation: 5, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  roleText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  activeRoleText: { color: colors.white },
  form: { gap: 20 },
  row: { flexDirection: "row" }
});
