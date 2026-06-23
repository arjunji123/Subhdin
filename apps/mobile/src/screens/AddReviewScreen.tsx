import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/Button";

type Props = {
  vendorName: string;
  onBack: () => void;
  onSubmit: (rating: number, comment: string, userName: string) => void;
  loading: boolean;
};

export function AddReviewScreen({ vendorName, onBack, onSubmit, loading }: Props) {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");

  const isInvalid = rating === 0 || !comment.trim() || !userName.trim();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="close" size={26} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Write a Review</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.vendorName}>How was your experience with {vendorName}?</Text>

          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Ionicons
                  name={s <= rating ? "star" : "star-outline"}
                  size={40}
                  color={s <= rating ? colors.primary : colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Name (Required)</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter your name"
              value={userName}
              onChangeText={setUserName}
            />

            <Text style={styles.label}>Your Review</Text>
            <TextInput
              style={styles.input}
              placeholder="Share details of your experience to help others..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />
          </View>

          <View style={styles.footer}>
            <Button
              title="Submit Review"
              onPress={() => onSubmit(rating, comment, userName)}
              disabled={isInvalid}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, height: 60 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "900", color: colors.text },
  content: { flex: 1, padding: 24, alignItems: "center" },
  vendorName: { fontSize: 20, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: 30 },
  starContainer: { flexDirection: "row", gap: 10, marginBottom: 40 },
  inputContainer: { width: "100%", flex: 1 },
  label: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 20,
    padding: 20,
    fontSize: 16,
    color: colors.text,
    minHeight: 150,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nameInput: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  footer: { width: "100%", paddingVertical: 20 },
});
