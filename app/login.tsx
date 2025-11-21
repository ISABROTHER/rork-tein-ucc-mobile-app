import React, { useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowRight, Phone, ShieldCheck, Lock, HelpCircle } from "lucide-react-native";

import Colors from "@/constants/colors";
import { useAppState } from "@/contexts/app-state";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAppState();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New: stay signed in toggle
  const [staySignedIn, setStaySignedIn] = useState(true);

  // New: resend timer
  const RESEND_SECONDS = 60;
  const [resendLeft, setResendLeft] = useState(0);

  // New: store what number was used for OTP step
  const [sentToNumber, setSentToNumber] = useState("");

  // Tick countdown when on OTP step
  useEffect(() => {
    if (step !== "otp" || resendLeft <= 0) return;
    const t = setInterval(() => {
      setResendLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [step, resendLeft]);

  const handleGetCode = async () => {
    const cleaned = phoneNumber.replace(/\s/g, "");
    // Basic Ghana-friendly validation: 9–10 digits after stripping spaces.
    if (cleaned.length < 9) {
      setError("Enter a valid phone number");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSentToNumber(cleaned);
      setStep("otp");
      setResendLeft(RESEND_SECONDS);
    }, 1200);
  };

  const handleResend = () => {
    if (resendLeft > 0) return;
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setResendLeft(RESEND_SECONDS);
    }, 900);
  };

  const handleVerify = async () => {
    if (otp.length < 4) {
      setError("Enter the 4-digit code");
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // keep same behavior; staySignedIn can be wired to storage later
      login();
      router.replace("/(tabs)/dashboard");
    }, 1200);
  };

  const otpBoxes = useMemo(() => {
    const chars = otp.split("");
    return new Array(4).fill("").map((_, i) => chars[i] ?? "");
  }, [otp]);

  const formattedTimer = `${String(Math.floor(resendLeft / 60)).padStart(2, "0")}:${String(
    resendLeft % 60
  ).padStart(2, "0")}`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Premium background halos */}
      <View style={styles.gradientHalo} />
      <View style={styles.gradientHalo2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.content}>
          {/* HERO */}
          <View style={styles.heroWrap}>
            <View style={styles.crestWrap}>
              <View style={styles.crestInner}>
                <ShieldCheck size={42} color={Colors.palette.ivory} strokeWidth={2.5} />
              </View>
            </View>

            <Text style={styles.heroTitle}>TEIN UCC</Text>
            <Text style={styles.heroSubtitle}>Tertiary Education Institutions Network</Text>
            <Text style={styles.heroTag}>Connect • Learn • Lead</Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {step === "phone" ? "Welcome back" : "Verify your number"}
            </Text>
            <Text style={styles.cardSub}>
              {step === "phone"
                ? "Enter your mobile number to continue."
                : `We sent a code to ${sentToNumber || phoneNumber}.`}
            </Text>

            {step === "phone" ? (
              <>
                <Text style={styles.inputLabel}>Mobile Number</Text>

                <View style={styles.inputBlock}>
                  <View style={styles.inputIcon}>
                    <Phone size={18} color={Colors.ui.textSecondary} />
                  </View>

                  <TextInput
                    style={styles.inputField}
                    placeholder="054 123 4567"
                    placeholderTextColor={Colors.ui.textSecondary}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    autoFocus
                    accessibilityLabel="Enter phone number"
                    testID="login-phone"
                  />
                </View>

                {/* Stay signed in */}
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Stay signed in</Text>
                  <Switch
                    value={staySignedIn}
                    onValueChange={setStaySignedIn}
                    trackColor={{
                      false: Colors.ui.border,
                      true: Colors.palette.jade + "99",
                    }}
                    thumbColor={staySignedIn ? Colors.palette.jade : Colors.ui.surface}
                    testID="stay-signed-in"
                  />
                </View>

                <Text style={styles.helperText}>
                  We’ll text you a one-time password (OTP).
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Verification Code</Text>

                {/* OTP boxes UI */}
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.otpRow}
                  accessibilityRole="text"
                  accessibilityLabel="OTP input"
                  testID="otp-boxes"
                >
                  {otpBoxes.map((digit, index) => (
                    <View
                      key={index}
                      style={[
                        styles.otpBox,
                        digit && styles.otpBoxFilled,
                        otp.length === index && styles.otpBoxActive,
                      ]}
                    >
                      <Text style={styles.otpDigit}>{digit}</Text>
                    </View>
                  ))}
                </TouchableOpacity>

                {/* Hidden actual input */}
                <TextInput
                  style={styles.hiddenOtpInput}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={4}
                  autoFocus
                  accessibilityLabel="Enter OTP code"
                  testID="login-otp"
                />

                {/* Resend row */}
                <View style={styles.resendRow}>
                  <Text style={styles.resendText}>
                    {resendLeft > 0 ? `Resend available in ${formattedTimer}` : "Didn’t get a code?"}
                  </Text>

                  <TouchableOpacity
                    onPress={handleResend}
                    disabled={resendLeft > 0 || isLoading}
                    testID="resend-otp"
                  >
                    <Text
                      style={[
                        styles.resendLink,
                        (resendLeft > 0 || isLoading) && styles.resendLinkDisabled,
                      ]}
                    >
                      Resend
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setStep("phone")} testID="change-number">
                  <Text style={styles.changeNumber}>Change number</Text>
                </TouchableOpacity>
              </>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, isLoading && { opacity: 0.7 }]}
              disabled={isLoading}
              onPress={step === "phone" ? handleGetCode : handleVerify}
              accessibilityRole="button"
              accessibilityLabel={step === "phone" ? "Get OTP code" : "Verify and login"}
              testID="login-submit"
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.palette.ivory} />
              ) : (
                <View style={styles.buttonInner}>
                  <Text style={styles.buttonText}>
                    {step === "phone" ? "Get Code" : "Verify & Login"}
                  </Text>
                  <ArrowRight size={20} color={Colors.palette.ivory} strokeWidth={2.5} />
                </View>
              )}
            </TouchableOpacity>

            {/* Help / Support */}
            <TouchableOpacity style={styles.helpRow} testID="login-help">
              <HelpCircle size={16} color={Colors.ui.textSecondary} />
              <Text style={styles.helpText}>
                Trouble logging in? Contact TEIN Support
              </Text>
            </TouchableOpacity>

            {/* Security reassurance */}
            <View style={styles.securityRow}>
              <Lock size={14} color={Colors.ui.textSecondary} />
              <Text style={styles.securityText}>
                Your number is encrypted and never shared.
              </Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Text style={styles.footerText}>By continuing, you agree to our</Text>
          <View style={styles.footerRow}>
            <Text style={styles.footerLink}>Terms of Service</Text>
            <Text style={styles.footerText}> and </Text>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },

  gradientHalo: {
    position: "absolute",
    top: -140,
    right: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.palette.crimson + "22",
  },
  gradientHalo2: {
    position: "absolute",
    bottom: -160,
    left: -80,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: Colors.palette.jade + "1A",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  heroWrap: {
    alignItems: "center",
    marginBottom: 38,
  },
  crestWrap: {
    width: 94,
    height: 94,
    borderRadius: 32,
    backgroundColor: Colors.palette.crimson + "18",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.palette.crimson + "30",
  },
  crestInner: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: Colors.palette.crimson,
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.ui.textPrimary,
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.ui.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginTop: 4,
  },
  heroTag: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.palette.crimson,
  },

  card: {
    width: "100%",
    backgroundColor: Colors.ui.surface + "F2",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.ui.textPrimary,
  },
  cardSub: {
    fontSize: 14,
    color: Colors.ui.textSecondary,
    marginBottom: 16,
  },

  inputLabel: {
    fontWeight: "700",
    color: Colors.ui.textPrimary,
    fontSize: 14,
    marginBottom: 6,
  },

  inputBlock: {
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.ui.elevated,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    marginBottom: 6,
  },
  inputIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.ui.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  inputField: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.ui.textPrimary,
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 4,
  },
  toggleLabel: {
    color: Colors.ui.textPrimary,
    fontWeight: "700",
    fontSize: 14,
  },

  helperText: {
    color: Colors.ui.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },

  otpRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.ui.elevated,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    justifyContent: "center",
    alignItems: "center",
  },
  otpBoxFilled: {
    borderColor: Colors.palette.jade,
    backgroundColor: Colors.palette.jade + "16",
  },
  otpBoxActive: {
    borderColor: Colors.palette.crimson,
  },
  otpDigit: {
    fontSize: 20,
    color: Colors.ui.textPrimary,
    fontWeight: "800",
  },
  hiddenOtpInput: {
    opacity: 0,
    width: 1,
    height: 1,
    position: "absolute",
  },

  resendRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resendText: {
    color: Colors.ui.textSecondary,
    fontSize: 13,
  },
  resendLink: {
    color: Colors.palette.crimson,
    fontWeight: "800",
    fontSize: 13,
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },

  changeNumber: {
    fontSize: 13,
    color: Colors.palette.crimson,
    fontWeight: "700",
    marginTop: 10,
  },

  errorText: {
    marginTop: 8,
    color: Colors.palette.crimson,
    fontWeight: "600",
    fontSize: 13,
  },

  button: {
    height: 56,
    backgroundColor: Colors.palette.crimson,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    shadowColor: Colors.palette.crimson,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  buttonInner: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.palette.ivory,
    fontWeight: "800",
    fontSize: 16,
  },

  helpRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },
  helpText: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  securityRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },
  securityText: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },

  footer: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  footerRow: {
    flexDirection: "row",
  },
  footerText: {
    color: Colors.ui.textSecondary,
    fontSize: 12,
  },
  footerLink: {
    color: Colors.palette.crimson,
    fontWeight: "700",
    fontSize: 12,
  },
});
