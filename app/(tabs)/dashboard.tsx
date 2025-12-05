import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { 
  Award, 
  CircleUser, 
  HardHat, 
  HeartHandshake, 
  MessageSquareWarning, 
  ScrollText 
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAppState } from "@/contexts/app-state";

/* ----------------------------- QR Badge (Safe) ---------------------------- */

function QrBadge({ seed }: { seed: string }) {
  const matrix = useMemo(() => {
    const normalized = (seed ?? "").replace(/[^0-9a-f]/gi, "");
    const safe = normalized.length > 0 ? normalized : "0a1b2c3d4e5f6a7b8c9d";
    const blocks = 25;

    return new Array(blocks).fill(false).map((_, index) => {
      const code = safe.charCodeAt(index % safe.length);
      return code % 2 === 0;
    });
  }, [seed]);

  return (
    <View style={styles.qrWrapper} testID="membership-qr">
      {matrix.map((active, index) => (
        <View key={`${seed}-${index}`} style={[styles.qrPixel, active && styles.qrPixelActive]} />
      ))}
    </View>
  );
}

/* -------------------------------- Screen --------------------------------- */

export default function DashboardScreen() {
  const { profile, todayQrSeed } = useAppState();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fullName =
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() || "Member";
  const roleColor = Colors.roles?.[profile?.role] ?? Colors.ui.elevated;
  const duesStatus = profile?.duesStatus ?? "unpaid";

  // Menu Configuration based on your image
  const menuItems = [
    {
      id: "projects",
      label: "Ongoing Projects",
      sub: "Infrastructure",
      icon: HardHat,
      bg: "#FFF9C4", // Pastel Yellow
      accent: "#F59E0B", // Darker Yellow/Orange
      route: "/(tabs)/events", // Placeholder route
    },
    {
      id: "report",
      label: "Report Issue",
      sub: "Fix problems",
      icon: MessageSquareWarning,
      bg: "#E0F2F1", // Pastel Mint
      accent: "#00897B", // Teal
      route: "/(tabs)/impact",
    },
    {
      id: "policies",
      label: "Policies",
      sub: "The Agenda",
      icon: ScrollText,
      bg: "#E3F2FD", // Pastel Blue
      accent: "#1E88E5", // Blue
      route: "/(tabs)/learning",
    },
    {
      id: "achievements",
      label: "Achievements",
      sub: "Track record",
      icon: Award,
      bg: "#F3E5F5", // Pastel Purple
      accent: "#8E24AA", // Purple
      route: "/(tabs)/dashboard", // Placeholder
    },
    {
      id: "support",
      label: "Support",
      sub: "Join us",
      icon: HeartHandshake,
      bg: "#FFEBEE", // Pastel Pink
      accent: "#E53935", // Red/Pink
      route: "/(tabs)/dashboard", // Placeholder
    },
    {
      id: "appointment",
      label: "Appointment & A...",
      sub: "Book/Apply",
      icon: CircleUser,
      bg: "#F5F5F5", // Light Gray
      accent: "#546E7A", // Blue Grey
      route: "/(tabs)/dashboard", // Placeholder
    },
  ];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 24, paddingBottom: Math.max(insets.bottom, 64) },
        ]}
        showsVerticalScrollIndicator={false}
        testID="dashboard-scroll"
      >
        {/* --------------------------- HERO (APPLE STYLE) --------------------------- */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={Colors.gradients.hero as [string, string, string]}
            style={styles.heroGradient}
          >
            {/* Apple-style dark scrim gradient overlay */}
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.60)",
                "rgba(0,0,0,0.32)",
                "rgba(0,0,0,0.55)",
              ]}
              locations={[0, 0.5, 1]}
              style={styles.heroScrim}
            />

            <View style={styles.heroHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.heroLabel}>TEIN UCC</Text>

                <Text style={styles.heroTitle} numberOfLines={1}>
                  {fullName}
                </Text>

                <Text style={styles.heroSub} numberOfLines={1}>
                  Level {profile?.level ?? "-"} · {profile?.program ?? "Program"}
                </Text>
              </View>

              <View style={[styles.roleChip, { backgroundColor: roleColor }]}>
                <Text style={styles.roleChipText} numberOfLines={1}>
                  {(profile?.role ?? "member").toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.heroBody}>
              <View style={styles.heroMetaCol}>
                <Text style={styles.metaLabel}>Membership ID</Text>
                <Text style={styles.metaValue} numberOfLines={1}>
                  {profile?.membershipId ?? "—"}
                </Text>

                <Text style={[styles.metaLabel, { marginTop: 8 }]}>Dues Status</Text>
                <Text
                  style={[
                    styles.metaValue,
                    duesStatus === "paid" ? styles.success : styles.warning,
                  ]}
                  numberOfLines={1}
                >
                  {duesStatus.toUpperCase()}
                </Text>

                <Text style={[styles.metaLabel, { marginTop: 8 }]}>Points</Text>
                <Text style={styles.pointsValue} numberOfLines={1}>
                  {profile?.points ?? 0}
                </Text>
              </View>

              <QrBadge seed={todayQrSeed ?? ""} />
            </View>
          </LinearGradient>
        </View>

        {/* ------------------------------ GRID MENU ------------------------------ */}
        <View style={styles.gridContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.gridCard, { backgroundColor: item.bg }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <item.icon color={item.accent} size={32} strokeWidth={2} />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: Colors.ui.textPrimary }]}>
                  {item.label}
                </Text>
                <Text style={[styles.cardSub, { color: Colors.ui.textSecondary }]}>
                  {item.sub}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

/* --------------------------------- Styles -------------------------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  container: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 64,
    gap: 24,
  },

  /* HERO */
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  heroGradient: {
    padding: 22,
    borderRadius: 24,
    gap: 8,
    position: "relative",
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
  },

  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  heroLabel: {
    color: Colors.palette.ivory,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
    opacity: 0.95,
  },
  heroTitle: {
    color: Colors.palette.ivory,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  heroSub: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },

  roleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    zIndex: 2,
  },
  roleChipText: {
    color: Colors.palette.ivory,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.7,
  },

  heroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    alignItems: "center",
    gap: 16,
    zIndex: 2,
  },
  heroMetaCol: {
    flex: 1,
    gap: 6,
  },
  metaLabel: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "700",
  },
  metaValue: {
    color: Colors.palette.ivory,
    fontSize: 15,
    fontWeight: "800",
  },
  success: { color: Colors.ui.success },
  warning: { color: Colors.ui.warning },

  pointsValue: {
    color: Colors.palette.ivory,
    fontSize: 34,
    fontWeight: "900",
    marginTop: -2,
  },

  qrWrapper: {
    width: 118,
    height: 118,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.14)",
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
    zIndex: 2,
  },
  qrPixel: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  qrPixelActive: {
    backgroundColor: Colors.palette.ivory,
  },

  /* GRID MENU */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridCard: {
    width: "48%", // Roughly 2 columns
    aspectRatio: 1.1, // Makes them slightly taller squares
    borderRadius: 24,
    padding: 16,
    justifyContent: "space-between",
    // Subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    alignSelf: "flex-start",
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
  },
  textContainer: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },
  cardSub: {
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.7,
  },
});