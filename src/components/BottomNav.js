import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";

const { width } = Dimensions.get("window");

const TAB_CONFIG = [
  { key: "Dashboard", icon: "⊞", label: "Dashboard" },
  { key: "Stocks", icon: "📦", label: "Stocks" },
  { key: "AddStock", icon: "+", label: "Add", isFab: true },
  { key: "Analytics", icon: "📊", label: "Analytics" },
  { key: "Settings", icon: "⚙", label: "Settings" },
];

export default function BottomNav({ activeTab, onTabChange }) {
  const animations = useRef(
    TAB_CONFIG.map(() => new Animated.Value(0)),
  ).current;
  const fabScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    TAB_CONFIG.forEach((tab, i) => {
      Animated.spring(animations[i], {
        toValue: activeTab === tab.key ? 1 : 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }).start();
    });
  }, [activeTab]);

  const handleFabPress = () => {
    Animated.sequence([
      Animated.spring(fabScale, {
        toValue: 0.88,
        useNativeDriver: true,
        speed: 30,
      }),
      Animated.spring(fabScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start();
    onTabChange("AddStock");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(18,23,43,0.98)", "rgba(11,14,26,0.99)"]}
        style={styles.navBar}
      >
        {TAB_CONFIG.map((tab, i) => {
          if (tab.isFab) {
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.fabWrapper}
                onPress={handleFabPress}
                activeOpacity={0.9}
              >
                <Animated.View style={{ transform: [{ scale: fabScale }] }}>
                  <LinearGradient
                    colors={Colors.gradPrimary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fab}
                  >
                    <Text style={styles.fabIcon}>+</Text>
                  </LinearGradient>
                </Animated.View>
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab.key && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          const isActive = activeTab === tab.key;
          const translateY = animations[i].interpolate({
            inputRange: [0, 1],
            outputRange: [0, -4],
          });
          const scale = animations[i].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.12],
          });

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.iconWrapper,
                  { transform: [{ translateY }, { scale }] },
                ]}
              >
                {isActive && (
                  <Animated.View
                    style={[styles.activePill, { opacity: animations[i] }]}
                  />
                )}
                <Text
                  style={[styles.tabIcon, isActive && styles.tabIconActive]}
                >
                  {tab.icon}
                </Text>
              </Animated.View>
              <Animated.Text
                style={[
                  styles.tabLabel,
                  {
                    opacity: animations[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 24,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  iconWrapper: {
    width: 44,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    position: "relative",
  },
  activePill: {
    position: "absolute",
    width: 40,
    height: 30,
    borderRadius: 14,
    backgroundColor: Colors.primaryGlow,
  },
  tabIcon: {
    fontSize: 19,
    color: Colors.textMuted,
  },
  tabIconActive: {
    color: Colors.primaryLight,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.primaryLight,
    fontWeight: "700",
  },
  fabWrapper: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    marginTop: -22,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 14,
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
    lineHeight: 32,
    marginTop: -2,
  },
});
