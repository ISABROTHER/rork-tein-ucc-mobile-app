import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Colors from "@/constants/colors";

export default function ModalScreen() {
  return (
    <Modal animationType="fade" transparent visible onRequestClose={() => router.back()}>
      <Pressable style={styles.overlay} onPress={() => router.back()}>
        <LinearGradient colors={Colors.gradients.card as [string, string]} style={styles.content}>
          <Text style={styles.pill}>TEIN system</Text>
          <Text style={styles.title}>Stay inspired</Text>
          <Text style={styles.subtitle}>
            Save this modal for quick tips on dues collection, AI assistant prompts and volunteer kickoffs.
          </Text>
          <View style={styles.row}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>QR refresh</Text>
              <Text style={styles.statValue}>Daily · 06:00</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Content reminders</Text>
              <Text style={styles.statValue}>Mon / Thu</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.button} testID="modal-close" onPress={() => router.back()}>
            <Text style={styles.buttonText}>Close overlay</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Pressable>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 14,
  },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    color: Colors.palette.ivory,
    letterSpacing: 1,
  },
  title: {
    color: Colors.palette.ivory,
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.palette.ivory,
    opacity: 0.8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  statBlock: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    padding: 12,
  },
  statLabel: {
    color: Colors.palette.ivory,
    opacity: 0.7,
  },
  statValue: {
    color: Colors.palette.ivory,
    fontWeight: "700",
    marginTop: 4,
  },
  button: {
    marginTop: 12,
    backgroundColor: Colors.palette.jade,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.ui.background,
    fontWeight: "700",
  },
});
