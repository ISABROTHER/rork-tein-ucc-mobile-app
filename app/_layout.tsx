import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";

import { AppStateProvider } from "@/contexts/app-state";

// Prevent splash from auto-hiding too early.
// Wrap in catch to avoid unhandled promise warnings in dev.
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="assistant"
        options={{ presentation: "modal", title: "TEIN Assistant" }}
      />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  // React Query client with safe defaults (no breaking change)
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 30, // 30s
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  // Mark ready on mount (later you can add font/asset loading here)
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Hide splash only after layout paints once and app is "ready"
  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // no-op; splash might already be hidden
      }
    }
  }, [isReady]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppStateProvider>
          {/* Root view that triggers splash hide once layout completes */}
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <RootLayoutNav />
          </View>
        </AppStateProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
