import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Route missing" }} />
      <View style={styles.container}>
        <Text style={styles.eyebrow}>TEIN UCC</Text>
        <Text style={styles.title}>We couldn&apos;t find that screen</Text>
        <Text style={styles.subtitle}>Maybe the route moved during the reorganization. Jump back home and continue organizing.</Text>
        <Link href="/(tabs)/dashboard" style={styles.link}>
          <Text style={styles.linkText}>Return to dashboard</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  eyebrow: {
    color: Colors.palette.ocean,
    letterSpacing: 1,
  },
  title: {
    color: Colors.ui.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: Colors.ui.textSecondary,
    textAlign: "center",
    maxWidth: 320,
  },
  link: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: Colors.palette.crimson,
  },
  linkText: {
    color: Colors.ui.background,
    fontWeight: "700",
  },
});
