import { useRorkAgent } from "@rork-ai/toolkit-sdk";
import { ArrowUpRight, Bot, XCircle } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const { messages, error, sendMessage } = useRorkAgent({ tools: {} });

  const disabled = pending || input.trim().length === 0;

  const renderedMessages = useMemo(() => messages.slice().reverse(), [messages]);

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={64}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Bot color={Colors.palette.crimson} size={22} />
          <Text style={styles.headerTitle}>TEIN Assistant</Text>
        </View>
        <Text style={styles.headerMeta}>Policy explainer · QR intelligence</Text>
      </View>
      <ScrollView style={styles.messages} contentContainerStyle={{ paddingBottom: 16 }} testID="assistant-messages">
        {renderedMessages.map((message) => (
          <View
            key={message.id}
            style={[styles.bubble, message.role === "user" ? styles.bubbleUser : styles.bubbleAssistant]}
          >
            {message.parts.map((part, index) => (
              <Text key={`${message.id}-${index}`} style={[styles.bubbleText, message.role === "user" && styles.bubbleTextUser]}>
                {part.type === "text" ? part.text : JSON.stringify(part)}
              </Text>
            ))}
          </View>
        ))}
        {error && (
          <View style={styles.errorBanner}>
            <XCircle color={Colors.palette.amber} />
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        )}
      </ScrollView>
      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TextInput
          style={styles.input}
          placeholder="Ask for TEIN history, QR usage, policy explainer..."
          placeholderTextColor={Colors.ui.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
          testID="assistant-input"
        />
        <TouchableOpacity
          style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
          disabled={disabled}
          onPress={() => {
            if (disabled) {
              return;
            }
            const payload = `You are the TEIN UCC assistant. Respond with Ghanaian context, political education and TEIN mission clarity. Question: ${input.trim()}`;
            setPending(true);
            Promise.resolve(sendMessage(payload)).finally(() => setPending(false));
            setInput("");
          }}
          testID="assistant-send"
        >
          <ArrowUpRight color={Colors.palette.ivory} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.ui.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: Colors.ui.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
  headerMeta: {
    color: Colors.ui.textSecondary,
    marginTop: 4,
  },
  messages: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bubble: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    maxWidth: "90%",
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: Colors.palette.crimson,
  },
  bubbleAssistant: {
    alignSelf: "flex-start",
    backgroundColor: Colors.ui.surface,
    borderWidth: 1,
    borderColor: Colors.ui.border,
  },
  bubbleText: {
    color: Colors.ui.textPrimary,
  },
  bubbleTextUser: {
    color: Colors.palette.ivory,
  },
  composer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.ui.border,
    backgroundColor: Colors.ui.surface,
  },
  input: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.ui.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.ui.textPrimary,
    backgroundColor: Colors.ui.elevated,
    maxHeight: 120,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.palette.jade,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,183,3,0.1)",
  },
  errorText: {
    color: Colors.palette.amber,
    flex: 1,
  },
});
