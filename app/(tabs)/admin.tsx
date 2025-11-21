import { BarChart3, BellRing, CalendarPlus, FileText, ShieldCheck, Sparkles, Users } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAppState } from "@/contexts/app-state";

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { analytics, feed, events, issues, tasks, payments } = useAppState();

  // Local state only for inputs (safe, does not alter existing app state)
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");

  // Safe derived values (won't break if fields are missing)
  const attendanceTotal = analytics?.attendance?.total ?? 0;
  const attendanceNewcomers = analytics?.attendance?.newcomers ?? 0;

  const recentFeed = useMemo(() => feed.slice(0, 2), [feed]);
  const recentIssues = useMemo(() => issues.slice(0, 3), [issues]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 24, paddingBottom: Math.max(insets.bottom, 72) },
        ]}
        showsVerticalScrollIndicator={false}
        testID="admin-scroll"
      >
        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Members verified</Text>
            {/* Keep your number stable, but allow analytics override if you add it later */}
            <Text style={styles.summaryValue}>
              {analytics?.members?.verifiedTotal ?? "3,812"}
            </Text>
            <Text style={styles.summaryMeta}>
              {analytics?.members?.verifiedDeltaMonth != null
                ? `+${analytics.members.verifiedDeltaMonth} this month`
                : "+126 this month"}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Attendance</Text>
            <Text style={styles.summaryValue}>{attendanceTotal}</Text>
            <Text style={styles.summaryMeta}>New {attendanceNewcomers}</Text>
          </View>
        </View>

        {/* Announcements Manager */}
        <View style={styles.panel}>
          <SectionHeader title="Announcements manager" icon={<BellRing color={Colors.palette.ivory} />} />

          <TextInput
            style={styles.input}
            placeholder="Headline"
            placeholderTextColor={Colors.ui.textSecondary}
            value={headline}
            onChangeText={setHeadline}
            testID="admin-announcement-title"
          />
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Drop loyal, confident copy and attach campus specific CTA"
            placeholderTextColor={Colors.ui.textSecondary}
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={3}
            testID="admin-announcement-body"
          />

          <PrimaryButton
            label="Schedule push @ 6AM"
            testID="schedule-announcement"
            disabled={!headline.trim() || !body.trim()}
          />

          <View style={styles.listDivider} />

          {recentFeed.length === 0 ? (
            <EmptyRow text="No announcements yet. Create the first one above." />
          ) : (
            recentFeed.map((item) => (
              <View key={item.id} style={styles.announcementRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.announcementTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.announcementMeta} numberOfLines={1}>
                    {item.category} · {item.timestamp}
                  </Text>
                </View>
                <Text style={styles.statusBadge}>Scheduled</Text>
              </View>
            ))
          )}
        </View>

        {/* Events Intelligence */}
        <View style={styles.panel}>
          <SectionHeader title="Events intelligence" icon={<CalendarPlus color={Colors.palette.ivory} />} />

          {events.length === 0 ? (
            <EmptyRow text="No events created yet." />
          ) : (
            events.map((event) => (
              <View key={event.id} style={styles.eventRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.eventTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={styles.eventMeta} numberOfLines={2}>
                    {event.date} · {event.time} · {event.venue}
                  </Text>
                </View>
                <SecondaryButton
                  label="Analytics"
                  testID={`event-${event.id}-analyze`}
                />
              </View>
            ))
          )}

          <PrimaryButton label="Create new event" testID="create-event" />
        </View>

        {/* Content Automation */}
        <View style={styles.panel}>
          <SectionHeader title="Content automation" icon={<Sparkles color={Colors.palette.amber} />} />

          <AutomationRow title="Weekly posting reminders" meta="Mondays · 06:00" />
          <AutomationRow title="Auto-rotate TEIN 101 modules" meta="Next drop · Sunday" />
          <AutomationRow title="Nudge inactive members" meta="274 pending" />
        </View>

        {/* Issues Queue */}
        <View style={styles.panel}>
          <SectionHeader title="Issues queue" icon={<ShieldCheck color={Colors.palette.jade} />} />

          {recentIssues.length === 0 ? (
            <EmptyRow text="No reported issues right now." />
          ) : (
            recentIssues.map((issue) => (
              <View key={issue.id} style={styles.issueRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.issueTitle} numberOfLines={1}>
                    {issue.title}
                  </Text>
                  <Text style={styles.issueMeta} numberOfLines={1}>
                    {issue.category} · {issue.status}
                  </Text>
                </View>
                <SecondaryButton label="Assign" testID={`assign-${issue.id}`} />
              </View>
            ))
          )}
        </View>

        {/* Tasks Control */}
        <View style={styles.panel}>
          <SectionHeader title="Tasks control" icon={<BarChart3 color={Colors.palette.ivory} />} />

          {tasks.length === 0 ? (
            <EmptyRow text="No tasks created yet." />
          ) : (
            tasks.map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskMeta} numberOfLines={1}>
                    {task.group} · due {task.dueDate}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.taskStatus,
                    task.completed && styles.taskStatusDone,
                  ]}
                >
                  {task.completed ? "Complete" : "Pending"}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Finance Dashboard */}
        <View style={styles.panel}>
          <SectionHeader title="Finance dashboard" icon={<FileText color={Colors.palette.ivory} />} />

          {payments.length === 0 ? (
            <EmptyRow text="No payments recorded yet." />
          ) : (
            payments.map((payment) => (
              <View key={payment.id} style={styles.paymentRow}>
                <Text style={styles.paymentTitle} numberOfLines={1}>
                  {payment.label}
                </Text>
                <Text style={styles.paymentAmount}>
                  {payment.amount}
                </Text>
              </View>
            ))
          )}

          <SecondaryButton label="Export CSV for SEC" testID="export-finance" />
        </View>

        {/* User Management */}
        <View style={styles.panel}>
          <SectionHeader title="User management" icon={<Users color={Colors.palette.ivory} />} />

          <View style={styles.userGrid}>
            <UserTile value={String(analytics?.users?.pendingVerification ?? 24)} label="Pending verification" />
            <UserTile value={String(analytics?.users?.admins ?? 6)} label="Admins" />
            <UserTile value={String(analytics?.users?.volunteers ?? 52)} label="Volunteers" />
          </View>

          <PrimaryButton label="Sync cloud backup" testID="sync-backup" />
        </View>
      </ScrollView>
    </View>
  );
}

