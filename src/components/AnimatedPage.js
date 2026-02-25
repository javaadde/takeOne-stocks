import React, { useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { usePathname } from "expo-router";

const { width } = Dimensions.get("window");

const TAB_ORDER = ["/", "/stocks", "/add", "/history", "/settings"];

export default function AnimatedPage({ children }) {
  const pathname = usePathname();
  const prevIndex = useRef(TAB_ORDER.indexOf(pathname));
  const currentIndex = TAB_ORDER.indexOf(pathname);

  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    const isMovingRight = currentIndex > prevIndex.current;

    // Fluid Reset
    offset.value = isMovingRight ? 30 : -30;
    opacity.value = 0.4;
    scale.value = 0.96;

    // Smooth entry
    offset.value = withSpring(0, { damping: 20, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, { damping: 18, stiffness: 100 });

    prevIndex.current = currentIndex;
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: opacity.value,
      transform: [{ translateX: offset.value }, { scale: scale.value }],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
