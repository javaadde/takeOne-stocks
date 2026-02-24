import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  Vibration,
} from "react-native";
import {
  X,
  Camera as CameraIcon,
  Scan,
  User,
  Smartphone,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  PartyPopper,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { CameraView, Camera } from "expo-camera";
import { Shadows } from "../theme/colors";
import { inventoryAPI } from "../services/api";

export default function SellVerifyScreen() {
  const router = useRouter();
  const { id, price, type } = useLocalSearchParams();

  const [selling, setSelling] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhoto, setCustomerPhoto] = useState(null);
  const [imei, setImei] = useState("");
  const [scannerActive, setScannerActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const successAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const triggerSuccess = () => {
    setShowSuccess(true);
    Animated.spring(successAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const finalizeSale = async () => {
    if (!customerName || !customerPhoto || !imei) {
      Alert.alert(
        "Missing Information",
        "Please complete all 3 validation steps.",
      );
      return;
    }

    setSelling(true);
    try {
      const saleData = {
        salePrice: Number(price),
        saleType: type,
        customerName: customerName,
        imei: imei,
      };

      await inventoryAPI.sell(id, saleData, customerPhoto);
      triggerSuccess();
    } catch (error) {
      Alert.alert("Sale Failed", error.message);
    } finally {
      setSelling(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0F172A", "#1E293B"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Confirm Sale</Text>
          <Text style={styles.headerSubtitle}>
            Validation required for ₹{price} ({type})
          </Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Customer Name */}
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconWrap}>
                <User color="#1A1A1A" size={20} />
              </View>
              <Text style={styles.stepTitle}>Customer Name</Text>
              {customerName.length > 2 ? (
                <CheckCircle2 color="#10B981" size={20} />
              ) : null}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter customer's full name"
              value={customerName}
              onChangeText={setCustomerName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Step 2: IMEI Scanning */}
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconWrap}>
                <Smartphone color="#1A1A1A" size={20} />
              </View>
              <Text style={styles.stepTitle}>IMEI Code</Text>
              {imei.length >= 10 ? (
                <CheckCircle2 color="#10B981" size={20} />
              ) : null}
            </View>
            <View style={styles.imeiRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Scan or enter IMEI"
                value={imei}
                onChangeText={setImei}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={styles.scanBtn}
                onPress={() => setScannerActive(true)}
              >
                <Scan color="#FFF" size={22} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Step 3: Customer Photo */}
          <View style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepIconWrap}>
                <CameraIcon color="#1A1A1A" size={20} />
              </View>
              <Text style={styles.stepTitle}>Customer Photo</Text>
              {customerPhoto ? (
                <CheckCircle2 color="#10B981" size={20} />
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.photoBox}
              onPress={() => setCameraActive(true)}
              activeOpacity={0.7}
            >
              {customerPhoto ? (
                <Image source={{ uri: customerPhoto }} style={styles.preview} />
              ) : (
                <View style={styles.placeholder}>
                  <CameraIcon color="#9CA3AF" size={40} strokeWidth={1} />
                  <Text style={styles.placeholderText}>
                    Tap to take customer photo
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.finalizeBtn,
            (!customerName || !imei || !customerPhoto) && styles.disabledBtn,
          ]}
          onPress={finalizeSale}
          disabled={selling || !customerName || !imei || !customerPhoto}
        >
          <LinearGradient
            colors={["#1A1A1A", "#333"]}
            style={styles.finalizeGrad}
          >
            {selling ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.finalizeText}>Complete Selling Process</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* IMEI Scanner Overlay */}
      {scannerActive && (
        <View style={styles.cameraOverlay}>
          <CameraView
            barcodeScannerSettings={{
              barcodeTypes: [
                "code128",
                "code39",
                "ean13",
                "ean8",
                "qr",
                "pdf417",
                "itf14",
                "upc_e",
                "upc_a",
              ],
            }}
            onBarcodeScanned={({ data }) => {
              const cleanData = data.replace(/\D/g, "");
              if (cleanData.length > 0) {
                Vibration.vibrate(50);
                setImei(cleanData);
                setScannerActive(false);
              }
            }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.scannerUI}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scannerText}>
              Point at IMEI barcode (15 digits)
            </Text>
            <Text style={styles.scannerSubText}>
              Ignoring product code barcodes...
            </Text>
            <TouchableOpacity
              style={styles.closeOverlay}
              onPress={() => setScannerActive(false)}
            >
              <X color="#FFF" size={32} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Camera Capture Overlay */}
      {cameraActive && (
        <View style={styles.cameraOverlay}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            ref={cameraRef}
          />
          <View style={styles.cameraUI}>
            <TouchableOpacity
              style={styles.captureBtn}
              onPress={async () => {
                if (cameraRef.current) {
                  const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.5,
                  });
                  setCustomerPhoto(photo.uri);
                  setCameraActive(false);
                }
              }}
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeOverlay}
              onPress={() => setCameraActive(false)}
            >
              <X color="#FFF" size={32} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <View style={styles.successWrapper}>
          <Animated.View
            style={[
              styles.successCard,
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
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.successIconBox}
            >
              <PartyPopper color="#FFF" size={48} strokeWidth={1.5} />
            </LinearGradient>
            <Text style={styles.successTitle}>Successfully Sold!</Text>
            <Text style={styles.successSub}>
              The transaction for {customerName} has been processed
              successfully.
            </Text>

            <View style={styles.successStats}>
              <View style={styles.successStatItem}>
                <Text style={styles.successStatLabel}>Sale Amount</Text>
                <Text style={styles.successStatValue}>₹{price}</Text>
              </View>
              <View style={styles.successStatDivider} />
              <View style={styles.successStatItem}>
                <Text style={styles.successStatLabel}>Type</Text>
                <Text style={styles.successStatValue}>{type}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.successAction}
              onPress={() => router.replace("/(tabs)/stocks")}
            >
              <LinearGradient
                colors={["#1A1A1A", "#333"]}
                style={styles.successBtn}
              >
                <Text style={styles.successBtnText}>
                  Dismiss & Back to Inventory
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 55 : 40,
    paddingBottom: 20,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },
  backBtn: {
    marginBottom: 12,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginTop: 0,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepCard: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 15,
  },
  stepIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F3F4FB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    flex: 1,
  },
  input: {
    backgroundColor: "#F9FAFB",
    height: 60,
    borderRadius: 18,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    borderWidth: 1.5,
    borderColor: "#F3F4F6",
  },
  imeiRow: {
    flexDirection: "row",
    gap: 12,
  },
  scanBtn: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  photoBox: {
    width: "100%",
    height: 240,
    borderRadius: 24,
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  placeholderText: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "700",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingBottom: Platform.OS === "ios" ? 44 : 24,
  },
  finalizeBtn: {
    borderRadius: 22,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  finalizeGrad: {
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
  finalizeText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "900",
  },
  disabledBtn: {
    opacity: 0.4,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 1000,
  },
  scannerUI: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerFrame: {
    width: 280,
    height: 180,
    borderWidth: 3,
    borderColor: "#10B981",
    borderRadius: 24,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  scannerText: {
    color: "#FFF",
    marginTop: 30,
    fontWeight: "800",
    fontSize: 17,
  },
  scannerSubText: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
  },
  cameraUI: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 80,
  },
  captureBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF",
  },
  closeOverlay: {
    position: "absolute",
    top: 60,
    right: 30,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },

  // Success State Styles
  successWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.9)",
    zIndex: 5000,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  successCard: {
    backgroundColor: "#FFF",
    width: "100%",
    borderRadius: 34,
    padding: 32,
    alignItems: "center",
    ...Shadows.card,
  },
  successIconBox: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 12,
  },
  successSub: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
    marginBottom: 30,
  },
  successStats: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
    width: "100%",
  },
  successStatItem: {
    flex: 1,
    alignItems: "center",
  },
  successStatLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  successStatValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },
  successStatDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 15,
  },
  successAction: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
  },
  successBtn: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  successBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
