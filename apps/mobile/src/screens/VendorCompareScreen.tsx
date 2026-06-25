import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { getVendorImage } from "../utils/vendor";

const { width } = Dimensions.get("window");
const LABEL_WIDTH = 100;
const COLUMN_WIDTH = 160;

type Props = {
  vendors: any[];
  onBack: () => void;
  onRemove: (id: string) => void;
};

export function VendorCompareScreen({ vendors, onBack, onRemove }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedServicesVendor, setSelectedServicesVendor] = useState<any>(null);

  // Ref to sync horizontal scrolls
  const horizontalScrollRef = useRef<ScrollView>(null);

  const renderRow = (label: string, renderValue: (v: any, idx: number) => React.ReactNode) => (
    <View style={styles.dataRow}>
      <View style={styles.labelCol}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={styles.valuesRow}>
        {vendors.map((v, idx) => (
          <View key={v.id} style={styles.valueCol}>
            {renderValue(v, idx)}
          </View>
        ))}
        {vendors.length < 3 && <View style={{ width: COLUMN_WIDTH }} />}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
            <Text style={styles.title}>Compare Experts</Text>
            <Text style={styles.subtitle}>{vendors.length} selected (Slide right →)</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} bounces={false}>
        <View>
          {/* Sticky-like Header in Horizontal Scroll */}
          <View style={styles.stickyHeader}>
              <View style={styles.labelCol} />
              <View style={styles.valuesRow}>
                  {vendors.map((v, idx) => (
                      <View key={v.id} style={styles.vendorHeaderCard}>
                          <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(v.id)}>
                              <Ionicons name="close-circle" size={22} color={colors.error} />
                          </TouchableOpacity>
                          <Image source={{ uri: getVendorImage(v, idx) }} style={styles.vImage} />
                          <Text style={styles.vName} numberOfLines={2}>{v.businessName || v.name}</Text>
                      </View>
                  ))}
                  {vendors.length < 3 && (
                      <TouchableOpacity style={styles.addMoreCard} onPress={onBack}>
                          <View style={styles.addIconBox}>
                              <Ionicons name="add" size={30} color={colors.primary} />
                          </View>
                          <Text style={styles.addText}>Add Expert</Text>
                      </TouchableOpacity>
                  )}
              </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              <View style={styles.compareBody}>
                  {renderRow("Experience", (v) => <Text style={styles.valueText}>{v.category || "General"}</Text>)}
                  {renderRow("Location", (v) => <Text style={styles.valueText}>{v.area}</Text>)}
                  {renderRow("City", (v) => <Text style={styles.valueText}>{v.city}</Text>)}
                  {renderRow("Min Price", (v) => <Text style={[styles.valueText, { color: colors.primary }]}>₹{v.minPrice || 0}</Text>)}
                  {renderRow("Rating", (v) => (
                      <View style={styles.ratingBox}>
                          <Text style={styles.ratingText}>{(Number(v.averageRating || 0)).toFixed(1)}</Text>
                          <Ionicons name="star" size={12} color={colors.primary} />
                      </View>
                  ))}

                  {/* Clickable Services Row */}
                  {renderRow("Services", (v) => (
                      <TouchableOpacity
                        style={styles.servicesPill}
                        onPress={() => setSelectedServicesVendor(v)}
                      >
                          <Text style={styles.servicesPillText}>{v.serviceCount || v.services?.length || 0} Items</Text>
                          <Ionicons name="chevron-down" size={12} color={colors.white} />
                      </TouchableOpacity>
                  ))}

                  {renderRow("Status", (v) => (
                      <View style={[styles.statusBadge, v.status === 'APPROVED' ? styles.bgSuccess : styles.bgWarning]}>
                          <Text style={styles.statusText}>{v.status || "PENDING"}</Text>
                      </View>
                  ))}
              </View>
              <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </ScrollView>

      {/* Services Detail Modal */}
      <Modal visible={!!selectedServicesVendor} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
              <View style={styles.bottomSheet}>
                  <View style={styles.dragIndicator} />
                  <View style={styles.modalHeader}>
                      <View>
                        <Text style={styles.modalTitle}>Services Portfolio</Text>
                        <Text style={styles.modalSubtitle}>{selectedServicesVendor?.businessName}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setSelectedServicesVendor(null)} style={styles.closeBtn}>
                          <Ionicons name="close" size={24} color={colors.text} />
                      </TouchableOpacity>
                  </View>

                  <FlatList
                    data={selectedServicesVendor?.services || []}
                    keyExtractor={(item, idx) => item.id || idx.toString()}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    renderItem={({ item }) => (
                        <View style={styles.serviceItem}>
                            <View style={styles.serviceIcon}>
                                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.serviceName}>{item.serviceName}</Text>
                                <Text style={styles.serviceCategory}>{item.category}</Text>
                            </View>
                            <Text style={styles.servicePrice}>₹{item.price}</Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyServices}>
                            <Ionicons name="list-outline" size={40} color={colors.border} />
                            <Text style={styles.emptyText}>No detailed services listed yet.</Text>
                        </View>
                    }
                  />
              </View>
          </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, height: 70, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center' },
  headerTitleWrap: { alignItems: 'center' },
  title: { fontSize: 18, fontWeight: "900", color: colors.text },
  subtitle: { fontSize: 11, color: colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  stickyHeader: { flexDirection: 'row', paddingVertical: 24, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border },
  labelCol: { width: LABEL_WIDTH },
  valuesRow: { flexDirection: 'row' },
  vendorHeaderCard: { width: COLUMN_WIDTH, alignItems: 'center', position: 'relative' },
  vImage: { width: 90, height: 90, borderRadius: 24, borderWidth: 3, borderColor: colors.white },
  vName: { fontSize: 13, fontWeight: "800", color: colors.text, textAlign: "center", marginTop: 10, paddingHorizontal: 15 },
  removeBtn: { position: 'absolute', top: -5, right: 30, zIndex: 10, backgroundColor: colors.white, borderRadius: 12, elevation: 2 },
  addMoreCard: { width: COLUMN_WIDTH, alignItems: 'center', justifyContent: 'center' },
  addIconBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: colors.primary },
  addText: { fontSize: 11, fontWeight: '700', color: colors.primary, marginTop: 8 },
  compareBody: { },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  labelCol: { width: LABEL_WIDTH, justifyContent: 'center', paddingLeft: 20, backgroundColor: colors.surfaceDark },
  labelText: { fontSize: 11, fontWeight: "800", color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  valueCol: { width: COLUMN_WIDTH, paddingVertical: 20, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  valueText: { fontSize: 14, fontWeight: "700", color: colors.text, textAlign: 'center' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '800', color: colors.text },
  servicesPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  servicesPillText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  bgSuccess: { backgroundColor: colors.success + '20' },
  bgWarning: { backgroundColor: colors.warning + '20' },
  statusText: { fontSize: 10, fontWeight: '900', color: colors.text },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: colors.white, borderTopLeftRadius: 35, borderTopRightRadius: 35, height: '60%', padding: 24 },
  dragIndicator: { width: 40, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 25 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: colors.text },
  modalSubtitle: { fontSize: 14, color: colors.primary, fontWeight: '700' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceDark, alignItems: 'center', justifyContent: 'center' },
  serviceItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.background, borderRadius: 20, marginBottom: 12, gap: 12 },
  serviceIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  serviceName: { fontSize: 15, fontWeight: '800', color: colors.text },
  serviceCategory: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  servicePrice: { fontSize: 16, fontWeight: '900', color: colors.primary },
  emptyServices: { alignItems: 'center', padding: 40, gap: 10 },
  emptyText: { color: colors.textMuted, fontWeight: '600' }
});
