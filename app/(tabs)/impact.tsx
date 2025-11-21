import { AlertTriangle, CheckCircle2, ClipboardCheck, Crown, SendHorizontal } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { IssueTicket, VolunteerTask, useAppState } from "@/contexts/app-state";

const categories: IssueTicket["category"][] = ["academic", "fees", "accommodation", "welfare", "security"];

export default function ImpactScreen() {
  const { issues, submitIssue, tasks, toggleTask, leaderboard, payments } = useAppState();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<IssueTicket["category"]>("academic");
  const [title, setTitle] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [pollChoice, setPollChoice] = useState<string>("");

  const pollOptions = [
    { id: "policy", label: "More policy explainers" },
    { id: "welfare", label: "Hall repairs + welfare" },
    { id: "media", label: "Shareable media assets" },
  ];

  const volunteerHours = useMemo(() => tasks.reduce((total, task) => (task.completed ? total + task.hours : total), 0), [tasks]);

  const submitDisabled = title.trim().length === 0 || details.trim().length === 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: 24, paddingBottom: Math.max(insets.bottom, 72) }]}
        testID="impact-scroll"
      >
        <View style={styles.issuePanel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Issues desk</Text>
            <AlertTriangle color={Colors.palette.amber} />
          </View>
          <View style={styles.categoryRow}>
            {categories.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.categoryChip, category === option && styles.categoryChipActive]}
                onPress={() => setCategory(option)}
                testID={`category-${option}`}
              >
                <Text style={styles.categoryChipText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Title"
            placeholderTextColor={Colors.ui.textSecondary}
            value={title}
            onChangeText={setTitle}
            testID="issue-title"
          />
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Describe the situation, suite, faculty, people affected..."
            placeholderTextColor={Colors.ui.textSecondary}
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={4}
            testID="issue-details"
          />
          <TouchableOpacity
            style={[styles.toggleRow, anonymous && styles.toggleRowActive]}
            onPress={() => setAnonymous((prev) => !prev)}
            testID="toggle-anonymous"
          >
            <CheckCircle2 color={anonymous ? Colors.palette.jade : Colors.ui.textSecondary} />
            <Text style={styles.toggleText}>Submit anonymously</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, submitDisabled && styles.primaryButtonDisabled]}
            disabled={submitDisabled}
            onPress={() => {
              submitIssue({ category, title, details, anonymous });
              setTitle("");
              setDetails("");
              setAnonymous(false);
            }}
            testID="submit-issue"
          >
            <Text style={styles.primaryButtonText}>Send to executives</Text>
            <SendHorizontal color={Colors.ui.background} />
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Issue history</Text>
            <ClipboardCheck color={Colors.palette.ivory} />
          </View>
          {issues.map((issue) => (
            <View key={issue.id} style={styles.issueCard}>
              <View style={styles.issueHeader}>
                <Text style={styles.issueCategory}>{issue.category.toUpperCase()}</Text>
                <Text style={styles.issueStatus}>{issue.status}</Text>
              </View>
              <Text style={styles.issueTitle}>{issue.title}</Text>
              <Text style={styles.issueDetail}>{issue.details}</Text>
              <Text style={styles.issueMeta}>{issue.createdAt} · {issue.anonymous ? "Anonymous" : "Named"}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Volunteer tasks</Text>
            <Text style={styles.sectionCaption}>{volunteerHours}h logged this week</Text>
          </View>
          {tasks.map((task: VolunteerTask) => (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskRow, task.completed && styles.taskRowDone]}
              onPress={() => toggleTask(task.id)}
              testID={`task-${task.id}`}
            >
              <View>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskMeta}>{task.group} · Due {task.dueDate} · {task.hours}h</Text>
              </View>
              <View style={[styles.taskStatus, task.completed && styles.taskStatusDone]}>
                <Text style={styles.taskStatusText}>{task.completed ? "DONE" : "OPEN"}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Volunteer leaderboard</Text>
            <Crown color={Colors.palette.amber} />
          </View>
          {leaderboard.map((entry, index) => (
            <View key={entry.name} style={styles.leaderRow}>
              <Text style={styles.leaderRank}>{index + 1}</Text>
              <View style={styles.leaderInfo}>
                <Text style={styles.leaderName}>{entry.name}</Text>
                <Text style={styles.leaderHall}>{entry.hall}</Text>
              </View>
              <Text style={styles.leaderHours}>{entry.hours}h</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community poll</Text>
            <Text style={styles.sectionCaption}>Vote · auto-remind inactive members</Text>
          </View>
          {pollOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.pollOption, pollChoice === option.id && styles.pollOptionActive]}
              onPress={() => setPollChoice(option.id)}
              testID={`poll-${option.id}`}
            >
              <Text style={styles.pollText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Finance & dues</Text>
            <Text style={styles.sectionCaption}>Tap to view receipt</Text>
          </View>
          {payments.map((record) => (
            <View key={record.id} style={styles.paymentRow}>
              <View>
                <Text style={styles.paymentTitle}>{record.label}</Text>
                <Text style={styles.paymentMeta}>{record.method} · {record.date}</Text>
              </View>
              <Text style={styles.paymentAmount}>{record.amount}</Text>
            </View>
          ))}
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
  issuePanel: {
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
    fontSize: 20,
    fontWeight: "700",
  },
  sectionCaption: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.palette.crimson,
    borderColor: Colors.palette.crimson,
  },
  categoryChipText: {
    color: Colors.ui.textPrimary,
    fontWeight: "600",
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 14,
    color: Colors.ui.textPrimary,
    backgroundColor: Colors.ui.elevated,
  },
  multiline: {
    height: 110,
    textAlignVertical: "top",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 12,
  },
  toggleRowActive: {
    borderColor: Colors.palette.jade,
  },
  toggleText: {
    color: Colors.ui.textPrimary,
  },
  primaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.palette.jade,
    borderRadius: 18,
    paddingVertical: 14,
  },
  primaryButtonDisabled: {
    opacity: 0.4,
  },
  primaryButtonText: {
    color: Colors.ui.background,
    fontWeight: "700",
  },
  panel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 20,
    gap: 12,
  },
  issueCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 14,
    backgroundColor: Colors.ui.elevated,
    gap: 6,
  },
  issueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  issueCategory: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  issueStatus: {
    color: Colors.palette.ocean,
    fontWeight: "700",
  },
  issueTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  issueDetail: {
    color: Colors.ui.textSecondary,
  },
  issueMeta: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  taskRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 16,
    backgroundColor: Colors.ui.elevated,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskRowDone: {
    borderColor: Colors.palette.jade,
  },
  taskTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  taskMeta: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  taskStatus: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  taskStatusDone: {
    borderColor: Colors.palette.jade,
  },
  taskStatusText: {
    color: Colors.ui.textPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 12,
    backgroundColor: Colors.ui.elevated,
  },
  leaderRank: {
    width: 24,
    color: Colors.ui.textSecondary,
    fontWeight: "700",
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  leaderHall: {
    color: Colors.ui.textSecondary,
  },
  leaderHours: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  pollOption: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 14,
    backgroundColor: Colors.ui.elevated,
  },
  pollOptionActive: {
    borderColor: Colors.palette.jade,
  },
  pollText: {
    color: Colors.ui.textPrimary,
    fontWeight: "600",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  paymentTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "600",
  },
  paymentMeta: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  paymentAmount: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
});
