import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAppState } from "@/contexts/app-state";

export default function AdminScreen() {
  const insets = useSafeAreaInsets();

  // Best-effort: pull any "card credit / balance" value if your app-state has it.
  // Falls back safely to 0 without breaking TS.
  const appState = useAppState() as any;
  const cardCredit =
    appState?.cardCredit ??
    appState?.cardBalance ??
    appState?.walletBalance ??
    appState?.balance ??
    0;

  const cardOwner =
    appState?.profile?.firstName || appState?.profile?.lastName
      ? `${appState.profile.firstName ?? ""} ${appState.profile.lastName ?? ""}`.trim()
      : "Member";

  const cardNumber =
    appState?.cardNumber ??
    appState?.profile?.membershipId ??
    "— — — —";

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* CARD CREDIT (FIRST) */}
        <View style={styles.cardCreditWrap}>
          <View style={styles.cardCreditHeader}>
            <Text style={styles.cardCreditTitle}>Card Credit</Text>
            <View style={styles.virtualPill}>
              <Text style={styles.virtualText}>Virtual</Text>
            </View>
          </View>

          <Text style={styles.balanceLabel}>Available balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.currency}>GHS</Text>
            <Text style={styles.balanceValue}>
              {Number(cardCredit).toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>Name</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {cardOwner}
              </Text>
            </View>
            <View style={styles.metaColRight}>
              <Text style={styles.metaLabel}>Card Number</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {cardNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* nothing else on admin tab */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },

  // Card Credit UI
  cardCreditWrap: {
    backgroundColor: Colors.ui.elevated,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    marginTop: 8,
  },
  cardCreditHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardCreditTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.ui.textPrimary,
    letterSpacing: 0.2,
  },
  virtualPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.ui.surface,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  virtualText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.ui.textSecondary,
  },
  balanceLabel: {
    marginTop: 12,
    color: Colors.ui.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 4,
    gap: 6,
  },
  currency: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.ui.textSecondary,
    marginBottom: 2,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.ui.textPrimary,
    letterSpacing: 0.4,
  },
  divider: {
    marginTop: 14,
    marginBottom: 12,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.ui.border,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaCol: {
    flex: 1,
  },
  metaColRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.ui.textSecondary,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.ui.textPrimary,
  },
});
