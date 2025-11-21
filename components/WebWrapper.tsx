import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import Colors from "@/constants/colors";

export function WebWrapper({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.appContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5", // Light gray background for desktop area
    alignItems: "center",
    justifyContent: "center",
  },
  appContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 480, // Standard mobile width limit
    backgroundColor: Colors.ui.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    // On large screens, maybe a border
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.ui.border,
  },
});
