import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";

type Props = {
  onComplete: (data: any) => void;
  onBack: () => void;
  loading: boolean;
};

export function RegisterProfileScreen({ onComplete, onBack, loading }: Props) {
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    mobileNumber: "",
    email: "",
    city: "",
    area: "",
    address: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.businessName) errors.businessName = "Business name is required";
    if (!form.ownerName) errors.ownerName = "Owner name is required";
    if (!form.mobileNumber) errors.mobileNumber = "Mobile is required";
    else if (form.mobileNumber.length < 10) errors.mobileNumber = "Enter 10 digit number";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!form.city) errors.city = "City is required";
    if (!form.area) errors.area = "Area is required";
    if (!form.address) errors.address = "Full address is required";

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
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Join Subhdin</Text>
          <Text style={styles.subtitle}>Create your vendor account in minutes</Text>
        </View>

        <View style={styles.form}>
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
            placeholder="hello@business.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(v) => setForm({...form, email: v})}
            onBlur={() => handleBlur("email")}
            error={errors.email}
            touched={touched.email}
          />

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

          <View style={styles.spacer} />

          <Button
            title="Create Account"
            onPress={() => onComplete(form)}
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
    paddingTop: 40,
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
});
