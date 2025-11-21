import { BlurView } from "expo-blur";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { EventItem, useAppState } from "@/contexts/app-state";

const rsvpOptions: EventItem["rsvpStatus"][] = ["going", "interested", "none"];

export default function EventsScreen() {
  const { events, updateRsvp, analytics } = useAppState();
  const insets = useSafeAreaInsets();

  const listRef = useRef<FlatList<EventItem>>(null);

  const [selectedEvent, setSelectedEvent] = useState<string>(events[0]?.id ?? "");
  const [search, setSearch] = useState("");

  const activeEvent = useMemo(
    () => events.find((event) => event.id === selectedEvent) ?? events[0],
    [events, selectedEvent]
  );

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      [e.title, e.venue, e.date, e.tags?.join(" ")].join(" ").toLowerCase().includes(q)
    );
  }, [events, search]);

  const hasEvents = events.length > 0;

  // Safe analytics fallbacks
  const attendanceTotal = analytics?.attendance?.total ?? 0;
  const attendanceNewcomers = analytics?.attendance?.newcomers ?? 0;
  const attendanceReturning = analytics?.attendance?.returning ?? 0;
  const returningPercent =
    attendanceTotal > 0 ? Math.round((attendanceReturning / attendanceTotal) * 100) : 0;

  const handleSelect = (id: string) => {
    setSelectedEvent(id);
    // scroll to top so the detail card is visible
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <FlatList
        ref={listRef}
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 80) },
        ]}
        testID="events-scroll"
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            <Text style={styles.pageTitle}>Events + Intelligence</Text>
            <Text style={styles.pageSubtitle}>
              RSVP, attendance, QR check-in and engagement insights
            </Text>

            {/* Search Bar */}
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search events by title, venue, date, tags..."
              placeholderTextColor={Colors.ui.textSecondary}
              style={styles.searchInput}
              testID="events-search"
            />

            {/* Active Event Details Card */}
            {!hasEvents ? (
              <EmptyBlock text="No events yet. Executives can create events from Admin." />
            ) : activeEvent ? (
              <ImageBackground
                source={{ uri: activeEvent.banner }}
                style={styles.banner}
                imageStyle={styles.bannerImage}
              >
                {/* Dark overlay for guaranteed readability */}
                <View style={styles.bannerOverlay} />

                <BlurView intensity={55} style={styles.bannerBlur}>
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
            ) : null}

            {/* Analytics */}
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

            {/* Section label for list */}
            <Text style={styles.listHeader}>
              {search.trim() ? `Results (${filteredEvents.length})` : `All Events (${events.length})`}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isActive = selectedEvent === item.id;
          return (
            <TouchableOpacity
              style={[styles.eventTile, isActive && styles.eventTileActive]}
              onPress={() => handleSelect(item.id)}
              testID={`event-tile-${item.id}`}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text
                  style={[styles.eventTileTitle, isActive && styles.eventTileTitleActive]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  style={[styles.eventTileMeta, isActive && styles.eventTileMetaActive]}
                  numberOfLines={1}
                >
                  {item.date} • {item.time} • {item.venue}
                </Text>
              </View>
              <View style={[styles.dot, isActive && styles.dotActive]} />
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={<EmptyBlock text="No events match your search." />}
      />
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
    gap: 14,
    paddingTop: 24,
  },
  pageTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 8,
  },
  pageSubtitle: {
    color: Colors.ui.textSecondary,
  },

  searchInput: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 12,
    backgroundColor: Colors.ui.elevated,
    color: Colors.ui.textPrimary,
  },

  listHeader: {
    color: Colors.ui.textSecondary,
    fontWeight: "700",
    marginTop: 6,
  },

  /* Event list tiles */
  eventTile: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    backgroundColor: Colors.ui.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  eventTileActive: {
    borderColor: Colors.palette.jade,
    backgroundColor: Colors.ui.elevated,
  },
  eventTileTitle: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  eventTileTitleActive: {
    color: Colors.palette.jade,
  },
  eventTileMeta: {
    color: Colors.ui.textSecondary,
    marginTop: 3,
    fontSize: 13,
  },
  eventTileMetaActive: {
    color: Colors.palette.jade,
    opacity: 0.9,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: Colors.ui.border,
  },
  dotActive: {
    backgroundColor: Colors.palette.jade,
  },

  /* Banner */
  banner: {
    height: 320,
    borderRadius: 32,
    overflow: "hidden",
    marginTop: 4,
  },
  bannerImage: {
    borderRadius: 32,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)", // ensures text/buttons never disappear
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
    opacity: 0.9,
  },
  bannerDescription: {
    color: Colors.palette.ivory,
    fontSize: 15,
    opacity: 0.95,
  },

  rsvpRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  rsvpButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  rsvpButtonActive: {
    backgroundColor: Colors.palette.ivory,
    borderColor: Colors.palette.ivory,
  },
  rsvpLabel: {
    color: Colors.palette.ivory,
    fontWeight: "800",
  },
  rsvpLabelActive: {
    color: Colors.ui.background,
    fontWeight: "900",
  },

  attendanceCard: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
  },
  attendanceLabel: {
    color: Colors.palette.ivory,
    opacity: 0.95,
  },
  attendanceCode: {
    color: Colors.palette.ivory,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 6,
  },
  attendanceMeta: {
    color: Colors.palette.ivory,
    opacity: 0.9,
  },

  analyticsPanel: {
    backgroundColor: Colors.ui.surface,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    gap: 14,
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
    fontWeight: "800",
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
    gap: 14,
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
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  recapBadgeText: {
    color: Colors.palette.ivory,
    fontWeight: "700",
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
 