import React, { useState } from "react";
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
    // Simulate API call
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
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      login();
      router.replace("/(tabs)/dashboard");
    }, 1500);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header / Branding */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <ShieldCheck size={40} color={Colors.palette.crimson} />
            </View>
            <Text style={styles.title}>TEIN UCC</Text>
            <Text style={styles.subtitle}>Tertiary Education Institutions Network</Text>
            <Text style={styles.tagline}>Connect. Learn. Lead.</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {step === "phone" ? (
              <>
                <Text style={styles.label}>Enter your mobile number</Text>
                <View style={styles.inputWrapper}>
                  <Phone size={20} color={Colors.palette.slate} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="054 123 4567"
                    placeholderTextColor={Colors.palette.slate}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    autoFocus
                  />
                </View>
                <Text style={styles.helperText}>
                  We&apos;ll send you a one-time password to verify your identity.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.label}>Enter verification code</Text>
                <View style={styles.inputWrapper}>
                  <ShieldCheck size={20} color={Colors.palette.slate} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="1234"
                    placeholderTextColor={Colors.palette.slate}
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={4}
                    autoFocus
                  />
                </View>
                <TouchableOpacity onPress={() => setStep("phone")}>
                  <Text style={styles.changeNumber}>Change number</Text>
                </TouchableOpacity>
              </>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={styles.button}
              onPress={step === "phone" ? handleGetCode : handleVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>
                    {step === "phone" ? "Get Code" : "Verify & Login"}
                  </Text>
                  <ArrowRight size={20} color="#FFF" strokeWidth={2.5} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
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
    backgroundColor: "#FFFFFF", // Explicitly white as requested
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.palette.charcoal,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.palette.slate,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: Colors.palette.crimson,
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.palette.charcoal,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: Colors.ui.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.palette.charcoal,
  },
  helperText: {
    fontSize: 13,
    color: Colors.palette.slate,
    marginLeft: 4,
    lineHeight: 18,
  },
  changeNumber: {
    fontSize: 14,
    color: Colors.palette.crimson,
    fontWeight: "600",
    marginLeft: 4,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: Colors.palette.crimson,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  button: {
    height: 56,
    backgroundColor: Colors.palette.crimson,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    shadowColor: Colors.palette.crimson,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 12,
    color: Colors.palette.slate,
  },
  footerLinks: {
    flexDirection: "row",
  },
  linkText: {
    fontSize: 12,
    color: Colors.palette.crimson,
    fontWeight: "600",
  },
});
