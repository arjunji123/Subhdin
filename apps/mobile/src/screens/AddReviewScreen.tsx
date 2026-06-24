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
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Submit Review</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.vendorBox}>
              <Text style={styles.vendorLabel}>Vibe check for</Text>
              <Text style={styles.vendorName}>{vendorName}</Text>
          </View>

          <View style={styles.starWrapper}>
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => {
                    try {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch(e) {}
                    setRating(s);
                    }}>
                    <Ionicons
                    name={s <= rating ? "star" : "star-outline"}
                    size={44}
                    color={s <= rating ? colors.primary : colors.border}
                    />
                </TouchableOpacity>
                ))}
            </View>
            <Text style={styles.ratingText}>
                {rating === 1 ? "Disappointing" :
                 rating === 2 ? "Could be better" :
                 rating === 3 ? "It was okay" :
                 rating === 4 ? "Loved it!" :
                 rating === 5 ? "Absolutely Perfect!" : "Tap to rate"}
            </Text>
          </View>

          <View style={styles.inputStack}>
            <View style={styles.field}>
                <Text style={styles.fieldLabel}>Reviewing as <Text style={{ color: colors.primary }}>{userName}</Text></Text>
                <Text style={styles.hintText}>Your name will be visible on the platform.</Text>
            </View>

            <View style={styles.field}>
                <Text style={styles.fieldLabel}>Detailed Experience</Text>
                <TextInput
                style={styles.commentInput}
                placeholder="Share the magic moments or areas to improve..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
                />
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Post Review"
              onPress={() => onSubmit(rating, comment)}
              disabled={isInvalid}
              loading={loading}
            />
            <Text style={styles.guarantee}>Verified reviews help Subhdin stay trustworthy.</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, height: 80 },
  backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.surfaceDark, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "900", color: colors.text, letterSpacing: -0.5 },
  content: { flex: 1, padding: 24 },
  vendorBox: { marginBottom: 40, alignItems: 'center' },
  vendorLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5 },
  vendorName: { fontSize: 26, fontWeight: "900", color: colors.text, marginTop: 8, textAlign: "center" },
  starWrapper: { alignItems: 'center', marginBottom: 50 },
  starContainer: { flexDirection: "row", gap: 12 },
  ratingText: { fontSize: 15, fontWeight: '800', color: colors.primary, marginTop: 15 },
  inputStack: { gap: 30, marginBottom: 40 },
  field: { gap: 10 },
  fieldLabel: { fontSize: 14, fontWeight: "800", color: colors.text, marginLeft: 4 },
  nameInput: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 20,
    padding: 18,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600'
  },
  commentInput: {
    backgroundColor: colors.surfaceDark,
    borderRadius: 24,
    padding: 20,
    fontSize: 16,
    color: colors.text,
    minHeight: 180,
    fontWeight: '600'
  },
  footer: { width: "100%", paddingVertical: 20, gap: 15 },
  guarantee: { fontSize: 11, color: colors.textMuted, textAlign: 'center', fontWeight: '600' },
});