/* ----------------------------- Small UI Helpers ---------------------------- */

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {icon}
    </View>
  );
}

function PrimaryButton({
  label,
  testID,
  disabled,
}: {
  label: string;
  testID?: string;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      disabled={disabled}
    >
      <Text style={[styles.primaryButtonText, disabled && styles.primaryButtonTextDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({
  label,
  testID,
}: {
  label: string;
  testID?: string;
}) {
  return (
    <TouchableOpacity
      style={styles.secondaryButton}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function AutomationRow({ title, meta }: { title: string; meta: string }) {
  return (
    <View style={styles.automationRow}>
      <Text style={styles.automationTitle}>{title}</Text>
      <Text style={styles.automationMeta}>{meta}</Text>
    </View>
  );
}

function UserTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.userTile}>
      <Text style={styles.userTileValue}>{value}</Text>
      <Text style={styles.userTileLabel}>{label}</Text>
    </View>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <View style={styles.emptyRow}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

/* --------------------------------- Styles --------------------------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 24,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.ui.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 16,
    gap: 4,
  },
  summaryLabel: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  summaryValue: {
    color: Colors.ui.textPrimary,
    fontSize: 28,
    fontWeight: "700",
  },
  summaryMeta: {
    color: Colors.ui.textSecondary,
  },
  panel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 20,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 14,
    backgroundColor: Colors.ui.elevated,
    color: Colors.ui.textPrimary,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: Colors.palette.jade,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: Colors.ui.background,
    fontWeight: "700",
  },
  primaryButtonTextDisabled: {
    color: Colors.ui.background,
    fontWeight: "700",
  },
  listDivider: {
    height: 1,
    backgroundColor: Colors.ui.border,
    marginVertical: 12,
  },
  announcementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  announcementTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  announcementMeta: {
    color: Colors.ui.textSecondary,
  },
  statusBadge: {
    color: Colors.palette.ocean,
    fontWeight: "700",
  },
  eventRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.ui.elevated,
  },
  eventTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  eventMeta: {
    color: Colors.ui.textSecondary,
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.palette.ocean,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: Colors.palette.ocean,
    fontWeight: "600",
  },
  automationRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 14,
    backgroundColor: Colors.ui.elevated,
  },
  automationTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  automationMeta: {
    color: Colors.ui.textSecondary,
    marginTop: 2,
  },
  issueRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.ui.elevated,
  },
  issueTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  issueMeta: {
    color: Colors.ui.textSecondary,
  },
  taskRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 14,
    backgroundColor: Colors.ui.elevated,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  taskMeta: {
    color: Colors.ui.textSecondary,
  },
  taskStatus: {
    color: Colors.ui.textSecondary,
    fontWeight: "700",
  },
  taskStatusDone: {
    color: Colors.palette.jade,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  paymentTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "600",
    flex: 1,
    paddingRight: 12,
  },
  paymentAmount: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  userGrid: {
    flexDirection: "row",
    gap: 12,
  },
  userTile: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 12,
    backgroundColor: Colors.ui.elevated,
  },
  userTileValue: {
    color: Colors.ui.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
  userTileLabel: {
    color: Colors.ui.textSecondary,
  },
  emptyRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 14,
    backgroundColor: Colors.ui.elevated,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.ui.textSecondary,
    fontSize: 13,
  },
});
