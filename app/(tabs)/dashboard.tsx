import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Award,
  CircleUser,
  HardHat,
  HeartHandshake,
  MessageSquareWarning,
  ScrollText,
  Bot,
  ArrowRight,
  Sparkles
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
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

  // Premium Grid Configuration
  const menuItems = [
    {
      id: "projects",
      label: "Ongoing Projects",
      sub: "Infrastructure",
      icon: HardHat,
      colors: ["#FFFDE7", "#FFF9C4"], // Gradient from light to base pastel
      accent: "#FBC02D", // Darker Yellow
      route: "/(tabs)/events", 
    },
    {
      id: "report",
      label: "Report Issue",
      sub: "Fix problems",
      icon: MessageSquareWarning,
      colors: ["#E0F2F1", "#B2DFDB"],
      accent: "#00897B", // Teal
      route: "/(tabs)/impact",
    },
    {
      id: "policies",
      label: "Policies",
      sub: "The Agenda",
      icon: ScrollText,
      colors: ["#E3F2FD", "#BBDEFB"],
      accent: "#1E88E5", // Blue
      route: "/(tabs)/learning",
    },
    {
      id: "achievements",
      label: "Achievements",
      sub: "Track record",
      icon: Award,
      colors: ["#F3E5F5", "#E1BEE7"],
      accent: "#8E24AA", // Purple
      route: "/(tabs)/dashboard", 
    },
    {
      id: "support",
      label: "Support",
      sub: "Join us",
      icon: HeartHandshake,
      colors: ["#FFEBEE", "#FFCDD2"],
      accent: "#E53935", // Red
      route: "/(tabs)/dashboard", 
    },
    {
      id: "appointment",
      label: "Appointments",
      sub: "Book/Apply",
      icon: CircleUser,
      colors: ["#FAFAFA", "#EEEEEE"],
      accent: "#546E7A", // Blue Grey
      route: "/(tabs)/dashboard", 
    },
  ];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 24, paddingBottom: Math.max(insets.bottom, 84) },
        ]}
        showsVerticalScrollIndicator={false}
        testID="dashboard-scroll"
      >
        {/* --------------------------- HERO CARD --------------------------- */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={Colors.gradients.hero as [string, string, string]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Dark Scrim for text readability */}
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
              style={StyleSheet.absoluteFill}
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
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>ID</Text>
                  <Text style={styles.metaValue}>{profile?.membershipId ?? "—"}</Text>
                </View>
                
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Status</Text>
                  <Text style={[styles.metaValue, duesStatus === "paid" ? styles.success : styles.warning]}>
                    {duesStatus.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.pointsContainer}>
                  <Text style={styles.pointsValue}>{profile?.points ?? 0}</Text>
                  <Text style={styles.pointsLabel}>Points</Text>
                </View>
              </View>

              <QrBadge seed={todayQrSeed ?? ""} />
            </View>
          </LinearGradient>
        </View>

        {/* --------------------------- AI BANNER --------------------------- */}
        <TouchableOpacity
          style={styles.aiBanner}
          onPress={() => router.push("/assistant" as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#2F3136", "#1C1D24"]} // Dark sleek look
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.aiBannerGradient}
          >
            <View style={styles.aiIconCircle}>
              <Sparkles color="#FFD700" size={20} fill="#FFD700" />
            </View>
            <View style={styles.aiTextContent}>
              <Text style={styles.aiTitle}>Ask TEIN Assistant</Text>
              <Text style={styles.aiSub}>Instant policy answers & guides</Text>
            </View>
            <ArrowRight color="#FFFFFF" size={20} style={{ opacity: 0.5 }} />
          </LinearGradient>
        </TouchableOpacity>

        {/* --------------------------- MAIN GRID --------------------------- */}
        <View style={styles.gridContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridCardWrapper}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={item.colors as [string, string]}
                style={styles.gridCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.7)' }]}>
                  <item.icon color={item.accent} size={28} strokeWidth={2.5} />
                </View>
                
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <Text style={styles.cardSub}>{item.sub}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

/* --------------------------------- Styles -------------------------------- */

const { width } = Dimensions.get("window");
const GRID_GAP = 12;
const CARD_WIDTH = (width - 32 - GRID_GAP) / 2; // 32 is horizontal padding

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  container: { flex: 1 },
  content: {
    padding: 16,
    paddingBottom: 64,
    gap: 20,
  },

  /* HERO CARD - Apple Wallet Style */
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGradient: {
    padding: 24,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 2,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroSub: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  roleChipText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  heroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 20,
    zIndex: 2,
  },
  heroMetaCol: {
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
    width: 45,
  },
  metaValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  success: { color: "#4ADE80" },
  warning: { color: "#FBBF24" },
  
  pointsContainer: {
    marginTop: 8,
  },
  pointsValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 36,
  },
  pointsLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "600",
  },

  /* QR CODE */
  qrWrapper: {
    width: 100,
    height: 100,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  qrPixel: {
    width: 13.6, // Adjusted for size
    height: 13.6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  qrPixelActive: {
    backgroundColor: "#FFFFFF",
  },

  /* AI BANNER */
  aiBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.palette.jade,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  aiBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  aiIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  aiTextContent: {
    flex: 1,
  },
  aiTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  aiSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },

  /* GRID MENU */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: GRID_GAP,
  },
  gridCardWrapper: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.85, // Slightly rectangular
    borderRadius: 24,
    // Soft shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  gridCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)", // Glass border effect
  },
  iconContainer: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  textContainer: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A1A", // Sharp black for contrast
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666666",
    opacity: 0.9,
  },
});