import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Trophy,
  Package,
  Building2,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react-native";
import { Colors, Shadows } from "../theme/colors";
import { inventoryAPI } from "../services/api";

const { width } = Dimensions.get("window");

const BRAND_LOGOS = {
  Apple: require("../../assets/logos/apple.png"),
  Google: require("../../assets/logos/google.png"),
  Samsung: require("../../assets/logos/samsung.png"),
  OnePlus: require("../../assets/logos/oneplus.png"),
  Xiaomi: require("../../assets/logos/xiaomi.png"),
  Oppo: require("../../assets/logos/oppo.png"),
  Vivo: require("../../assets/logos/vivo.png"),
  IQOO: require("../../assets/logos/iqoo.png"),
  Motorola: require("../../assets/logos/motorola.png"),
};

const getBrandLogo = (brandName) => {
  const name = brandName.toLowerCase();
  if (name.includes("apple") || name.includes("iphone"))
    return BRAND_LOGOS.Apple;
  if (name.includes("google") || name.includes("pixel"))
    return BRAND_LOGOS.Google;
  if (name.includes("samsung")) return BRAND_LOGOS.Samsung;
  if (name.includes("oneplus")) return BRAND_LOGOS.OnePlus;
  if (name.includes("xiaomi") || name.includes("mi") || name.includes("poco"))
    return BRAND_LOGOS.Xiaomi;
  if (name.includes("oppo")) return BRAND_LOGOS.Oppo;
  if (name.includes("vivo")) return BRAND_LOGOS.Vivo;
  if (name.includes("iqoo")) return BRAND_LOGOS.IQOO;
  if (name.includes("motorola") || name.includes("moto"))
    return BRAND_LOGOS.Motorola;
  return null;
};

function StatCard({
  value,
  label,
  icon,
  color,
  subValue,
  fullWidth,
  isImage,
  iconWidth = 40,
  iconHeight = 40,
}) {
  const boxSize = Math.max(iconWidth, iconHeight) * 1.5;

  return (
    <View
      style={[
        styles.statCard,
        fullWidth && { width: width - 40 },
        Shadows.card,
      ]}
    >
      <LinearGradient colors={["#FFF", "#F9FAFB"]} style={styles.statGrad}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isImage ? "#FFF" : color + "15" },
            isImage && {
              width: boxSize,
              height: boxSize,
              borderRadius: boxSize / 4,
            },
          ]}
        >
          {isImage ? (
            <Image
              source={icon}
              style={{ width: iconWidth, height: iconHeight }}
              resizeMode="contain"
            />
          ) : typeof icon === "string" ? (
            <Text style={[styles.statIcon, { color }]}>{icon}</Text>
          ) : (
            icon
          )}
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {subValue && <Text style={styles.subValue}>{subValue}</Text>}
        </View>
      </LinearGradient>
    </View>
  );
}

export default function DashboardScreen({ onTabChange }) {
  const headerAnim = useRef(new Animated.Value(-10)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // ========================
  // Fetch stats from API
  // ========================

  const fetchStats = useCallback(async () => {
    try {
      const response = await inventoryAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.warn("Failed to fetch stats:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, [fetchStats]);

  // ========================
  // Extract data from stats
  // ========================

  // Derived stats with fallbacks
  const totalStock = stats?.totalQuantity || 0;
  const activeBrands = stats?.brandDistribution?.length || 0;
  const bestSeller = stats?.bestSelling?.model || "N/A";
  const potentialProfit = stats?.potentialProfit || 0;

  // Get Top 4 Brands by Quantity
  const topBrands = Array.isArray(stats?.brandDistribution)
    ? [...stats.brandDistribution]
        .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
        .slice(0, 4)
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View
          style={{
            opacity: headerOpacity,
            transform: [{ translateY: headerAnim }],
          }}
        >
          <View style={styles.header}>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.title}>
              <Text style={styles.bold}>Dashboard</Text> Overview.
            </Text>
          </View>
        </Animated.View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1A1A1A" />
            <Text style={styles.loadingText}>Loading dashboard...</Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            {/* Best Seller Unit */}
            <StatCard
              label="Best Seller Phone"
              value={bestSeller}
              icon={<Trophy size={20} color="#F59E0B" />}
              color="#F59E0B"
              subValue="Highest quantity in stock"
              fullWidth={true}
            />

            {/* Core Stats */}
            <View style={styles.row}>
              <StatCard
                label="Total Stock"
                value={totalStock}
                icon={<Package size={20} color="#3B82F6" />}
                color="#3B82F6"
                subValue="Units across all brands"
              />
              <StatCard
                label="Active Brands"
                value={activeBrands}
                icon={<Building2 size={20} color="#8B5CF6" />}
                color="#8B5CF6"
                subValue="Registered suppliers"
              />
            </View>

            {topBrands.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Brand Distribution</Text>

                {/* Render top brands in pairs */}
                {[0, 2].map((startIndex) => {
                  const pair = topBrands.slice(startIndex, startIndex + 2);
                  if (pair.length === 0) return null;

                  return (
                    <View key={`brand-row-${startIndex}`} style={styles.row}>
                      {pair.map((brand) => {
                        const logo = getBrandLogo(brand._id);
                        return (
                          <StatCard
                            key={brand._id}
                            // label={brand._id}
                            value={brand.totalQuantity}
                            icon={logo || <Package size={40} color="#6B7280" />}
                            isImage={!!logo}
                            iconWidth={60}
                            iconHeight={60}
                            color={logo ? "#111827" : "#6B7280"}
                            subValue="Units in stock"
                          />
                        );
                      })}
                      {/* If only one brand in row, add an empty placeholder to maintain grid */}
                      {pair.length === 1 && <View style={styles.statCard} />}
                    </View>
                  );
                })}
              </>
            )}

            {/* Potential Profit Card */}
            {potentialProfit > 0 && (
              <StatCard
                label="Potential Profit"
                value={`₹${(potentialProfit / 1000).toFixed(1)}k`}
                icon={<TrendingUp size={20} color="#10B981" />}
                color="#10B981"
                subValue="Selling - Purchase value"
                fullWidth={true}
              />
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onTabChange("Stocks")}
        >
          <LinearGradient
            colors={["#1A1A1A", "#333"]}
            style={styles.actionGrad}
          >
            <View>
              <Text style={styles.actionTitle}>View Full Inventory</Text>
              <Text style={styles.actionSub}>Check status and edit items</Text>
            </View>
            <ArrowRight size={24} color="#FFF" strokeWidth={1.5} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  welcome: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    color: "#111827",
    fontWeight: "300",
    marginTop: 4,
  },
  bold: { fontWeight: "700" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  // Loading
  loadingContainer: {
    paddingVertical: 80,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  statsGrid: {
    paddingHorizontal: 20,
    gap: 15,
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  statCard: {
    width: (width - 55) / 2,
    borderRadius: 24,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  statGrad: {
    padding: 20,
    minHeight: 140,
    justifyContent: "space-between",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statContent: {
    gap: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  subValue: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  actionCard: {
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  actionGrad: {
    padding: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  actionSub: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 4,
  },
  actionIcon: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "300",
  },
});
