import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Shadows } from "../theme/colors";
import { analyticsData } from "../data/mockData";
import {
  TrendingUp,
  DollarSign,
  Target,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  X,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

function AnimatedNumber({ target, prefix = "", suffix = "", style }) {
  const animVal = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const num = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    Animated.timing(animVal, {
      toValue: num,
      duration: 1400,
      useNativeDriver: false,
    }).start();

    const id = animVal.addListener(({ value }) => {
      setDisplay(
        Number.isInteger(num)
          ? Math.floor(value).toLocaleString()
          : value.toFixed(1),
      );
    });
    return () => animVal.removeListener(id);
  }, []);

  return (
    <Text style={style}>
      {prefix}
      {display}
      {suffix}
    </Text>
  );
}

function LineGraph({ data, labels, color, height = 120 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * (width - 70),
    y: height - ((v - min) / range) * (height - 30) - 10,
  }));

  return (
    <View style={{ height: height + 40, marginTop: 20 }}>
      <View style={styles.graphContainer}>
        {pts.slice(0, -1).map((pt, i) => {
          const next = pts[i + 1];
          const dx = next.x - pt.x;
          const dy = next.y - pt.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View
              key={i}
              style={[
                styles.graphLine,
                {
                  left: pt.x,
                  top: pt.y,
                  width: len,
                  backgroundColor: color,
                  transform: [{ rotate: `${angle}deg` }],
                  transformOrigin: "0 0",
                },
              ]}
            />
          );
        })}
        {pts.map((pt, i) => (
          <View
            key={i}
            style={[
              styles.graphDot,
              {
                left: pt.x - 4,
                top: pt.y - 4,
                backgroundColor: color,
                borderColor: "#FFF",
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.lgLabels}>
        {labels.map((l, i) => (
          <Text key={i} style={styles.lgLabel}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState("weekly");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your performance</Text>
        </View>

        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, Shadows.card]}>
            <View style={[styles.kpiIconBox, { backgroundColor: "#EFF6FF" }]}>
              <DollarSign size={20} color="#3B82F6" />
            </View>
            <AnimatedNumber
              target={analyticsData.totalRevenue / 1000}
              prefix="$"
              suffix="k"
              style={styles.kpiValue}
            />
            <Text style={styles.kpiLabel}>Revenue</Text>
          </View>

          <View style={[styles.kpiCard, Shadows.card]}>
            <View style={[styles.kpiIconBox, { backgroundColor: "#F0FDF4" }]}>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <AnimatedNumber
              target={analyticsData.totalProfit / 1000}
              prefix="$"
              suffix="k"
              style={styles.kpiValue}
            />
            <Text style={styles.kpiLabel}>Net Profit</Text>
          </View>
        </View>

        {/* Main Chart */}
        <View style={[styles.graphCard, Shadows.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sales Velocity</Text>
            <View style={styles.toggle}>
              {["weekly", "monthly"].map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPeriod(p)}
                  style={[
                    styles.toggleBtn,
                    period === p && styles.toggleBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      period === p && styles.toggleTextActive,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <LineGraph
            data={
              period === "weekly"
                ? analyticsData.weeklySales
                : analyticsData.monthlyProfit.map((v) => v / 1000)
            }
            labels={
              period === "weekly"
                ? analyticsData.weeklyLabels
                : analyticsData.monthlyLabels
            }
            color="#1A1A1A"
          />
        </View>

        {/* Insight Row */}
        <View style={styles.insightRow}>
          <View style={[styles.miniInsight, Shadows.card]}>
            <View style={styles.miniIconBox}>
              <Target size={16} color="#333" />
            </View>
            <Text style={styles.miniTitle}>Growth</Text>
            <Text style={styles.miniVal}>+{analyticsData.profitGrowth}%</Text>
          </View>
          <View style={[styles.miniInsight, Shadows.card]}>
            <View style={styles.miniIconBox}>
              <ArrowUp size={16} color="#10B981" />
            </View>
            <Text style={styles.miniTitle}>Top Brand</Text>
            <Text style={styles.miniVal}>
              {analyticsData.brandDistribution[0].brand}
            </Text>
          </View>
        </View>

        {/* Movement Section */}
        <View style={[styles.movCard, Shadows.card]}>
          <Text style={styles.cardTitle}>Stock Pulse</Text>
          <View style={styles.movList}>
            {[
              {
                label: "Received",
                val: 47,
                color: "#3B82F6",
                icon: <ArrowDown size={14} color="#3B82F6" />,
              },
              {
                label: "Sold",
                val: 193,
                color: "#1A1A1A",
                icon: <ArrowUp size={14} color="#1A1A1A" />,
              },
              {
                label: "Returns",
                val: 3,
                color: "#F59E0B",
                icon: <RotateCcw size={14} color="#F59E0B" />,
              },
            ].map((row, i) => (
              <View key={i} style={styles.movRow}>
                <View style={styles.rowLead}>
                  <View
                    style={[
                      styles.rowIcon,
                      { backgroundColor: row.color + "15" },
                    ]}
                  >
                    {row.icon}
                  </View>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                </View>
                <View style={styles.barWrap}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${(row.val / 200) * 100}%`,
                        backgroundColor: row.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.rowVal}>{row.val}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF6FF" },
  scroll: { paddingTop: 60, paddingHorizontal: 20 },
  header: { marginBottom: 25 },
  title: { fontSize: 28, fontWeight: "800", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#9CA3AF", marginTop: 4, fontWeight: "500" },

  kpiGrid: { flexDirection: "row", gap: 12, marginBottom: 20 },
  kpiCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 18,
    gap: 4,
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  kpiValue: { fontSize: 22, fontWeight: "800", color: "#1A1A1A" },
  kpiLabel: { fontSize: 12, color: "#9CA3AF", fontWeight: "600" },

  graphCard: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "800", color: "#1A1A1A" },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 2,
  },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  toggleBtnActive: {
    backgroundColor: "#FFF",
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  toggleText: { fontSize: 11, fontWeight: "600", color: "#9CA3AF" },
  toggleTextActive: { color: "#1A1A1A" },

  graphContainer: { height: 120, width: "100%" },
  graphLine: { position: "absolute", height: 2, borderRadius: 1 },
  graphDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  lgLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  lgLabel: { fontSize: 10, color: "#9CA3AF", fontWeight: "600" },

  insightRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  miniInsight: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  miniIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  miniTitle: { fontSize: 11, color: "#9CA3AF", fontWeight: "600" },
  miniVal: { fontSize: 14, fontWeight: "800", color: "#1A1A1A" },

  movCard: { backgroundColor: "#FFF", borderRadius: 28, padding: 20 },
  movList: { marginTop: 20, gap: 15 },
  movRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowLead: { flexDirection: "row", alignItems: "center", gap: 10, width: 85 },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
  barWrap: {
    flex: 1,
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 3 },
  rowVal: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    width: 25,
    textAlign: "right",
  },
});
