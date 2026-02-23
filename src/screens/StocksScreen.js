import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Shadows } from "../theme/colors";
import { stockData as initialData, brands } from "../data/mockData";
import StockCard from "../components/StockCard";

export default function StocksScreen() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [data, setData] = useState(initialData);

  const filtered = data.filter((item) => {
    const matchSearch =
      item.model.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
    const matchBrand = selectedBrand === "All" || item.brand === selectedBrand;
    return matchSearch && matchBrand;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Inventory List</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search inventory..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandScroll}
        >
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand}
              onPress={() => setSelectedBrand(brand)}
              style={[
                styles.brandChip,
                selectedBrand === brand && styles.brandChipActive,
              ]}
            >
              <Text
                style={[
                  styles.brandText,
                  selectedBrand === brand && styles.brandTextActive,
                ]}
              >
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StockCard
            item={item}
            onDelete={(i) => setData(data.filter((x) => x.id !== i.id))}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  searchRow: {
    marginBottom: 20,
  },
  searchBox: {
    height: 50,
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  brandScroll: {
    paddingBottom: 15,
    gap: 10,
  },
  brandChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  brandChipActive: {
    backgroundColor: "#1A1A1A",
  },
  brandText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
  },
  brandTextActive: {
    color: "#FFF",
  },
  list: {
    paddingTop: 10,
    paddingBottom: 110,
  },
});
