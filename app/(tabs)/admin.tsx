import { BarChart3, BellRing, CalendarPlus, FileText, ShieldCheck, Sparkles, Users } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAppState } from "@/contexts/app-state";

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { analytics, feed, events, issues, tasks, payments } = useAppState();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}> 
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: 24, paddingBottom: Math.max(insets.bottom, 72) }]}
        testID="admin-scroll"
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Members verified</Text>
            <Text style={styles.summaryValue}>3,812</Text>
            <Text style={styles.summaryMeta}>+126 this month</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Attendance</Text>
            <Text style={styles.summaryValue}>{analytics.attendance.total}</Text>
            <Text style={styles.summaryMeta}>New {analytics.attendance.newcomers}</Text>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Announcements manager</Text>
            <BellRing color={Colors.palette.ivory} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Headline"
            placeholderTextColor={Colors.ui.textSecondary}
            testID="admin-announcement-title"
          />
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Drop loyal, confident copy and attach campus specific CTA"
            placeholderTextColor={Colors.ui.textSecondary}
            multiline
            numberOfLines={3}
            testID="admin-announcement-body"
          />
          <TouchableOpacity style={styles.primaryButton} testID="schedule-announcement">
            <Text style={styles.primaryButtonText}>Schedule push @ 6AM</Text>
          </TouchableOpacity>
          <View style={styles.listDivider} />
          {feed.slice(0, 2).map((item) => (
            <View key={item.id} style={styles.announcementRow}>
              <View>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementMeta}>{item.category} · {item.timestamp}</Text>
              </View>
              <Text style={styles.statusBadge}>Scheduled</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Events intelligence</Text>
            <CalendarPlus color={Colors.palette.ivory} />
          </View>
          {events.map((event) => (
            <View key={event.id} style={styles.eventRow}>
              <View>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventMeta}>{event.date} · {event.time} · {event.venue}</Text>
              </View>
              <TouchableOpacity style={styles.secondaryButton} testID={`event-${event.id}-analyze`}>
                <Text style={styles.secondaryButtonText}>Analytics</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.primaryButton} testID="create-event">
            <Text style={styles.primaryButtonText}>Create new event</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Content automation</Text>
            <Sparkles color={Colors.palette.amber} />
          </View>
          <View style={styles.automationRow}>
            <Text style={styles.automationTitle}>Weekly posting reminders</Text>
            <Text style={styles.automationMeta}>Mondays · 06:00</Text>
          </View>
          <View style={styles.automationRow}>
            <Text style={styles.automationTitle}>Auto-rotate TEIN 101 modules</Text>
            <Text style={styles.automationMeta}>Next drop · Sunday</Text>
          </View>
          <View style={styles.automationRow}>
            <Text style={styles.automationTitle}>Nudge inactive members</Text>
            <Text style={styles.automationMeta}>274 pending</Text>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Issues queue</Text>
            <ShieldCheck color={Colors.palette.jade} />
          </View>
          {issues.slice(0, 3).map((issue) => (
            <View key={issue.id} style={styles.issueRow}>
              <View>
                <Text style={styles.issueTitle}>{issue.title}</Text>
                <Text style={styles.issueMeta}>{issue.category} · {issue.status}</Text>
              </View>
              <TouchableOpacity style={styles.secondaryButton} testID={`assign-${issue.id}`}>
                <Text style={styles.secondaryButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tasks control</Text>
            <BarChart3 color={Colors.palette.ivory} />
          </View>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskRow}>
              <View>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskMeta}>{task.group} · due {task.dueDate}</Text>
              </View>
              <Text style={[styles.taskStatus, task.completed && styles.taskStatusDone]}>{task.completed ? "Complete" : "Pending"}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Finance dashboard</Text>
            <FileText color={Colors.palette.ivory} />
          </View>
          {payments.map((payment) => (
            <View key={payment.id} style={styles.paymentRow}>
              <Text style={styles.paymentTitle}>{payment.label}</Text>
              <Text style={styles.paymentAmount}>{payment.amount}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.secondaryButton} testID="export-finance">
            <Text style={styles.secondaryButtonText}>Export CSV for SEC</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User management</Text>
            <Users color={Colors.palette.ivory} />
          </View>
          <View style={styles.userGrid}>
            <View style={styles.userTile}>
              <Text style={styles.userTileValue}>24</Text>
              <Text style={styles.userTileLabel}>Pending verification</Text>
            </View>
            <View style={styles.userTile}>
              <Text style={styles.userTileValue}>6</Text>
              <Text style={styles.userTileLabel}>Admins</Text>
            </View>
            <View style={styles.userTile}>
              <Text style={styles.userTileValue}>52</Text>
              <Text style={styles.userTileLabel}>Volunteers</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.primaryButton} testID="sync-backup">
            <Text style={styles.primaryButtonText}>Sync cloud backup</Text>
          </TouchableOpacity>
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
  sectionCaption: {
    color: Colors.ui.textSecondary,
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
  primaryButtonText: {
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
});
