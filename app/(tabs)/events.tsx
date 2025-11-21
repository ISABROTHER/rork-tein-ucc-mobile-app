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

  const activeEvent = useMemo(
    () => events.find((event) => event.id === selectedEvent) ?? events[0],
    [events, selectedEvent]
  );

  // Safe analytics fallbacks
  const attendanceTotal = analytics?.attendance?.total ?? 0;
  const attendanceNewcomers = analytics?.attendance?.newcomers ?? 0;
  const attendanceReturning = analytics?.attendance?.returning ?? 0;

  const returningPercent =
    attendanceTotal > 0 ? Math.round((attendanceReturning / attendanceTotal) * 100) : 0;

  const hasEvents = events.length > 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: 24, paddingBottom: Math.max(insets.bottom, 80) },
        ]}
        showsVerticalScrollIndicator={false}
        testID="events-scroll"
      >
        <Text style={styles.pageTitle}>Events + Intelligence</Text>
        <Text style={styles.pageSubtitle}>
          RSVP, attendance, QR check-in and engagement insights
        </Text>

        {/* Event selector carousel */}
        {!hasEvents ? (
          <EmptyBlock text="No events yet. Executives can create events from Admin." />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
            {events.map((event) => {
              const isActive = selectedEvent === event.id;
              return (
                <TouchableOpacity
                  key={event.id}
                  style={[styles.eventChip, isActive && styles.eventChipActive]}
                  onPress={() => setSelectedEvent(event.id)}
                  testID={`event-chip-${event.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Select event ${event.title}`}
                >
                  <Text
                    style={[styles.eventChipLabel, isActive && styles.eventChipLabelActive]}
                    numberOfLines={1}
                  >
                    {event.title}
                  </Text>
                  <Text
                    style={[styles.eventChipMeta, isActive && styles.eventChipMetaActive]}
                    numberOfLines={1}
                  >
                    {event.date}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Active event banner */}
        {activeEvent && (
          <ImageBackground
            source={{ uri: activeEvent.banner }}
            style={styles.banner}
            imageStyle={styles.bannerImage}
          >
            <BlurView intensity={40} style={styles.bannerBlur}>
              <Text style={styles.bannerLabel} numberOfLines={1}>
                {activeEvent.tags.join(" · ")}
              </Text>

              <Text style={styles.bannerTitle} numberOfLines={2}>
                {activeEvent.title}
              </Text>

              <Text style={styles.bannerMeta} numberOfLines={2}>
                {activeEvent.date} · {activeEvent.time} · {activeEvent.venue}
              </Text>

              <Text style={styles.bannerDescription} numberOfLines={4}>
                {activeEvent.description}
              </Text>

              {/* RSVP */}
              <View style={styles.rsvpRow}>
                {rsvpOptions.map((option) => {
                  const isActive = activeEvent.rsvpStatus === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[styles.rsvpButton, isActive && styles.rsvpButtonActive]}
                      onPress={() => updateRsvp(activeEvent.id, option)}
                      testID={`rsvp-${option}`}
                      accessibilityRole="button"
                      accessibilityLabel={`RSVP ${option}`}
                    >
                      <Text style={[styles.rsvpLabel, isActive && styles.rsvpLabelActive]}>
                        {option.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* QR / Attendance card */}
              <View style={styles.attendanceCard}>
                <Text style={styles.attendanceLabel}>QR for check-in</Text>
                <Text style={styles.attendanceCode} numberOfLines={1}>
                  {activeEvent.attendanceCode}
                </Text>
                <Text style={styles.attendanceMeta}>
                  Rotate daily · linked to smart score
                </Text>
              </View>
            </BlurView>
          </ImageBackground>
        )}

        {/* Analytics (faculty breakdown removed) */}
        <View style={styles.analyticsPanel}>
          <Text style={styles.sectionTitle}>Event Intelligence</Text>

          <View style={styles.analyticsRow}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Total Attendance</Text>
              <Text style={styles.analyticsValue}>{attendanceTotal}</Text>
              <Text style={styles.analyticsMeta}>New {attendanceNewcomers}</Text>
            </View>

            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsLabel}>Returning %</Text>
              <Text style={styles.analyticsValue}>{returningPercent}%</Text>
              <Text style={styles.analyticsMeta}>Returning {attendanceReturning}</Text>
            </View>
          </View>
        </View>

        {/* Recap */}
        <View style={styles.recapPanel}>
          <Text style={styles.sectionTitle}>Recap + Gallery</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(activeEvent?.recapPhotos ?? []).map((photo, index) => (
              <ImageBackground
                key={`${photo}-${index}`}
                source={{ uri: photo }}
                style={styles.recapImage}
                imageStyle={styles.recapImageStyle}
              >
                <View style={styles.recapBadge}>
                  <Text style={styles.recapBadgeText}>Highlights</Text>
                </View>
              </ImageBackground>
            ))}

            {(activeEvent?.recapPhotos?.length ?? 0) === 0 && (
              <View style={styles.emptyRecap}>
                <Text style={styles.emptyRecapText}>
                  Recap will unlock after the event
                </Text>
              </View>
            )}
          </ScrollView>
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
    minWidth: 150,
  },
  eventChipActive: {
    backgroundColor: Colors.palette.crimson,
    borderColor: Colors.palette.crimson,
  },
  eventChipLabel: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
  },
  eventChipLabelActive: {
    color: Colors.palette.ivory,
  },
  eventChipMeta: {
    color: Colors.ui.textSecondary,
  },
  eventChipMetaActive: {
    color: Colors.palette.ivory,
    opacity: 0.9,
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
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  rsvpButtonActive: {
    backgroundColor: Colors.palette.ivory,
    borderColor: Colors.palette.ivory,
  },
  rsvpLabel: {
    color: Colors.palette.ivory,
    fontWeight: "700",
  },
  rsvpLabelActive: {
    color: Colors.ui.background,
    fontWeight: "800",
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
    width: 220,
    padding: 24,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.ui.elevated,
  },
  emptyRecapText: {
    color: Colors.ui.textSecondary,
    fontSize: 15,
    textAlign: "center",
  },
  emptyBlock: {
    width: "100%",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    backgroundColor: Colors.ui.elevated,
    alignItems: "center",
  },
  emptyBlockText: {
    color: Colors.ui.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});
