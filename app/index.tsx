import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppState } from "@/contexts/app-state";

export default function RootIndex() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAppState();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Redirect href="/(tabs)/dashboard" />
    </View>
  );
}
