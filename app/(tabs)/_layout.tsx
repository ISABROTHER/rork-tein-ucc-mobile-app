import { Tabs } from "expo-router";
import { Activity, BookOpen, CalendarDays, LayoutDashboard, Shield } from "lucide-react-native";
import React from "react";

import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.palette.crimson,
        tabBarInactiveTintColor: Colors.ui.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.ui.surface,
          borderTopColor: Colors.ui.border,
        },
        headerStyle: {
          backgroundColor: Colors.ui.surface,
        },
        headerTitleStyle: {
          color: Colors.ui.textPrimary,
        },
        headerTintColor: Colors.ui.textPrimary,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} />, 
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => <CalendarDays color={color} />, 
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: "Learning",
          tabBarIcon: ({ color }) => <BookOpen color={color} />, 
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="impact"
        options={{
          title: "Impact",
          tabBarIcon: ({ color }) => <Activity color={color} />, 
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Executive",
          tabBarLabel: "Admin",
          tabBarIcon: ({ color }) => <Shield color={color} />, 
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
