import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image } from "react-native";
import { colors } from "../theme/colors";
import { Button } from "../components/Button";
import { Ionicons } from '@expo/vector-icons';

type Props = {
  services: any[];
  onAdd: () => void;
  onEdit: (service: any) => void;
  onView: (service: any) => void;
  onDelete: (id: string) => void;
  loading: boolean;
};

export function ServiceListScreen({ services, onAdd, onEdit, onView, onDelete, loading }: Props) {
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.imagePlaceholder}>
            {item.galleryImages?.[0] ? (
                <Image source={{ uri: item.galleryImages[0] }} style={styles.serviceImg} />
            ) : (
                <Ionicons name="briefcase-outline" size={24} color={colors.textMuted} />
            )}
        </View>
        <View style={styles.info}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.serviceName}</Text>
          <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onView(item)}>
            <Ionicons name="eye-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]} onPress={() => onEdit(item)}>
            <Ionicons name="pencil-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
            onPress={() => {
              Alert.alert("Delete Service", "Are you sure you want to remove this service?", [
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
          <Text style={styles.title}>Your Services</Text>
          <Text style={styles.subtitle}>{services.length} active listings</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {services.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="construct-outline" size={64} color={colors.border} />
          </View>
          <Text style={styles.emptyText}>No services added yet.</Text>
          <Text style={styles.emptySub}>Add your first service to start getting leads.</Text>
          <Button title="Add First Service" onPress={onAdd} variant="primary" />
        </View>
      ) : (
        <FlatList
          data={services}
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
  addBtn: { backgroundColor: colors.primary, width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  list: { paddingBottom: 40, gap: 16 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 12, borderWidth: 1, borderColor: colors.border },
  cardContent: { flexDirection: "row", alignItems: "center" },
  imagePlaceholder: { width: 60, height: 60, borderRadius: 12, backgroundColor: colors.surfaceDark, alignItems: "center", justifyContent: "center", overflow: 'hidden' },
  serviceImg: { width: '100%', height: '100%' },
  info: { flex: 1, marginLeft: 16, gap: 2 },
  category: { fontSize: 11, fontWeight: "700", color: colors.primary, textTransform: "uppercase" },
  name: { fontSize: 16, fontWeight: "800", color: colors.text },
  price: { fontSize: 15, fontWeight: "700", color: colors.textMuted },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.surfaceDark, alignItems: "center", justifyContent: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 80 },
  emptyIcon: { marginBottom: 20 },
  emptyText: { color: colors.text, fontSize: 18, fontWeight: "800" },
  emptySub: { color: colors.textMuted, fontSize: 14, marginTop: 8, marginBottom: 24, textAlign: 'center' }
});
