import { Tabs } from "expo-router";
import { Activity, BookOpen, CalendarDays, LayoutDashboard, Shield } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.palette.crimson,
        tabBarInactiveTintColor: Colors.ui.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.ui.background,
          borderTopColor: Colors.ui.border,
          borderTopWidth: 0.5,
          elevation: 0,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 11,
        },
        headerStyle: {
          backgroundColor: Colors.ui.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.ui.border,
        },
        headerTitleStyle: {
          color: Colors.ui.textPrimary,
          fontWeight: "700",
          fontSize: 17,
        },
        headerTitleAlign: "center",
        headerTintColor: Colors.ui.textPrimary,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => <CalendarDays color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: "Learning",
          tabBarIcon: ({ color }) => <BookOpen color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="impact"
        options={{
          title: "Impact",
          tabBarIcon: ({ color }) => <Activity color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Executive",
          tabBarLabel: "Admin",
          tabBarIcon: ({ color }) => <Shield color={color} size={24} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}