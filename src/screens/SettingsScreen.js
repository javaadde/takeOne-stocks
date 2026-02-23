import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Colors, Shadows } from "../theme/colors";

function SettingItem({ icon, label, sub, rightLabel }) {
  return (
    <TouchableOpacity style={styles.item}>
      <View style={styles.itemIconBox}>
        <Text style={styles.itemEmoji}>{icon}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemLabel}>{label}</Text>
        {sub && <Text style={styles.itemSub}>{sub}</Text>}
      </View>
      {rightLabel && <Text style={styles.rightLabel}>{rightLabel}</Text>}
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.profileBox}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.role}>Administrator</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          <View style={styles.card}>
            <SettingItem icon="🌓" label="Appearance" rightLabel="Light Mode" />
            <SettingItem icon="🔔" label="Notifications" sub="Push & Email" />
            <SettingItem icon="🔒" label="Privacy & Security" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.card}>
            <SettingItem icon="💰" label="Currency" rightLabel="USD ($)" />
            <SettingItem
              icon="☁️"
              label="Cloud Backup"
              sub="Last synced: 2h ago"
            />
            <SettingItem icon="👥" label="Staff Permissions" />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

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
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  role: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  editBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  itemEmoji: { fontSize: 18 },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  itemSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  rightLabel: {
    fontSize: 13,
    color: "#666",
    marginRight: 10,
    fontWeight: "500",
  },
  arrow: {
    fontSize: 20,
    color: "#CCC",
  },
  logoutBtn: {
    marginTop: 10,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF4D4C",
  },
});
