import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Shadows } from "../theme/colors";

export default function StockCard({ item, onDelete }) {
  const statusColors = {
    in_stock: { bg: "#E1F5FE", text: "#039BE5" },
    low: { bg: "#FFF3E0", text: "#F57C00" },
    out_of_stock: { bg: "#FFEBEE", text: "#D32F2F" },
  };
  const status = statusColors[item.status] || statusColors.in_stock;

  return (
    <View style={[styles.card, Shadows.card]}>
      <View style={styles.content}>
        <View style={styles.imageBox}>
          <Text style={styles.emoji}>📱</Text>
        </View>

        <View style={styles.mainInfo}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.model}>{item.model}</Text>
              <Text style={styles.brand}>{item.brand}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.text }]}>
                {item.status.replace("_", " ").toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.stats}>
              <Text style={styles.statLabel}>Qty</Text>
              <Text style={styles.statValue}>{item.quantity}</Text>
            </View>
            <View style={styles.stats}>
              <Text style={styles.statLabel}>Price</Text>
              <Text style={styles.statValue}>
                ${(item.sellingPrice / 1000).toFixed(1)}k
              </Text>
            </View>
            <TouchableOpacity
              style={styles.delBtn}
              onPress={() => onDelete && onDelete(item)}
            >
              <Text style={styles.delIcon}>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F3F5",
  },
  content: {
    flexDirection: "row",
    padding: 16,
    gap: 15,
  },
  imageBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 32 },
  mainInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  model: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  brand: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 20,
  },
  stats: {
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  delBtn: {
    marginLeft: "auto",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  delIcon: { fontSize: 14, color: "#FF4D4D" },
});
