import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { Home, Route, Plus, BarChart2, User } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";

const { width } = Dimensions.get("window");
const TAB_BAR_HORIZONTAL_MARGIN = 20;
const TAB_BAR_WIDTH = width - TAB_BAR_HORIZONTAL_MARGIN * 2;
const TAB_WIDTH = TAB_BAR_WIDTH / 5;

// Create the Material Top Tab Navigator for horizontal sliding pages
const MaterialTopTabs = withLayoutContext(
  createMaterialTopTabNavigator().Navigator,
);

function AnimatedIcon({ children, isFocused }) {
  const scale = useSharedValue(isFocused ? 1.2 : 1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.3 : 1, {
      damping: 12,
      stiffness: 120,
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

function MyTabBar({ state, descriptors, navigation }) {
  const translateX = useSharedValue(state.index * TAB_WIDTH);

  useEffect(() => {
    translateX.value = state.index * TAB_WIDTH;
  }, [state.index]);

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(translateX.value, {
            damping: 12,
            stiffness: 100,
            mass: 0.8,
          }),
        },
      ],
    };
  });

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        <Animated.View style={[styles.fluidSlider, animatedSliderStyle]} />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = options.tabBarIcon;
          const color = isFocused ? "#FFF" : "#B2BEC3";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.6}
            >
              <AnimatedIcon isFocused={isFocused}>
                {Icon && Icon({ focused: isFocused, color })}
              </AnimatedIcon>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled: true, // Allows swiping pages!
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="stocks"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Route size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Plus size={28} color={color} strokeWidth={focused ? 3 : 2} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BarChart2
              size={22}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <User size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </MaterialTopTabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: Platform.OS === "ios" ? 40 : 25,
    paddingHorizontal: TAB_BAR_HORIZONTAL_MARGIN,
    backgroundColor: "transparent",
    pointerEvents: "box-none",
  },
  tabBar: {
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 25,
    shadowColor: "#1E272E",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    zIndex: 2,
  },
  fluidSlider: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1E272E",
    left: (TAB_WIDTH - 52) / 2,
    zIndex: 1,
    shadowColor: "#1E272E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});
