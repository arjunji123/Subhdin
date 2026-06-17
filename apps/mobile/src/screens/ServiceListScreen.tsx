import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";

type Props = {
  services: any[];
  onAdd: () => void;
  onEdit: (service: any) => void;
  onDelete: (id: string) => void;
  loading: boolean;
};

export function ServiceListScreen({ services, onAdd, onEdit, onDelete, loading }: Props) {
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.name}>{item.serviceName}</Text>
        </View>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => {
            Alert.alert("Delete", "Are you sure?", [
              { text: "Cancel" },
              { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) }
            ]);
          }}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Services</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addBtnText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      {services.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No services added yet.</Text>
          <Button title="Create First Service" onPress={onAdd} variant="outline" />
        </View>
      ) : (
        <FlatList
          data={services}
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  list: {
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  category: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 12,
  },
  editBtn: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  editBtnText: {
    color: colors.text,
    fontWeight: "600",
  },
  deleteBtn: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  deleteBtnText: {
    color: colors.error,
    fontWeight: "600",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 20,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
  },
});
