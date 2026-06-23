import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Switch } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { Ionicons } from '@expo/vector-icons';

type Props = {
  offers: any[];
  onAdd: () => void;
  onEdit: (offer: any) => void;
  onDelete: (id: string) => void;
  onToggleActive: (offer: any) => void;
  loading: boolean;
};

export function OfferListScreen({ offers, onAdd, onEdit, onDelete, onToggleActive, loading }: Props) {
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.offerTitle}>{item.title}</Text>
          <Text style={styles.discount}>{item.discountPercent}% OFF</Text>
        </View>
        <Switch
            value={item.isActive}
            onValueChange={() => onToggleActive(item)}
            trackColor={{ false: "#E5E7EB", true: colors.primary }}
            thumbColor={colors.white}
            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
        />
      </View>

      <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>

      <View style={styles.footer}>
        <View style={styles.dates}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={styles.dateText}>
            Valid until {new Date(item.endDate).toLocaleDateString()}
            </Text>
        </View>

        <View style={styles.actions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(item)}>
                <Ionicons name="pencil-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.iconBtn, { backgroundColor: "#FEE2E2" }]}
                onPress={() => {
                Alert.alert("Delete Offer", "Are you sure?", [
                    { text: "Cancel" },
                    { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) }
                ]);
                }}
            >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Promotions</Text>
          <Text style={styles.subtitle}>{offers.length} offers created</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {offers.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="pricetags-outline" size={64} color={colors.border} />
          <Text style={styles.emptyText}>No offers yet</Text>
          <Text style={styles.emptySub}>Boost your bookings with limited time discounts.</Text>
          <Button title="Create First Offer" onPress={onAdd} variant="primary" />
        </View>
      ) : (
        <FlatList
          data={offers}
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
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, paddingTop: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24, marginTop: 10 },
  title: { fontSize: 24, fontWeight: "900", color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  addBtn: { backgroundColor: colors.primary, width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", elevation: 4 },
  list: { paddingBottom: 40, gap: 16 },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  titleContainer: { flex: 1, gap: 4 },
  offerTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
  discount: { fontSize: 16, fontWeight: "900", color: colors.success },
  desc: { fontSize: 14, color: colors.textMuted, lineHeight: 20, marginBottom: 16 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 16 },
  dates: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateText: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  actions: { flexDirection: "row", gap: 12 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 80 },
  emptyText: { color: colors.text, fontSize: 18, fontWeight: "800", marginTop: 20 },
  emptySub: { color: colors.textMuted, fontSize: 14, marginTop: 8, marginBottom: 24, textAlign: 'center' }
});
