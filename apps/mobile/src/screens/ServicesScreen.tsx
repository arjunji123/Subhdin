import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Modal, FlatList } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { Ionicons } from '@expo/vector-icons';

type Props = {
  initialData?: any;
  onSave: (data: any, selectedImages: string[]) => void;
  onCancel: () => void;
  loading: boolean;
  isReadOnly?: boolean;
};

const CATEGORIES = [
  "Banquet Hall",
  "Marriage Garden / Farm",
  "Traditional Dhol",
  "DJ & Sound System",
  "Catering Services",
  "Mehndi Artist",
  "Photography & Studio",
  "Decoration & Themes",
  "Tent & Event Setup",
  "Invitation Cards",
  "Travel & Transportation",
  "Wedding Horse (Ghodi)",
  "Wedding Band",
  "Bridal Makeup & Grooming",
  "Choreographer",
  "Pandit / Priest",
  "Furniture Rental",
  "Lighting & Fireworks",
  "Water & Beverage Service",
  "Other",
];

export function ServicesScreen({ initialData, onSave, onCancel, loading, isReadOnly }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    serviceName: "",
    category: "",
    otherCategory: "",
    description: "",
    price: "",
    capacity: "",
    highlights: "",
    videoUrls: "",
  });

  const [showPicker, setShowPicker] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      const isPredefined = CATEGORIES.includes(initialData.category);
      setForm({
        serviceName: initialData.serviceName || "",
        category: isPredefined ? initialData.category : (initialData.category ? "Other" : ""),
        otherCategory: isPredefined ? "" : (initialData.category || ""),
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        capacity: initialData.capacity?.toString() || "",
        highlights: initialData.highlights?.join(", ") || "",
        videoUrls: initialData.videoUrls?.join(", ") || "",
      });
      setImages(initialData.galleryImages || []);
    }
  }, [initialData]);

  const pickImages = async () => {
    if (isReadOnly) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      setImages([...images, ...selectedUris]);
    }
  };

  const removeImage = (index: number) => {
    if (isReadOnly) return;
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.serviceName.trim()) errors.serviceName = "Service name is required";
    if (!form.category) errors.category = "Category is required";
    if (form.category === "Other" && !form.otherCategory.trim()) errors.otherCategory = "Please specify category";
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.price) errors.price = "Price is required";
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) errors.price = "Enter a valid amount";
    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleSave = () => {
    const finalCategory = form.category === "Other" ? form.otherCategory.trim() : form.category;
    const data: any = {
      serviceName: form.serviceName.trim(),
      category: finalCategory,
      description: form.description.trim(),
      price: Number(form.price),
    };

    if (form.capacity) data.capacity = Number(form.capacity);
    if (form.highlights) {
        data.highlights = form.highlights.split(",").map(h => h.trim()).filter(h => h);
    }
    if (form.videoUrls) {
        data.videoUrls = form.videoUrls.split(",").map(v => v.trim()).filter(v => v);
    }

    onSave(data, images);
  };

  const title = isReadOnly ? "Service Details" : (initialData ? "Update Service" : "Add New Service");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 20) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancel}>{isReadOnly ? "Close" : "Cancel"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <InputField
            label="Service Name *"
            placeholder="e.g. Premium Wedding Photography"
            value={form.serviceName}
            onChangeText={(v) => setForm({ ...form, serviceName: v })}
            onBlur={() => handleBlur("serviceName")}
            error={errors.serviceName}
            touched={touched.serviceName}
            editable={!isReadOnly}
          />

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, touched.category && !!errors.category && { color: colors.error }]}>Category *</Text>
            <TouchableOpacity
              style={[
                styles.pickerTrigger,
                showPicker && styles.pickerTriggerActive,
                touched.category && !!errors.category && styles.pickerTriggerError,
                isReadOnly && { opacity: 0.7 }
              ]}
              onPress={() => !isReadOnly && setShowPicker(true)}
              activeOpacity={0.7}
              disabled={isReadOnly}
            >
              <Text style={[styles.pickerValue, !form.category && { color: colors.textMuted }]}>
                {form.category || "Select a category"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
            </TouchableOpacity>
            {touched.category && !!errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          {form.category === "Other" && (
             <InputField
                label="Specify Category *"
                placeholder="e.g. Flower Decoration"
                value={form.otherCategory}
                onChangeText={(v) => setForm({ ...form, otherCategory: v })}
                onBlur={() => handleBlur("otherCategory")}
                error={errors.otherCategory}
                touched={touched.otherCategory}
                editable={!isReadOnly}
             />
          )}

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
                editable={!isReadOnly}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={styles.flex}>
              <InputField
                label="Capacity (Optional)"
                placeholder="e.g. 500"
                keyboardType="numeric"
                value={form.capacity}
                onChangeText={(v) => setForm({ ...form, capacity: v })}
                editable={!isReadOnly}
              />
            </View>
          </View>

          <InputField
            label="Description *"
            placeholder="Detailed description..."
            multiline
            style={{ height: 100, textAlignVertical: "top" }}
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
            onBlur={() => handleBlur("description")}
            error={errors.description}
            touched={touched.description}
            editable={!isReadOnly}
          />

          <InputField
            label="Highlights (comma separated)"
            placeholder="High-res photos, AC, WiFi..."
            value={form.highlights}
            onChangeText={(v) => setForm({ ...form, highlights: v })}
            editable={!isReadOnly}
          />

          <View style={styles.fieldGroup}>
            <InputField
              label="Work Videos (YouTube / Instagram)"
              placeholder="e.g. https://youtube.com/watch?v=..., https://instagram.com/p/..."
              value={form.videoUrls}
              onChangeText={(v) => setForm({ ...form, videoUrls: v })}
              editable={!isReadOnly}
            />
            {!isReadOnly && (
              <Text style={styles.hintText}>
                Add links to your videos from YouTube or Instagram. This allows customers to see your actual work and helps build trust. (Separate multiple links with commas)
              </Text>
            )}
          </View>

          <View style={styles.imageSection}>
            <View style={styles.imageHeader}>
                <Text style={styles.label}>Gallery Photos</Text>
                {!isReadOnly && (
                    <TouchableOpacity onPress={pickImages}>
                        <Text style={styles.addMore}>+ Add Photos</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                {images.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.previewImage} />
                        {!isReadOnly && (
                            <TouchableOpacity style={styles.removeBadge} onPress={() => removeImage(index)}>
                                <Ionicons name="close" size={14} color={colors.white} />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
                {!isReadOnly && images.length === 0 && (
                    <TouchableOpacity style={styles.emptyPicker} onPress={pickImages}>
                        <Ionicons name="images-outline" size={32} color={colors.primary} />
                        <Text style={styles.pickerText}>Select Work Photos</Text>
                    </TouchableOpacity>
                )}
                {isReadOnly && images.length === 0 && (
                     <View style={styles.emptyPicker}>
                        <Text style={styles.textMuted}>No photos uploaded</Text>
                     </View>
                )}
            </ScrollView>
          </View>

          {!isReadOnly && (
            <>
                <View style={styles.spacer} />
                <Button
                    title={initialData ? "Save Changes" : "Create Service"}
                    onPress={handleSave}
                    loading={loading}
                    disabled={!isValid}
                />
                <Button
                    title="Cancel"
                    onPress={onCancel}
                    variant="outline"
                />
            </>
          )}

          {isReadOnly && (
             <Button
                title="Back to Services"
                onPress={onCancel}
                variant="outline"
             />
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    form.category === item && styles.categoryItemActive
                  ]}
                  onPress={() => {
                    setForm({ ...form, category: item });
                    setTouched({ ...touched, category: true });
                    setShowPicker(false);
                  }}
                >
                  <Text style={[
                    styles.categoryText,
                    form.category === item && styles.categoryTextActive
                  ]}>{item}</Text>
                  {form.category === item && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.categoryList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  row: { flexDirection: "row" },
  flex: { flex: 1 },
  label: { fontSize: 14, fontWeight: "700", color: colors.text, marginLeft: 4 },
  imageSection: { gap: 12 },
  imageHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  addMore: { color: colors.primary, fontWeight: "700", fontSize: 14 },
  imageScroll: { flexDirection: "row", marginTop: 4, paddingVertical: 10 },
  imageWrapper: { position: 'relative', marginRight: 12 },
  previewImage: { width: 100, height: 100, borderRadius: 12, backgroundColor: colors.surfaceDark },
  removeBadge: { position: 'absolute', top: -6, right: -6, backgroundColor: colors.error, width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.white },
  emptyPicker: { width: 150, height: 120, borderRadius: 16, backgroundColor: colors.primaryLight, borderStyle: 'dashed', borderWidth: 1, borderColor: colors.primary, alignItems: "center", justifyContent: "center", gap: 8, padding: 20 },
  pickerText: { color: colors.primary, fontWeight: "700", fontSize: 14, textAlign: 'center' },
  textMuted: { color: colors.textMuted },
  spacer: { height: 10 },
  fieldGroup: { gap: 4 },
  hintText: { fontSize: 12, color: colors.textMuted, marginLeft: 8, lineHeight: 16 },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 18,
  },
  pickerTriggerActive: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  pickerTriggerError: {
    borderColor: colors.error,
    backgroundColor: "#FFF5F5",
  },
  pickerValue: {
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 8,
    marginTop: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '70%',
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  categoryItemActive: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
