import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  reviews: any[];
  onBack: () => void;
};

export function ReviewsScreen({ reviews, onBack }: Props) {
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
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Customer Reviews</Text>
      </View>

      {reviews.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No reviews yet.</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
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
    padding: 24,
    gap: 16,
  },
  back: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "700",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  list: {
    padding: 24,
    paddingTop: 0,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
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
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
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
  },
  emptyText: {
    color: colors.textMuted,
  },
});
