import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Shadows } from "../theme/colors";

function InputField({ label, placeholder, value, onChangeText, keyboardType }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

export default function AddStockScreen() {
  const [loading, setLoading] = useState(false);
  const successAnim = useRef(new Animated.Value(0)).current;

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(successAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, 1500);
      });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Item</Text>
          <Text style={styles.subtitle}>
            Fill in the details to update inventory
          </Text>
        </View>

        <View style={styles.form}>
          <InputField label="Model Name" placeholder="e.g. iPhone 16 Pro Max" />
          <InputField label="Brand" placeholder="e.g. Apple" />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label="Cost Price"
                placeholder="$0.00"
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <InputField
                label="Selling Price"
                placeholder="$0.00"
                keyboardType="numeric"
              />
            </View>
          </View>

          <InputField label="Quantity" placeholder="1" keyboardType="numeric" />
          <InputField label="Supplier" placeholder="e.g. TechDistro Inc." />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, Shadows.button]}
          onPress={handleSave}
          disabled={loading}
        >
          <LinearGradient colors={["#1A1A1A", "#333"]} style={styles.saveGrad}>
            <Text style={styles.saveBtnText}>
              {loading ? "Saving..." : "Save Item"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Success Animation Overlay */}
      <Animated.View
        style={[
          styles.successOverlay,
          {
            opacity: successAnim,
            transform: [
              {
                scale: successAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.successCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
        <Text style={styles.successText}>Item Saved!</Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scroll: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
    fontWeight: "500",
  },
  form: {
    gap: 15,
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333",
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F3F4F6",
    height: 55,
    borderRadius: 18,
    paddingHorizontal: 20,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  saveBtn: {
    marginTop: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  saveGrad: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  checkIcon: {
    color: "#FFF",
    fontSize: 50,
    fontWeight: "bold",
  },
  successText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
  },
});
