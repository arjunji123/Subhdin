import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";

type Props = {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
};

export function ServicesScreen({ initialData, onSave, onCancel, loading }: Props) {
  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    capacity: "",
    highlights: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        serviceName: initialData.serviceName || "",
        category: initialData.category || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        capacity: initialData.capacity?.toString() || "",
        highlights: initialData.highlights?.join(", ") || "",
      });
    }
  }, [initialData]);

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.serviceName) errors.serviceName = "Service name is required";
    if (!form.category) errors.category = "Category is required";
    if (!form.price) errors.price = "Price is required";
    else if (isNaN(Number(form.price))) errors.price = "Enter a valid amount";
    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleSave = () => {
    onSave({
      ...form,
      price: Number(form.price),
      capacity: Number(form.capacity),
      highlights: form.highlights.split(",").map(h => h.trim()).filter(h => h),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{initialData ? "Edit Service" : "Add New Service"}</Text>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <InputField
          label="Service Name *"
          placeholder="e.g. Luxury Banquet"
          value={form.serviceName}
          onChangeText={(v) => setForm({ ...form, serviceName: v })}
          onBlur={() => handleBlur("serviceName")}
          error={errors.serviceName}
          touched={touched.serviceName}
        />

        <InputField
          label="Category *"
          placeholder="e.g. Venue"
          value={form.category}
          onChangeText={(v) => setForm({ ...form, category: v })}
          onBlur={() => handleBlur("category")}
          error={errors.category}
          touched={touched.category}
        />

        <View style={styles.row}>
          <View style={styles.flex}>
            <InputField
              label="Price (₹) *"
              placeholder="0"
              keyboardType="numeric"
              value={form.price}
              onChangeText={(v) => setForm({ ...form, price: v })}
              onBlur={() => handleBlur("price")}
              error={errors.price}
              touched={touched.price}
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={styles.flex}>
            <InputField
              label="Capacity"
              placeholder="e.g. 500"
              keyboardType="numeric"
              value={form.capacity}
              onChangeText={(v) => setForm({ ...form, capacity: v })}
            />
          </View>
        </View>

        <InputField
          label="Description"
          placeholder="Describe your service..."
          multiline
          style={{ height: 100, textAlignVertical: "top" }}
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
        />

        <InputField
          label="Highlights (comma separated)"
          placeholder="AC, Parking, WiFi..."
          value={form.highlights}
          onChangeText={(v) => setForm({ ...form, highlights: v })}
        />

        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>Photo/Video Upload Integrated</Text>
        </View>

        <Button
          title={initialData ? "Update Service" : "Create Service"}
          onPress={handleSave}
          loading={loading}
          disabled={!isValid}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  cancel: {
    color: colors.error,
    fontWeight: "600",
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
  },
  flex: {
    flex: 1,
  },
  imagePlaceholder: {
    height: 100,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageText: {
    color: colors.primary,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
});
