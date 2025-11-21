import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { WebWrapper } from "@/components/WebWrapper";
import { AppStateProvider } from "@/contexts/app-state";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="assistant" options={{ presentation: "modal", title: "TEIN Assistant" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WebWrapper>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppStateProvider>
            <RootLayoutNav />
          </AppStateProvider>
        </GestureHandlerRootView>
      </WebWrapper>
    </QueryClientProvider>
  );
}
