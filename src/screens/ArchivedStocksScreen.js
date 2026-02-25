import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, RotateCcw, Trash2, Package } from "lucide-react-native";
import { inventoryAPI } from "../services/api";
import { Colors, Shadows } from "../theme/colors";

export default function ArchivedStocksScreen() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArchivedItems = useCallback(async () => {
    try {
      const response = await inventoryAPI.getAll({
        isArchived: true,
        limit: 100,
      });
      setItems(response.data || []);
    } catch (error) {
      console.warn("Failed to fetch archived inventory:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchArchivedItems();
  }, [fetchArchivedItems]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchArchivedItems();
  }, [fetchArchivedItems]);

  const handleRestore = (item) => {
    Alert.alert(
      "Restore Stock",
      `Are you sure you want to restore "${item.brand} ${item.model}" to active inventory?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          onPress: async () => {
            try {
              await inventoryAPI.unarchive(item._id);
              setItems((prev) => prev.filter((i) => i._id !== item._id));
              Alert.alert("Success", "Item restored successfully");
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Permanently Delete",
      `This will permanently remove "${item.brand} ${item.model}". This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await inventoryAPI.delete(item._id);
              setItems((prev) => prev.filter((i) => i._id !== item._id));
            } catch (error) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Archived Stocks</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Package size={60} color="#E5E7EB" strokeWidth={1} />
            </View>
            <Text style={styles.emptyTitle}>No archived stocks</Text>
            <Text style={styles.emptySub}>
              Items you archive will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {items.map((item) => (
              <View key={item._id} style={[styles.itemCard, Shadows.card]}>
                <View style={styles.itemMain}>
                  <View style={styles.imageBox}>
                    {item.image?.url ? (
                      <Image
                        source={{ uri: item.image.url }}
                        style={styles.image}
                      />
                    ) : (
                      <Text style={styles.emoji}>📱</Text>
                    )}
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <Text style={styles.model}>{item.model}</Text>
                    <Text style={styles.qty}>
                      {item.quantity} Units in stock
                    </Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.restoreBtn]}
                    onPress={() => handleRestore(item)}
                  >
                    <RotateCcw size={18} color="#6366F1" />
                    <Text style={[styles.actionText, { color: "#6366F1" }]}>
                      Restore
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={() => handleDelete(item)}
                  >
                    <Trash2 size={18} color="#EF4444" />
                    <Text style={[styles.actionText, { color: "#EF4444" }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  scroll: {
    padding: 20,
  },
  center: {
    flex: 1,
    paddingVertical: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    paddingVertical: 100,
    alignItems: "center",
  },
  emptyIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  list: {
    gap: 16,
  },
  itemCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  itemMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 16,
  },
  imageBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emoji: {
    fontSize: 30,
  },
  info: {
    flex: 1,
  },
  brand: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6366F1",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  model: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  qty: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
  },
  restoreBtn: {
    backgroundColor: "#EEF2FF",
    borderColor: "#E0E7FF",
  },
  deleteBtn: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
