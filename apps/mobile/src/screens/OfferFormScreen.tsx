import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { Ionicons } from '@expo/vector-icons';

type Props = {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
};

export function OfferFormScreen({ initialData, onSave, onCancel, loading }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercent: "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        discountPercent: initialData.discountPercent?.toString() || "",
        startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
        endDate: initialData.endDate ? new Date(initialData.endDate) : new Date(),
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.description.trim()) errors.description = "Description is required";
    const discount = Number(form.discountPercent);
    if (!form.discountPercent) errors.discountPercent = "Discount is required";
    else if (isNaN(discount) || discount < 1 || discount > 100) errors.discountPercent = "Enter 1-100%";

    if (form.endDate < form.startDate) {
        errors.date = "End date cannot be before start date";
    }
    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleDateChange = (event: any, selectedDate?: Date, isStart: boolean = true) => {
    if (Platform.OS === 'android') {
        setShowStartPicker(false);
        setShowEndPicker(false);
    }

    if (selectedDate) {
        if (isStart) {
            setForm({ ...form, startDate: selectedDate });
        } else {
            setForm({ ...form, endDate: selectedDate });
        }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 20) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{initialData ? "Edit Offer" : "Create New Offer"}</Text>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <InputField
            label="Offer Title *"
            placeholder="e.g. Summer Wedding Special"
            value={form.title}
            onChangeText={(v) => setForm({ ...form, title: v })}
            error={errors.title}
            touched={touched.title}
            onBlur={() => setTouched({ ...touched, title: true })}
          />

          <InputField
            label="Discount Percentage (%) *"
            placeholder="e.g. 20"
            keyboardType="numeric"
            value={form.discountPercent}
            onChangeText={(v) => setForm({ ...form, discountPercent: v })}
            error={errors.discountPercent}
            touched={touched.discountPercent}
            onBlur={() => setTouched({ ...touched, discountPercent: true })}
          />

          <InputField
            label="Description *"
            placeholder="What's included in this offer?"
            multiline
            style={{ height: 100, textAlignVertical: "top" }}
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
            error={errors.description}
            touched={touched.description}
            onBlur={() => setTouched({ ...touched, description: true })}
          />

          <View style={styles.dateSection}>
            <Text style={styles.sectionLabel}>Validity Period</Text>
            <View style={styles.row}>
                <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowStartPicker(true)}>
                    <Text style={styles.dateLabel}>Starts</Text>
                    <Text style={styles.dateValue}>{form.startDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <View style={{ width: 12 }} />
                <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowEndPicker(true)}>
                    <Text style={styles.dateLabel}>Ends</Text>
                    <Text style={styles.dateValue}>{form.endDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
            </View>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={form.startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => handleDateChange(e, d, true)}
              minimumDate={new Date()}
              textColor={colors.text}
              themeVariant="light"
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={form.endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => handleDateChange(e, d, false)}
              minimumDate={form.startDate}
              textColor={colors.text}
              themeVariant="light"
            />
          )}

          <View style={styles.switchRow}>
            <View>
                <Text style={styles.switchTitle}>Enable Offer</Text>
                <Text style={styles.switchSub}>Control if this offer is visible to customers</Text>
            </View>
            <Switch
                value={form.isActive}
                onValueChange={(v) => setForm({ ...form, isActive: v })}
                trackColor={{ false: "#E5E7EB", true: colors.primary }}
                thumbColor={colors.white}
            />
          </View>

          <View style={styles.spacer} />

          <Button
            title={initialData ? "Save Changes" : "Create Offer"}
            onPress={() => onSave({
                ...form,
                discountPercent: Number(form.discountPercent),
                startDate: form.startDate.toISOString(),
                endDate: form.endDate.toISOString()
            })}
            loading={loading}
            disabled={!isValid}
          />
          <Button title="Back" onPress={onCancel} variant="outline" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { padding: 24, paddingTop: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  title: { fontSize: 24, fontWeight: "900", color: colors.text, letterSpacing: -0.5 },
  cancel: { color: colors.error, fontWeight: "700", fontSize: 15 },
  form: { gap: 20 },
  dateSection: { gap: 8 },
  sectionLabel: { fontSize: 14, fontWeight: "700", color: colors.text, marginLeft: 4 },
  datePickerBtn: { flex: 1, backgroundColor: colors.surfaceDark, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  dateLabel: { fontSize: 11, fontWeight: "600", color: colors.textMuted, textTransform: 'uppercase' },
  dateValue: { fontSize: 15, fontWeight: "700", color: colors.text, marginTop: 4 },
  row: { flexDirection: "row" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.surfaceDark, padding: 16, borderRadius: 16 },
  switchTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  switchSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  errorText: { color: colors.error, fontSize: 12, fontWeight: "600", marginLeft: 8 },
  spacer: { height: 10 }
});
