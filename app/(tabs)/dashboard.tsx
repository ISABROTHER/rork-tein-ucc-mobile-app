import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowRight, Bot, CreditCard, Sparkles } from "lucide-react-native";
import React, { useMemo } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAppState } from "@/contexts/app-state";

function QrBadge({ seed }: { seed: string }) {
  const matrix = useMemo(() => {
    const normalized = seed.replace(/[^0-9a-f]/gi, "");
    const blocks = 25;
    return new Array(blocks).fill(false).map((_, index) => {
      const code = normalized.charCodeAt(index % normalized.length);
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

export default function DashboardScreen() {
  const { profile, feed, todayQrSeed, payments, opportunities, analytics, media } = useAppState();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}> 
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 24, paddingBottom: Math.max(insets.bottom, 64) },
        ]}
        testID="dashboard-scroll"
      >
        <View style={styles.heroCard}>
            <LinearGradient colors={Colors.gradients.hero as [string, string, string]} style={styles.heroGradient}>
              <View style={styles.heroHeader}>
                <View>
                  <Text style={styles.heroLabel}>TEIN UCC</Text>
                  <Text style={styles.heroTitle}>{`${profile.firstName} ${profile.lastName}`}</Text>
                  <Text style={styles.heroSub}>Level {profile.level} · {profile.program}</Text>
                </View>
                <View style={[styles.roleChip, { backgroundColor: Colors.roles[profile.role] ?? Colors.ui.elevated }]}> 
                  <Text style={styles.roleChipText}>{profile.role.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.heroBody}>
                <View style={styles.heroMetaCol}>
                  <Text style={styles.metaLabel}>Membership ID</Text>
                  <Text style={styles.metaValue}>{profile.membershipId}</Text>
                  <Text style={styles.metaLabel}>Dues Status</Text>
                  <Text style={[styles.metaValue, profile.duesStatus === "paid" ? styles.success : styles.warning]}>{profile.duesStatus.toUpperCase()}</Text>
                  <Text style={styles.metaLabel}>Points</Text>
                  <Text style={styles.pointsValue}>{profile.points}</Text>
                </View>
                <QrBadge seed={todayQrSeed} />
              </View>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.footerLabel}>Volunteer Hours</Text>
                  <Text style={styles.footerValue}>{profile.volunteerHours}h</Text>
                </View>
                <View>
                  <Text style={styles.footerLabel}>Badges</Text>
                  <Text style={styles.footerValue}>{profile.badges.join(" · ")}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard} testID="assistant-entry" onPress={() => router.push("/assistant" as any)}>
              <Bot color={Colors.palette.crimson} />
              <View style={styles.quickTextWrap}>
                <Text style={styles.quickTitle}>Ask TEIN AI</Text>
                <Text style={styles.quickSubtitle}>Policy explainers in 30s</Text>
              </View>
              <View style={styles.roundButton}>
                <ArrowRight color={Colors.ui.textPrimary} size={18} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <CreditCard color={Colors.palette.crimson} />
              <View style={styles.quickTextWrap}>
                <Text style={styles.quickTitle}>Pay Dues</Text>
                <Text style={styles.quickSubtitle}>{payments[0]?.amount} settled</Text>
              </View>
              <View style={styles.roundButton}>
                <Sparkles color={Colors.ui.textPrimary} size={18} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Announcements</Text>
              <Text style={styles.panelTag}>Personalized</Text>
            </View>
            {feed.map((item) => (
              <View key={item.id} style={styles.feedCard} testID={`feed-${item.id}`}>
                <View style={styles.feedHeader}>
                  <Text style={styles.feedCategory}>{item.category.toUpperCase()}</Text>
                  <Text style={styles.feedTime}>{item.timestamp}</Text>
                </View>
                <Text style={styles.feedTitle}>{item.title}</Text>
                <Text style={styles.feedSummary}>{item.summary}</Text>
                <View style={styles.feedTagsRow}>
                  {item.facultyTags.map((tag) => (
                    <View key={`${item.id}-${tag}`} style={styles.feedTag}>
                      <Text style={styles.feedTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Opportunities Engine</Text>
              <Text style={styles.panelTag}>Updated realtime</Text>
            </View>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.opportunityScroll}>
              {opportunities.map((opp) => (
                <View key={opp.id} style={styles.opportunityCard}>
                  <Text style={styles.opportunityType}>{opp.type.toUpperCase()}</Text>
                  <Text style={styles.opportunityTitle}>{opp.title}</Text>
                  <Text style={styles.opportunityOrg}>{opp.organization}</Text>
                  <View style={styles.opportunityHighlights}>
                    {opp.highlights.map((highlight) => (
                      <Text key={`${opp.id}-${highlight}`} style={styles.opportunityHighlight}>
                        • {highlight}
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.opportunityDeadline}>Deadline: {opp.deadline}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.analyticsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Attendance</Text>
              <Text style={styles.statValue}>{analytics.attendance.total}</Text>
              <Text style={styles.statSub}>Returning {analytics.attendance.returning} · New {analytics.attendance.newcomers}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Task Completion</Text>
              <Text style={styles.statValue}>{analytics.taskCompletion}%</Text>
              <Text style={styles.statSub}>Volunteer hub</Text>
            </View>
          </View>

        <View style={styles.mediaPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Media Hub</Text>
            <Text style={styles.panelTag}>Shareable</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {media.map((item) => (
              <View key={item.id} style={styles.mediaCard}>
                <Image source={{ uri: item.thumbnail }} style={styles.mediaImage} />
                <Text style={styles.mediaTitle}>{item.title}</Text>
                <Text style={styles.mediaMeta}>{item.type} · {item.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 64,
    gap: 24,
  },
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
  },
  heroGradient: {
    padding: 24,
    borderRadius: 24,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLabel: {
    color: Colors.palette.ocean,
    fontSize: 15,
    letterSpacing: 1,
  },
  heroTitle: {
    color: Colors.palette.ivory,
    fontSize: 26,
    fontWeight: "700",
    marginTop: 4,
  },
  heroSub: {
    color: Colors.palette.ivory,
    fontSize: 14,
    opacity: 0.8,
  },
  roleChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  roleChipText: {
    color: Colors.palette.ivory,
    fontWeight: "600",
  },
  heroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    alignItems: "center",
    gap: 16,
  },
  heroMetaCol: {
    flex: 1,
    gap: 8,
  },
  metaLabel: {
    color: Colors.palette.ivory,
    opacity: 0.7,
    fontSize: 12,
  },
  metaValue: {
    color: Colors.palette.ivory,
    fontSize: 15,
    fontWeight: "600",
  },
  success: {
    color: Colors.ui.success,
  },
  warning: {
    color: Colors.ui.warning,
  },
  pointsValue: {
    color: Colors.palette.ivory,
    fontSize: 34,
    fontWeight: "700",
  },
  qrWrapper: {
    width: 120,
    height: 120,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 8,
    borderRadius: 16,
  },
  qrPixel: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  qrPixelActive: {
    backgroundColor: Colors.palette.ivory,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  footerLabel: {
    color: Colors.palette.ivory,
    opacity: 0.7,
    fontSize: 12,
  },
  footerValue: {
    color: Colors.palette.ivory,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  quickRow: {
    flexDirection: "row",
    gap: 16,
  },
  quickCard: {
    flex: 1,
    backgroundColor: Colors.ui.surface,
    padding: 16,
    borderRadius: 20,
    borderColor: Colors.ui.border,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quickTextWrap: {
    flex: 1,
  },
  quickTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  quickSubtitle: {
    color: Colors.ui.textSecondary,
    fontSize: 13,
  },
  roundButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  panel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 16,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  panelTag: {
    color: Colors.palette.ocean,
    fontWeight: "600",
  },
  feedCard: {
    borderWidth: 1,
    borderColor: Colors.ui.border,
    borderRadius: 18,
    padding: 16,
    gap: 8,
    backgroundColor: Colors.ui.elevated,
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feedCategory: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  feedTime: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  feedTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  feedSummary: {
    color: Colors.ui.textSecondary,
    fontSize: 14,
  },
  feedTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  feedTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.ui.border,
  },
  feedTagText: {
    color: Colors.ui.textPrimary,
    fontSize: 12,
  },
  opportunityScroll: {
    marginHorizontal: -8,
  },
  opportunityCard: {
    width: Platform.OS === "web" ? 400 : 280,
    marginHorizontal: 8,
    borderRadius: 24,
    padding: 20,
    backgroundColor: Colors.ui.elevated,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 8,
  },
  opportunityType: {
    color: Colors.palette.ocean,
    fontWeight: "700",
  },
  opportunityTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  opportunityOrg: {
    color: Colors.ui.textSecondary,
  },
  opportunityHighlights: {
    gap: 4,
    marginTop: 8,
  },
  opportunityHighlight: {
    color: Colors.ui.textSecondary,
  },
  opportunityDeadline: {
    color: Colors.ui.textPrimary,
    fontWeight: "600",
  },
  analyticsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.ui.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 6,
  },
  statLabel: {
    color: Colors.ui.textSecondary,
  },
  statValue: {
    color: Colors.ui.textPrimary,
    fontSize: 28,
    fontWeight: "700",
  },
  statSub: {
    color: Colors.ui.textSecondary,
  },
  mediaPanel: {
    backgroundColor: Colors.ui.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 16,
  },
  mediaCard: {
    width: 180,
    marginRight: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    overflow: "hidden",
    backgroundColor: Colors.ui.elevated,
  },
  mediaImage: {
    width: "100%",
    height: 110,
  },
  mediaTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    padding: 12,
  },
  mediaMeta: {
    color: Colors.ui.textSecondary,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
