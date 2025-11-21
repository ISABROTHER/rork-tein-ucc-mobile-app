import { BlurView } from "expo-blur";
import { useMemo, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { EventItem, useAppState } from "@/contexts/app-state";

const rsvpOptions: EventItem["rsvpStatus"][] = ["going", "interested", "none"];

export default function EventsScreen() {
  const { events, updateRsvp, analytics } = useAppState();
  const insets = useSafeAreaInsets();
  const [selectedEvent, setSelectedEvent] = useState<string>(events[0]?.id ?? "");

  const activeEvent = useMemo(() => events.find((event) => event.id === selectedEvent) ?? events[0], [events, selectedEvent]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}> 
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: 24, paddingBottom: Math.max(insets.bottom, 80) },
        ]}
        testID="events-scroll"
      >
        <Text style={styles.pageTitle}>Events + Intelligence</Text>
        <Text style={styles.pageSubtitle}>RSVP, attendance, QR check-in and engagement insights</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {events.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventChip, selectedEvent === event.id && styles.eventChipActive]}
              onPress={() => setSelectedEvent(event.id)}
              testID={`event-chip-${event.id}`}
            >
              <Text style={styles.eventChipLabel}>{event.title}</Text>
              <Text style={styles.eventChipMeta}>{event.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {activeEvent && (
          <ImageBackground source={{ uri: activeEvent.banner }} style={styles.banner} imageStyle={styles.bannerImage}>
            <BlurView intensity={40} style={styles.bannerBlur}>
              <Text style={styles.bannerLabel}>{activeEvent.tags.join(" · ")}</Text>
              <Text style={styles.bannerTitle}>{activeEvent.title}</Text>
              <Text style={styles.bannerMeta}>{activeEvent.date} · {activeEvent.time} · {activeEvent.venue}</Text>
              <Text style={styles.bannerDescription}>{activeEvent.description}</Text>
              <View style={styles.rsvpRow}>
                {rsvpOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.rsvpButton, activeEvent.rsvpStatus === option && styles.rsvpButtonActive]}
                    onPress={() => updateRsvp(activeEvent.id, option)}
                    testID={`rsvp-${option}`}
                  >
                    <Text style={styles.rsvpLabel}>{option.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.attendanceCard}>
                <Text style={styles.attendanceLabel}>QR for check-in</Text>
                <Text style={styles.attendanceCode}>{activeEvent.attendanceCode}</Text>
                <Text style={styles.attendanceMeta}>Rotate daily · linked to smart score</Text>
              </View>
            </BlurView>
          </ImageBackground>
        )}

        <View style={styles.analyticsPanel}>
          <Text style={styles.sectionTitle}>Event Intelligence</Text>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Total Attendance</Text>
              <Text style={styles.analyticsValue}>{analytics.attendance.total}</Text>
              <Text style={styles.analyticsMeta}>New {analytics.attendance.newcomers}</Text>
            </View>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Returning %</Text>
              <Text style={styles.analyticsValue}>{Math.round((analytics.attendance.returning / analytics.attendance.total) * 100)}%</Text>
              <Text style={styles.analyticsMeta}>Returning {analytics.attendance.returning}</Text>
            </View>
          </View>
          <View style={styles.facultyGraph}>
            {analytics.facultyBreakdown.map((faculty) => (
              <View key={faculty.faculty} style={styles.facultyRow}>
                <Text style={styles.facultyLabel}>{faculty.faculty}</Text>
                <View style={styles.facultyBarTrack}>
                  <View style={[styles.facultyBarFill, { width: `${faculty.percent}%` }]} />
                </View>
                <Text style={styles.facultyPercent}>{faculty.percent}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recapPanel}>
          <Text style={styles.sectionTitle}>Recap + Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(activeEvent?.recapPhotos ?? []).map((photo, index) => (
              <ImageBackground key={`${photo}-${index}`} source={{ uri: photo }} style={styles.recapImage} imageStyle={styles.recapImageStyle}>
                <View style={styles.recapBadge}>
                  <Text style={styles.recapBadgeText}>Highlights</Text>
                </View>
              </ImageBackground>
            ))}
            {activeEvent?.recapPhotos.length === 0 && (
              <View style={styles.emptyRecap}>
                <Text style={styles.emptyRecapText}>Recap will unlock after the event</Text>
              </View>
            )}
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
  content: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    gap: 24,
  },
  pageTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 12,
  },
  pageSubtitle: {
    color: Colors.ui.textSecondary,
  },
  carousel: {
    marginTop: 12,
  },
  eventChip: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    marginRight: 12,
    backgroundColor: Colors.ui.surface,
  },
  eventChipActive: {
    backgroundColor: Colors.palette.crimson,
    borderColor: Colors.palette.crimson,
  },
  eventChipLabel: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  eventChipMeta: {
    color: Colors.ui.textSecondary,
  },
  banner: {
    height: 320,
    borderRadius: 32,
    overflow: "hidden",
  },
  bannerImage: {
    borderRadius: 32,
  },
  bannerBlur: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    borderRadius: 32,
  },
  bannerLabel: {
    color: Colors.palette.ivory,
    letterSpacing: 1,
  },
  bannerTitle: {
    color: Colors.palette.ivory,
    fontSize: 26,
    fontWeight: "700",
  },
  bannerMeta: {
    color: Colors.palette.ivory,
    opacity: 0.8,
  },
  bannerDescription: {
    color: Colors.palette.ivory,
    fontSize: 15,
  },
  rsvpRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  rsvpButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
  },
  rsvpButtonActive: {
    backgroundColor: Colors.palette.ivory,
  },
  rsvpLabel: {
    color: Colors.palette.ivory,
    fontWeight: "700",
  },
  attendanceCard: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
  },
  attendanceLabel: {
    color: Colors.palette.ivory,
    opacity: 0.9,
  },
  attendanceCode: {
    color: Colors.palette.ivory,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  attendanceMeta: {
    color: Colors.palette.ivory,
    opacity: 0.8,
  },
  analyticsPanel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 16,
  },
  sectionTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
  analyticsRow: {
    flexDirection: "row",
    gap: 12,
  },
  analyticsCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: Colors.ui.elevated,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  analyticsLabel: {
    color: Colors.ui.textSecondary,
  },
  analyticsValue: {
    color: Colors.ui.textPrimary,
    fontSize: 28,
    fontWeight: "700",
  },
  analyticsMeta: {
    color: Colors.ui.textSecondary,
  },
  facultyGraph: {
    gap: 12,
  },
  facultyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  facultyLabel: {
    color: Colors.ui.textPrimary,
    flex: 1,
  },
  facultyBarTrack: {
    flex: 3,
    backgroundColor: Colors.ui.border,
    height: 8,
    borderRadius: 8,
  },
  facultyBarFill: {
    backgroundColor: Colors.palette.jade,
    height: 8,
    borderRadius: 8,
  },
  facultyPercent: {
    color: Colors.ui.textSecondary,
    width: 50,
    textAlign: "right",
  },
  recapPanel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 20,
    gap: 16,
  },
  recapImage: {
    width: 200,
    height: 140,
    marginRight: 12,
  },
  recapImageStyle: {
    borderRadius: 20,
  },
  recapBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  recapBadgeText: {
    color: Colors.palette.ivory,
    fontWeight: "600",
  },
  emptyRecap: {
    width: "100%",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    alignItems: "center",
  },
  emptyRecapText: {
    color: Colors.ui.textSecondary,
    fontSize: 15,
  },
});
