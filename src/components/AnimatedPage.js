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

  useEffect(() => {
    const isMovingRight = currentIndex > prevIndex.current;

    // Slide Reset: Position off-screen based on direction
    offset.value = isMovingRight ? width : -width;
    opacity.value = 0.8; // Maintain visibility but slightly dimmed during transition

    // Smooth horizontal slide arrival
    offset.value = withSpring(0, {
      damping: 26,
      stiffness: 150,
      mass: 1,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    });

    opacity.value = withTiming(1, { duration: 300 });

    prevIndex.current = currentIndex;
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: opacity.value,
      transform: [{ translateX: offset.value }],
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}
