import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from "../theme/colors";
import { Ionicons } from '@expo/vector-icons';

type Props = {
  reviews: any[];
  onBack: () => void;
};

export function ReviewsScreen({ reviews, onBack }: Props) {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.user}>{item.userName || "Customer"}</Text>
        <Text style={styles.rating}>★ {item.rating}</Text>
      </View>
      <Text style={styles.comment}>{item.comment || "No comment provided."}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>

      <TouchableOpacity style={styles.reportBtn}>
        <Text style={styles.reportText}>Report Spam</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Customer Reviews</Text>
        <View style={{ width: 40 }} />
      </View>

      {reviews.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.border} />
          <Text style={styles.emptyText}>No reviews yet.</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  list: {
    padding: 24,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  user: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  rating: {
    color: colors.primary,
    fontWeight: "800",
  },
  comment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 12,
  },
  reportBtn: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  reportText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: "600",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
    marginTop: 16,
  },
});
