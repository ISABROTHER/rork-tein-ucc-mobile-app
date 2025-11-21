import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react-native";
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

  const handleGetCode = async () => {
    if (phoneNumber.length < 9) {
      setError("Please enter a valid phone number");
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1500);
  };

  const handleVerify = async () => {
    if (otp.length < 4) {
      setError("Please enter the 4-digit code");
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login();
      router.replace("/(tabs)/dashboard");
    }, 1500);
  };

  const otpBoxes = useMemo(() => {
    const chars = otp.split("");
    return new Array(4).fill("").map((_, i) => chars[i] ?? "");
  }, [otp]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Soft background accents (no deps) */}
      <View style={styles.bgAccentTop} />
      <View style={styles.bgAccentBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header / Branding */}
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <View style={styles.logoInner}>
                <ShieldCheck size={34} color={Colors.palette.ivory} />
              </View>
            </View>

            <Text style={styles.title}>TEIN UCC</Text>
            <Text style={styles.subtitle}>Tertiary Education Institutions Network</Text>
            <Text style={styles.tagline}>Connect. Learn. Lead.</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {step === "phone" ? "Welcome back" : "Verify your number"}
            </Text>
            <Text style={styles.cardSub}>
              {step === "phone"
                ? "Enter your mobile number to continue."
                : "We sent a 4-digit code to your phone."}
            </Text>

            {step === "phone" ? (
              <>
                <Text style={styles.label}>Mobile number</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconWrap}>
                    <Phone size={18} color={Colors.ui.textSecondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="054 123 4567"
                    placeholderTextColor={Colors.ui.textSecondary}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    autoFocus
                    testID="login-phone"
                  />
                </View>

                <Text style={styles.helperText}>
                  We’ll send you a one-time password (OTP).
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.label}>Verification code</Text>

                {/* 4-box visual OTP (single input for safety) */}
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {}}
                  style={styles.otpRow}
                  accessibilityRole="text"
                >
                  {otpBoxes.map((digit, i) => (
                    <View
                      key={`otp-box-${i}`}
                      style={[
                        styles.otpBox,
                        digit && styles.otpBoxFilled,
                        otp.length === i && styles.otpBoxActive,
                      ]}
                    >
                      <Text style={styles.otpDigit}>{digit}</Text>
                    </View>
                  ))}
                </TouchableOpacity>

                <TextInput
                  style={styles.hiddenOtpInput}
                  placeholder="1234"
                  placeholderTextColor="transparent"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={4}
                  autoFocus
                  testID="login-otp"
                />

                <TouchableOpacity onPress={() => setStep("phone")} testID="change-number">
                  <Text style={styles.changeNumber}>Change number</Text>
                </TouchableOpacity>
              </>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={step === "phone" ? handleGetCode : handleVerify}
              disabled={isLoading}
              testID="login-submit"
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.palette.ivory} />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>
                    {step === "phone" ? "Get Code" : "Verify & Login"}
                  </Text>
                  <ArrowRight size={18} color={Colors.palette.ivory} strokeWidth={2.5} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
          <Text style={styles.footerText}>By continuing, you agree to our</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Text style={styles.footerText}> and </Text>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ui.background, // keep your system background
  },
  keyboardView: {
    flex: 1,
  },

  /* Background accents */
  bgAccentTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.palette.crimson + "14",
  },
  bgAccentBottom: {
    position: "absolute",
    bottom: -140,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.palette.jade + "12",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    gap: 18,
  },

  header: {
    alignItems: "center",
    marginBottom: 8,
  },
  logoWrap: {
    width: 88,
    height: 88,
    borderRadius: 26,
    backgroundColor: Colors.palette.crimson + "18",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.palette.crimson + "2A",
  },
  logoInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.palette.crimson,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.ui.textPrimary,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.ui.textSecondary,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  tagline: {
    fontSize: 14,
    color: Colors.palette.crimson,
    fontWeight: "600",
    marginTop: 6,
  },

  /* Card */
  card: {
    width: "100%",
    backgroundColor: Colors.ui.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    padding: 18,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.ui.textPrimary,
  },
  cardSub: {
    fontSize: 13,
    color: Colors.ui.textSecondary,
    marginBottom: 4,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.ui.textPrimary,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: Colors.ui.elevated,
    borderRadius: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  inputIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.ui.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.ui.textPrimary,
    letterSpacing: 0.5,
  },

  helperText: {
    fontSize: 12,
    color: Colors.ui.textSecondary,
    marginTop: 6,
    lineHeight: 18,
  },

  /* OTP boxes */
  otpRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginTop: 2,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.ui.elevated,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxFilled: {
    borderColor: Colors.palette.jade,
    backgroundColor: Colors.palette.jade + "12",
  },
  otpBoxActive: {
    borderColor: Colors.palette.crimson,
  },
  otpDigit: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.ui.textPrimary,
  },
  hiddenOtpInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },

  changeNumber: {
    fontSize: 13,
    color: Colors.palette.crimson,
    fontWeight: "700",
    marginTop: 8,
  },

  errorText: {
    fontSize: 13,
    color: Colors.palette.crimson,
    marginTop: 2,
    fontWeight: "600",
  },

  button: {
    height: 56,
    backgroundColor: Colors.palette.crimson,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: Colors.palette.crimson,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.palette.ivory,
    letterSpacing: 0.3,
  },

  footer: {
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: Colors.ui.textSecondary,
  },
  footerLinks: {
    flexDirection: "row",
  },
  linkText: {
    fontSize: 12,
    color: Colors.palette.crimson,
    fontWeight: "700",
  },
});
 