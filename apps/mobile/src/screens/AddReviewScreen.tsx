import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Button } from "../components/Button";

type Props = {
  vendorName: string;
  userName: string;
  onBack: () => void;
  onSubmit: (rating: number, comment: string) => void;
  loading: boolean;
};

export function AddReviewScreen({ vendorName, userName, onBack, onSubmit, loading }: Props) {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const isInvalid = rating === 0 || !comment.trim();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Your Experience</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.vendorBox}>
              <Text style={styles.vendorLabel}>VIBE CHECK FOR</Text>
              <Text style={styles.vendorName}>{vendorName}</Text>
          </View>

          <View style={styles.starWrapper}>
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => {
                    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch(e) {}
                    setRating(s);
                }}>
                    <Ionicons
                    name={s <= rating ? "star" : "star-outline"}
                    size={46}
                    color={s <= rating ? colors.primary : colors.border}
                    />
                </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.ratingHint}>
                {rating === 1 ? "Disappointing" :
                 rating === 2 ? "Below Average" :
                 rating === 3 ? "Just Okay" :
                 rating === 4 ? "Great Experience!" :
                 rating === 5 ? "Absolutely Flawless!" : "Tap to rate"}
            </Text>
          </View>

          <View style={styles.inputStack}>
              <Text style={styles.inputLabel}>REVIEWEING AS <Text style={{ color: colors.primary }}>{userName}</Text></Text>
              <TextInput
                style={styles.commentInput}
                placeholder="How was the service? Mention highlights..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
              />
          </View>

          <View style={styles.footer}>
            <Button
              title="Post My Review"
              onPress={() => onSubmit(rating, comment)}
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
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, height: 70 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  title: { fontSize: 18, fontWeight: "900", color: colors.text },
  body: { flex: 1, padding: 24 },
  vendorBox: { marginBottom: 40, alignItems: 'center' },
  vendorLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '800', letterSpacing: 2 },
  vendorName: { fontSize: 24, fontWeight: "900", color: colors.text, marginTop: 5, textAlign: "center" },
  starWrapper: { alignItems: 'center', marginBottom: 50 },
  starContainer: { flexDirection: "row", gap: 12 },
  ratingHint: { fontSize: 15, fontWeight: '800', color: colors.primary, marginTop: 15 },
  inputStack: { gap: 15 },
  inputLabel: { fontSize: 11, fontWeight: "800", color: colors.textMuted, letterSpacing: 1 },
  commentInput: {
    backgroundColor: colors.surface,
    borderRadius: 25,
    padding: 20,
    fontSize: 16,
    color: colors.text,
    minHeight: 180,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: colors.border
  },
  footer: { marginTop: 'auto', paddingVertical: 20 },
});
