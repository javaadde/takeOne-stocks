import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Shadows } from "../theme/colors";
import { stockData, brands } from "../data/mockData";

const { width } = Dimensions.get("window");

function CategoryIcon({ label, icon, active, onPress }) {
  return (
    <TouchableOpacity style={styles.catWrap} onPress={onPress}>
      <View style={[styles.catCircle, active && styles.catCircleActive]}>
        <Text style={styles.catEmoji}>{icon}</Text>
      </View>
      <Text style={[styles.catLabel, active && styles.catLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen({ onTabChange }) {
  const headerAnim = useRef(new Animated.Value(-10)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const categories = [
    { id: "1", label: "Apple", icon: "🍎" },
    { id: "2", label: "Samsung", icon: "📱" },
    { id: "3", label: "Google", icon: "🔍" },
    { id: "4", label: "Xiaomi", icon: "⚡" },
    { id: "5", label: "OnePlus", icon: "🚀" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header - Reference Style */}
        <Animated.View
          style={{
            opacity: headerOpacity,
            transform: [{ translateY: headerAnim }],
          }}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLoc}>
                <View style={styles.locIconWrap}>
                  <Text style={styles.locIcon}>🚚</Text>
                </View>
                <View>
                  <Text style={styles.locLabel}>Status</Text>
                  <Text style={styles.locValue}>Active Management</Text>
                </View>
              </View>
              <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.hBtn}>
                  <Text style={styles.hIcon}>🔔</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.hBtn}>
                  <Text style={styles.hIcon}>🛒</Text>
                  <View style={styles.notifDot} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.title}>
              <Text style={styles.bold}>Optimize?</Text> Manage & Sell.
            </Text>

            {/* Search Bar - Reference Style */}
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  placeholder="Search for models..."
                  style={styles.searchInput}
                  placeholderTextColor="#999"
                />
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <Text style={styles.filterIcon}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Categories - Reference Style */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          <CategoryIcon label="All" icon="📱" active={true} />
          {categories.map((c) => (
            <CategoryIcon key={c.id} label={c.label} icon={c.icon} />
          ))}
        </ScrollView>

        {/* Featured Cards - Reference Style */}
        <View style={styles.cardGrid}>
          {stockData.slice(0, 4).map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.productCard, Shadows.card]}
            >
              <LinearGradient
                colors={["#FFF", "#F8F9FA"]}
                style={styles.productGrad}
              >
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{(idx + 1) * 5}%</Text>
                </View>
                <View style={styles.productImgBox}>
                  <Text style={styles.productEmoji}>📱</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productModel} numberOfLines={1}>
                    {item.model}
                  </Text>
                  <Text style={styles.productBrand}>{item.brand}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceSymbol}>$</Text>
                    <Text style={styles.price}>
                      {(item.sellingPrice / 1000).toFixed(2)}
                    </Text>
                    <TouchableOpacity style={styles.addBtn}>
                      <Text style={styles.addIcon}>−</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scroll: {
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLoc: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  locIcon: { fontSize: 18 },
  locLabel: { fontSize: 11, color: "#999", fontWeight: "500" },
  locValue: { fontSize: 13, color: "#333", fontWeight: "700" },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
  },
  hBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
  hIcon: { fontSize: 18 },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  title: {
    fontSize: 28,
    color: "#333",
    fontWeight: "300",
    marginBottom: 25,
  },
  bold: { fontWeight: "700" },

  // Search
  searchRow: {
    flexDirection: "row",
    gap: 12,
  },
  searchBox: {
    flex: 1,
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
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  filterIcon: { fontSize: 18 },

  // Categories
  catScroll: {
    paddingLeft: 20,
    paddingBottom: 25,
    gap: 15,
  },
  catWrap: {
    alignItems: "center",
    gap: 8,
  },
  catCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  catCircleActive: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEE",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  catEmoji: { fontSize: 24 },
  catLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  catLabelActive: {
    color: "#333",
    fontWeight: "700",
  },

  // Grid
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    rowGap: 16,
  },
  productCard: {
    width: (width - 40) / 2,
    marginHorizontal: 4,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#FFF",
  },
  productGrad: {
    padding: 15,
    borderRadius: 28,
    minHeight: 220,
  },
  discountBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  discountText: { fontSize: 10, fontWeight: "700", color: "#333" },
  productImgBox: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  productEmoji: { fontSize: 50 },
  productInfo: {
    gap: 2,
  },
  productModel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  productBrand: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceSymbol: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: "700",
    marginRight: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    flex: 1,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: { color: "#FFF", fontSize: 20, fontWeight: "300" },
});
