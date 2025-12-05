import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowRight, Mail, Lock, User } from "lucide-react-native";

import Colors from "@/constants/colors";
import { useAppState } from "@/contexts/app-state";

type Mode = "login" | "signup";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAppState();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isSignup = mode === "signup";

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (isSignup && (!fullName.trim() || !confirmPassword.trim())) return false;
    return true;
  }, [email, password, confirmPassword, fullName, isSignup]);

  const validate = () => {
    const cleanedEmail = email.trim().toLowerCase();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail);
    if (!emailOk) return "Please enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (isSignup) {
      if (fullName.trim().length < 2) return "Please enter your full name.";
      if (confirmPassword !== password) return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setError(null);
    setIsLoading(true);

    // Rork demo flow: simulate auth, then set local auth state.
    setTimeout(() => {
      setIsLoading(false);
      login();
      router.replace("/(tabs)/dashboard");
    }, 900);
  };

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>TEIN UCC</Text>
            </View>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>
              {isSignup ? "Create your member account to get started." : "Sign in with your email to continue."}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.modeRow}>
              <TouchableOpacity
                onPress={() => setMode("login")}
                style={[styles.modeBtn, mode === "login" && styles.modeBtnActive]}
                accessibilityRole="button"
              >
                <Text style={[styles.modeText, mode === "login" && styles.modeTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode("signup")}
                style={[styles.modeBtn, mode === "signup" && styles.modeBtnActive]}
                accessibilityRole="button"
              >
                <Text style={[styles.modeText, mode === "signup" && styles.modeTextActive]}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {isSignup && (
              <View style={styles.inputWrap}>
                <View style={styles.inputIcon}>
                  <User size={18} color={Colors.palette.slate} />
                </View>
                <TextInput
                  placeholder="Full name"
                  placeholderTextColor={Colors.palette.slate}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  style={styles.input}
                />
              </View>
            )}

            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <Mail size={18} color={Colors.palette.slate} />
              </View>
              <TextInput
                placeholder="Email address"
                placeholderTextColor={Colors.palette.slate}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrap}>
              <View style={styles.inputIcon}>
                <Lock size={18} color={Colors.palette.slate} />
              </View>
              <TextInput
                placeholder="Password"
                placeholderTextColor={Colors.palette.slate}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
            </View>

            {isSignup && (
              <View style={styles.inputWrap}>
                <View style={styles.inputIcon}>
                  <Lock size={18} color={Colors.palette.slate} />
                </View>
                <TextInput
                  placeholder="Confirm password"
                  placeholderTextColor={Colors.palette.slate}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            )}

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canSubmit || isLoading}
              style={[styles.submitBtn, (!canSubmit || isLoading) && styles.submitBtnDisabled]}
              accessibilityRole="button"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitText}>{isSignup ? "Create account" : "Login"}</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {!isSignup && (
              <TouchableOpacity onPress={() => setMode("signup")} style={styles.linkBtn}>
                <Text style={styles.linkText}>New here? Create an account</Text>
              </TouchableOpacity>
            )}
            {isSignup && (
              <TouchableOpacity onPress={() => setMode("login")} style={styles.linkBtn}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.footer}>By continuing, you agree to TEIN UCC community guidelines.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 32,
    justifyContent: "center",
  },
  hero: {
    alignItems: "center",
    marginBottom: 18,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: Colors.palette.crimson,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: {
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.ui.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.ui.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.ui.elevated,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  modeRow: {
    flexDirection: "row",
    backgroundColor: Colors.ui.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 9,
  },
  modeBtnActive: {
    backgroundColor: Colors.palette.charcoal,
  },
  modeText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.ui.textSecondary,
  },
  modeTextActive: {
    color: "#FFFFFF",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },
  inputIcon: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 15,
    color: Colors.ui.textPrimary,
  },
  errorText: {
    marginTop: 10,
    color: Colors.palette.crimson,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  submitBtn: {
    marginTop: 14,
    backgroundColor: Colors.palette.crimson,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  linkBtn: {
    marginTop: 12,
    alignItems: "center",
  },
  linkText: {
    color: Colors.palette.ocean,
    fontWeight: "700",
    fontSize: 14,
  },
  footer: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 12,
    color: Colors.ui.textSecondary,
  },
});
