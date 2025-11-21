import { BookOpenCheck, GraduationCap, History, PlayCircle } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAppState } from "@/contexts/app-state";

const timeline = [
  { year: "1992", detail: "TEIN founded to organize tertiary campuses for social democracy" },
  { year: "2008", detail: "UCC chapter launches digital membership" },
  { year: "2020", detail: "First virtual congress with 5k viewers" },
  { year: "2024", detail: "Policy Intelligence Lab introduced" },
];

const glossary = [
  { term: "Mobilizer", meaning: "Member trained to host conversational canvassing" },
  { term: "War Room", meaning: "Daily rapid response pod for messaging" },
  { term: "Pulse Poll", meaning: "48-hour micro survey to guide talking points" },
];

const modules = [
  { id: "module-1", title: "TEIN 101", minutes: 6, completed: true },
  { id: "module-2", title: "Mission + Vision", minutes: 8, completed: true },
  { id: "module-3", title: "Structure & Roles", minutes: 12, completed: false },
  { id: "module-4", title: "Policy Explainers", minutes: 9, completed: false },
];

export default function LearningScreen() {
  const insets = useSafeAreaInsets();
  const { learningProgress } = useAppState();
  const [selectedModule, setSelectedModule] = useState<string>(modules[0].id);

  const activeModule = useMemo(() => modules.find((module) => module.id === selectedModule) ?? modules[0], [selectedModule]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}> 
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 24, paddingBottom: Math.max(insets.bottom, 72) },
        ]}
        testID="learning-scroll"
      >
        <View style={styles.hero}>
          <View>
            <Text style={styles.heroEyebrow}>POLITICAL EDUCATION</Text>
            <Text style={styles.heroTitle}>Finish TEIN 101 track</Text>
            <Text style={styles.heroSub}>Certificates unlock after 100% completion</Text>
          </View>
          <View style={styles.progressRing}>
            <Text style={styles.progressValue}>{learningProgress}%</Text>
            <Text style={styles.progressLabel}>complete</Text>
          </View>
        </View>

        <View style={styles.modulePanel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Auto-rotating curriculum</Text>
            <Text style={styles.sectionCaption}>Next release drops Monday</Text>
          </View>
          <View style={styles.moduleList}>
            {modules.map((module) => (
              <Pressable
                key={module.id}
                onPress={() => setSelectedModule(module.id)}
                style={[styles.moduleRow, selectedModule === module.id && styles.moduleRowActive]}
                testID={`module-${module.id}`}
              >
                <View style={styles.moduleLeft}>
                  <View style={[styles.moduleBullet, module.completed && styles.moduleBulletDone]} />
                  <View>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                    <Text style={styles.moduleMeta}>{module.minutes} min · micro videos</Text>
                  </View>
                </View>
                <PlayCircle color={Colors.palette.ivory} />
              </Pressable>
            ))}
          </View>
          <View style={styles.moduleDetail}>
            <Text style={styles.detailLabel}>Active module</Text>
            <Text style={styles.detailTitle}>{activeModule.title}</Text>
            <Text style={styles.detailBody}>
              Digestible storytelling crafted for Ghanaian students. Includes scenario practice, policy flash cards and recap quiz.
            </Text>
            <TouchableOpacity style={styles.primaryButton} testID="start-module">
              <Text style={styles.primaryButtonText}>Continue • {activeModule.minutes} minutes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.timelinePanel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TEIN history</Text>
            <History color={Colors.palette.ivory} />
          </View>
          {timeline.map((entry) => (
            <View key={entry.year} style={styles.timelineRow}>
              <View style={styles.timelineYearWrap}>
                <Text style={styles.timelineYear}>{entry.year}</Text>
                <View style={styles.timelineDot} />
              </View>
              <Text style={styles.timelineDetail}>{entry.detail}</Text>
            </View>
          ))}
        </View>

        <View style={styles.glossaryPanel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Glossary + Policy explainers</Text>
            <BookOpenCheck color={Colors.palette.ivory} />
          </View>
          {glossary.map((item) => (
            <View key={item.term} style={styles.glossaryRow}>
              <Text style={styles.glossaryTerm}>{item.term}</Text>
              <Text style={styles.glossaryMeaning}>{item.meaning}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.secondaryButton} testID="download-policy">
            <Text style={styles.secondaryButtonText}>Download policy PDF pack</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.certificatePanel}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Certification</Text>
            <GraduationCap color={Colors.palette.ivory} />
          </View>
          <Text style={styles.detailBody}>Earn badges when you ace learning quizzes and pass the rapid policy questions. Alumni mentors see your streak.</Text>
          <TouchableOpacity style={styles.primaryButton} testID="start-quiz">
            <Text style={styles.primaryButtonText}>Launch Adaptive Quiz</Text>
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
  hero: {
    backgroundColor: Colors.ui.surface,
    padding: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroEyebrow: {
    color: Colors.palette.ocean,
    letterSpacing: 1,
    fontWeight: "600",
  },
  heroTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
  },
  heroSub: {
    color: Colors.ui.textSecondary,
    marginTop: 4,
  },
  progressRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: Colors.palette.jade,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.ui.elevated,
  },
  progressValue: {
    color: Colors.ui.textPrimary,
    fontSize: 26,
    fontWeight: "700",
  },
  progressLabel: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  modulePanel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 20,
    gap: 16,
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
    fontSize: 12,
  },
  moduleList: {
    gap: 10,
  },
  moduleRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.ui.elevated,
  },
  moduleRowActive: {
    borderColor: Colors.palette.jade,
  },
  moduleLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },
  moduleBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.ui.textSecondary,
  },
  moduleBulletDone: {
    backgroundColor: Colors.palette.jade,
    borderColor: Colors.palette.jade,
  },
  moduleTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  moduleMeta: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  moduleDetail: {
    backgroundColor: Colors.ui.elevated,
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  detailLabel: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  detailTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  detailBody: {
    color: Colors.ui.textSecondary,
    fontSize: 14,
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: Colors.palette.jade,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: Colors.ui.background,
    fontWeight: "700",
  },
  timelinePanel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 20,
    gap: 12,
  },
  timelineRow: {
    flexDirection: "row",
    gap: 12,
  },
  timelineYearWrap: {
    width: 70,
    alignItems: "center",
  },
  timelineYear: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  timelineDot: {
    width: 6,
    height: 40,
    backgroundColor: Colors.palette.crimson,
    marginTop: 4,
    borderRadius: 3,
  },
  timelineDetail: {
    flex: 1,
    color: Colors.ui.textSecondary,
  },
  glossaryPanel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 20,
    gap: 12,
  },
  glossaryRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 14,
    backgroundColor: Colors.ui.elevated,
  },
  glossaryTerm: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  glossaryMeaning: {
    color: Colors.ui.textSecondary,
    marginTop: 4,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.palette.ocean,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: Colors.palette.ocean,
    fontWeight: "700",
  },
  certificatePanel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 20,
    gap: 12,
  },
});
