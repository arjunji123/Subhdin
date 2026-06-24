import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  vendors: any[];
  onBack: () => void;
};

export function VendorCompareScreen({ vendors, onBack }: Props) {
  const insets = useSafeAreaInsets();

  const renderComparisonRow = (label: string, field: string) => (
    <View style={styles.compareRow}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.valuesContainer}>
        {vendors.map((v) => (
          <View key={v.id} style={styles.valueCell}>
            <Text style={styles.valueText}>{v[field] || v.businessName || "N/A"}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Compare Vendors</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.vendorsHeader}>
            <View style={styles.labelSpacer} />
            <View style={styles.valuesContainer}>
              {vendors.map((v) => (
                <View key={v.id} style={styles.vendorHeaderCell}>
                  <Image source={{ uri: v.image }} style={styles.vendorImage} />
                  <Text style={styles.vendorName} numberOfLines={2}>{v.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {renderComparisonRow("Category", "category")}
            {renderComparisonRow("Price", "price")}
            {renderComparisonRow("Rating", "rating")}
            {renderComparisonRow("Capacity", "capacity")}
            {renderComparisonRow("Area", "location")}

            <View style={styles.compareRow}>
              <Text style={styles.rowLabel}>Highlights</Text>
              <View style={styles.valuesContainer}>
                {vendors.map((v) => (
                  <View key={v.id} style={styles.valueCell}>
                    <View style={styles.highlightsList}>
                      {["AC", "Parking", "WiFi"].map(h => (
                        <View key={h} style={styles.hTag}>
                            <Text style={styles.hTagText}>{h}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, height: 60, backgroundColor: colors.white },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "900", color: colors.text },
  vendorsHeader: { flexDirection: "row", paddingVertical: 20, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  labelSpacer: { width: 100 },
  valuesContainer: { flexDirection: "row" },
  vendorHeaderCell: { width: 150, alignItems: "center", paddingHorizontal: 10 },
  vendorImage: { width: 80, height: 80, borderRadius: 16, marginBottom: 10 },
  vendorName: { fontSize: 14, fontWeight: "800", color: colors.text, textAlign: "center" },
  compareRow: { flexDirection: "row", backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { width: 100, padding: 16, fontSize: 13, fontWeight: "700", color: colors.textMuted, backgroundColor: colors.surfaceDark },
  valueCell: { width: 150, padding: 16, alignItems: "center", justifyContent: "center" },
  valueText: { fontSize: 14, fontWeight: "700", color: colors.text },
  highlightsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
  hTag: { backgroundColor: colors.primaryLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  hTagText: { fontSize: 10, fontWeight: '700', color: colors.primary },
});
