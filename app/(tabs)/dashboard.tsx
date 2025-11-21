import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowRight, Bot, CreditCard, Sparkles } from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Image,
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
  const { profile, feed, todayQrSeed, payments, opportunities, analytics, media } =
    useAppState();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fullName = `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() || "Member";
  const roleColor = Colors.roles?.[profile?.role] ?? Colors.ui.elevated;
  const duesStatus = profile?.duesStatus ?? "unpaid";

  const firstPayment = payments?.[0];
  const announcements = feed ?? [];
  const opps = opportunities ?? [];
  const mediaItems = media ?? [];

  const attendanceTotal = analytics?.attendance?.total ?? 0;
  const attendanceReturning = analytics?.attendance?.returning ?? 0;
  const attendanceNew = analytics?.attendance?.newcomers ?? 0;
  const taskCompletion = analytics?.taskCompletion ?? 0;

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
        {/* -------------------------------- HERO -------------------------------- */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={Colors.gradients.hero as [string, string, string]}
            style={styles.heroGradient}
          >
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

                <Text style={[styles.metaLabel, { marginTop: 6 }]}>Dues Status</Text>
                <Text
                  style={[
                    styles.metaValue,
                    duesStatus === "paid" ? styles.success : styles.warning,
                  ]}
                  numberOfLines={1}
                >
                  {duesStatus.toUpperCase()}
                </Text>

                <Text style={[styles.metaLabel, { marginTop: 6 }]}>Points</Text>
                <Text style={styles.pointsValue} numberOfLines={1}>
                  {profile?.points ?? 0}
                </Text>
              </View>

              <QrBadge seed={todayQrSeed ?? ""} />
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.footerCol}>
                <Text style={styles.footerLabel}>Volunteer Hours</Text>
                <Text style={styles.footerValue} numberOfLines={1}>
                  {profile?.volunteerHours ?? 0}h
                </Text>
              </View>
              <View style={styles.footerCol}>
                <Text style={styles.footerLabel}>Badges</Text>
                <Text style={styles.footerValue} numberOfLines={1}>
                  {(profile?.badges ?? []).join(" · ") || "None yet"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ------------------------------ QUICK ACTIONS ------------------------------ */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickCard}
            testID="assistant-entry"
            onPress={() => router.push("/assistant" as any)}
            accessibilityRole="button"
            accessibilityLabel="Open TEIN Assistant"
          >
            <View style={styles.quickIconWrap}>
              <Bot color={Colors.palette.crimson} />
            </View>

            <View style={styles.quickTextWrap}>
              <Text style={styles.quickTitle}>Ask TEIN AI</Text>
              <Text style={styles.quickSubtitle}>Policy explainers in 30s</Text>
            </View>

            <View style={styles.roundButton}>
              <ArrowRight color={Colors.ui.textPrimary} size={18} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            accessibilityRole="button"
            accessibilityLabel="Pay dues"
            testID="pay-dues-entry"
          >
            <View style={styles.quickIconWrap}>
              <CreditCard color={Colors.palette.crimson} />
            </View>

            <View style={styles.quickTextWrap}>
              <Text style={styles.quickTitle}>Pay Dues</Text>
              <Text style={styles.quickSubtitle}>
                {firstPayment?.amount ?? "—"} settled
              </Text>
            </View>

            <View style={styles.roundButton}>
              <Sparkles color={Colors.ui.textPrimary} size={18} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ------------------------------ ANNOUNCEMENTS ------------------------------ */}
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Announcements</Text>
            <Text style={styles.panelTag}>Personalized</Text>
          </View>

          {announcements.length === 0 ? (
            <EmptyBlock text="No announcements yet. Check back soon." />
          ) : (
            announcements.map((item) => (
              <View key={item.id} style={styles.feedCard} testID={`feed-${item.id}`}>
                <View style={styles.feedHeader}>
                  <Text style={styles.feedCategory} numberOfLines={1}>
                    {(item.category ?? "").toUpperCase()}
                  </Text>
                  <Text style={styles.feedTime} numberOfLines={1}>
                    {item.timestamp}
                  </Text>
                </View>

                <Text style={styles.feedTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.feedSummary} numberOfLines={3}>
                  {item.summary}
                </Text>

                <View style={styles.feedTagsRow}>
                  {(item.facultyTags ?? []).map((tag) => (
                    <View key={`${item.id}-${tag}`} style={styles.feedTag}>
                      <Text style={styles.feedTagText} numberOfLines={1}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>

        {/* ------------------------------ OPPORTUNITIES ------------------------------ */}
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Opportunities Engine</Text>
            <Text style={styles.panelTag}>Updated realtime</Text>
          </View>

          {opps.length === 0 ? (
            <EmptyBlock text="No opportunities available right now." />
          ) : (
            <ScrollView
              horizontal
              pagingEnabled
              snapToAlignment="start"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              style={styles.opportunityScroll}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            >
              {opps.map((opp) => (
                <View key={opp.id} style={styles.opportunityCard}>
                  <Text style={styles.opportunityType} numberOfLines={1}>
                    {(opp.type ?? "").toUpperCase()}
                  </Text>
                  <Text style={styles.opportunityTitle} numberOfLines={2}>
                    {opp.title}
                  </Text>
                  <Text style={styles.opportunityOrg} numberOfLines={1}>
                    {opp.organization}
                  </Text>

                  <View style={styles.opportunityHighlights}>
                    {(opp.highlights ?? []).slice(0, 3).map((highlight) => (
                      <Text key={`${opp.id}-${highlight}`} style={styles.opportunityHighlight}>
                        • {highlight}
                      </Text>
                    ))}
                  </View>

                  <Text style={styles.opportunityDeadline} numberOfLines={1}>
                    Deadline: {opp.deadline}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* ------------------------------ ANALYTICS ------------------------------ */}
        <View style={styles.analyticsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Attendance</Text>
            <Text style={styles.statValue}>{attendanceTotal}</Text>
            <Text style={styles.statSub} numberOfLines={1}>
              Returning {attendanceReturning} · New {attendanceNew}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Task Completion</Text>
            <Text style={styles.statValue}>{taskCompletion}%</Text>
            <Text style={styles.statSub} numberOfLines={1}>
              Volunteer hub
            </Text>
          </View>
        </View>

        {/* ------------------------------ MEDIA HUB ------------------------------ */}
        <View style={styles.mediaPanel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Media Hub</Text>
            <Text style={styles.panelTag}>Shareable</Text>
          </View>

          {mediaItems.length === 0 ? (
            <EmptyBlock text="Media uploads will appear here." />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 2 }}
            >
              {mediaItems.map((item) => (
                <View key={item.id} style={styles.mediaCard}>
                  <Image source={{ uri: item.thumbnail }} style={styles.mediaImage} />
                  <View style={styles.mediaBody}>
                    <Text style={styles.mediaTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.mediaMeta} numberOfLines={2}>
                      {item.type} · {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ----------------------------- Small UI Helper ---------------------------- */

function EmptyBlock({ text }: { text: string }) {
  return (
    <View style={styles.emptyBlock}>
      <Text style={styles.emptyBlockText}>{text}</Text>
    </View>
  );
}

/* --------------------------------- Styles -------------------------------- */

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
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLabel: {
    color: Colors.palette.ocean,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: Colors.palette.ivory,
    fontSize: 26,
    fontWeight: "800",
    marginTop: 4,
  },
  heroSub: {
    color: Colors.palette.ivory,
    fontSize: 14,
    opacity: 0.85,
  },
  roleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  roleChipText: {
    color: Colors.palette.ivory,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.6,
  },

  heroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    alignItems: "center",
    gap: 16,
  },
  heroMetaCol: {
    flex: 1,
    gap: 6,
  },
  metaLabel: {
    color: Colors.palette.ivory,
    opacity: 0.7,
    fontSize: 12,
  },
  metaValue: {
    color: Colors.palette.ivory,
    fontSize: 15,
    fontWeight: "700",
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
    fontWeight: "900",
    marginTop: -2,
  },

  qrWrapper: {
    width: 118,
    height: 118,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.10)",
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
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
    marginTop: 16,
  },
  footerCol: {
    flex: 1,
    paddingRight: 8,
  },
  footerLabel: {
    color: Colors.palette.ivory,
    opacity: 0.7,
    fontSize: 12,
  },
  footerValue: {
    color: Colors.palette.ivory,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },

  /* QUICK ACTIONS */
  quickRow: {
    flexDirection: "row",
    gap: 12,
  },
  quickCard: {
    flex: 1,
    backgroundColor: Colors.ui.surface,
    padding: 14,
    borderRadius: 20,
    borderColor: Colors.ui.border,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quickIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.ui.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  quickTextWrap: {
    flex: 1,
  },
  quickTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "800",
    fontSize: 15,
  },
  quickSubtitle: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  roundButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.ui.elevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },

  /* PANELS */
  panel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 14,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  panelTag: {
    color: Colors.palette.ocean,
    fontWeight: "700",
    fontSize: 12,
  },

  /* FEED */
  feedCard: {
    borderWidth: 1,
    borderColor: Colors.ui.border,
    borderRadius: 18,
    padding: 14,
    gap: 8,
    backgroundColor: Colors.ui.elevated,
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feedCategory: {
    color: Colors.ui.textSecondary,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "800",
  },
  feedTime: {
    color: Colors.ui.textSecondary,
    fontSize: 11,
  },
  feedTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  feedSummary: {
    color: Colors.ui.textSecondary,
    fontSize: 14,
    lineHeight: 19,
  },
  feedTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  feedTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.ui.border,
  },
  feedTagText: {
    color: Colors.ui.textPrimary,
    fontSize: 11,
    fontWeight: "700",
  },

  /* OPPORTUNITIES */
  opportunityScroll: {
    marginHorizontal: -8,
  },
  opportunityCard: {
    width: Platform.OS === "web" ? 400 : 290,
    marginHorizontal: 8,
    borderRadius: 22,
    padding: 18,
    backgroundColor: Colors.ui.elevated,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 8,
  },
  opportunityType: {
    color: Colors.palette.ocean,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.6,
  },
  opportunityTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  opportunityOrg: {
    color: Colors.ui.textSecondary,
    fontSize: 13,
  },
  opportunityHighlights: {
    gap: 4,
    marginTop: 6,
  },
  opportunityHighlight: {
    color: Colors.ui.textSecondary,
    fontSize: 13,
  },
  opportunityDeadline: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
    marginTop: 4,
  },

  /* ANALYTICS */
  analyticsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.ui.surface,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 6,
  },
  statLabel: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  statValue: {
    color: Colors.ui.textPrimary,
    fontSize: 28,
    fontWeight: "900",
  },
  statSub: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },

  /* MEDIA */
  mediaPanel: {
    backgroundColor: Colors.ui.surface,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 14,
  },
  mediaCard: {
    width: 190,
    marginRight: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    overflow: "hidden",
    backgroundColor: Colors.ui.elevated,
  },
  mediaImage: {
    width: "100%",
    height: 112,
  },
  mediaBody: {
    padding: 12,
    gap: 4,
  },
  mediaTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 14,
    fontWeight: "800",
  },
  mediaMeta: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },

  /* EMPTY */
  emptyBlock: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    backgroundColor: Colors.ui.elevated,
    padding: 14,
    alignItems: "center",
  },
  emptyBlockText: {
    color: Colors.ui.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
});
