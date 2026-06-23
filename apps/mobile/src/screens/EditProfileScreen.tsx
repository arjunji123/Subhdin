import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";

type Props = {
  profile: any;
  onSave: (data: any) => void;
  onBack: () => void;
  loading: boolean;
};

export function EditProfileScreen({ profile, onSave, onBack, loading }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    businessName: profile?.businessName || "",
    ownerName: profile?.ownerName || "",
    email: profile?.email || "",
    city: profile?.city || "",
    area: profile?.area || "",
    address: profile?.address || "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.businessName.trim()) errors.businessName = "Business name required";
    if (!form.ownerName.trim()) errors.ownerName = "Owner name required";
    if (!form.city.trim()) errors.city = "City required";
    if (!form.area.trim()) errors.area = "Area required";
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
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 20) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Update Profile</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.formContainer}>
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
            placeholder="Name of owner"
            value={form.ownerName}
            onChangeText={(v) => setForm({...form, ownerName: v})}
            onBlur={() => handleBlur("ownerName")}
            error={errors.ownerName}
            touched={touched.ownerName}
          />

          <InputField
            label="Email"
            placeholder="contact@business.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm({...form, email: v})}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
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
            <View style={{ flex: 1 }}>
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
            placeholder="Exact address..."
            multiline
            style={{ height: 100, textAlignVertical: 'top' }}
            value={form.address}
            onChangeText={(v) => setForm({...form, address: v})}
          />

          <View style={styles.bottomSpacer} />

          <Button
            title="Save Profile"
            onPress={() => onSave(form)}
            loading={loading}
            disabled={!isValid}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { padding: 24, paddingTop: 10 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  cancelText: { color: colors.error, fontWeight: "700", fontSize: 16 },
  pageTitle: { fontSize: 22, fontWeight: "900", color: colors.text, letterSpacing: -0.5 },
  formContainer: { gap: 20 },
  row: { flexDirection: "row" },
  bottomSpacer: { height: 20 }
});
