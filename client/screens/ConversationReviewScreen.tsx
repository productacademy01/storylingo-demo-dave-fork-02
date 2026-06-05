import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, StoryBuddyColors, Typography } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { ConversationMessage } from "@/context/ProgressContext";
import { useLanguage } from "@/context/LanguageContext";
import { getApiUrl } from "@/lib/query-client";

function ChatBubble({
  message,
  storyImage,
  index,
  translation,
}: {
  message: ConversationMessage;
  storyImage: any;
  index: number;
  translation?: string;
}) {
  const isAI = message.role === "ai";

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      style={[styles.bubbleRow, isAI ? styles.bubbleRowAI : styles.bubbleRowUser]}
    >
      {isAI && (
        <Image source={storyImage} style={styles.bubbleAvatar} resizeMode="cover" />
      )}
      <View
        style={[
          styles.bubble,
          isAI ? styles.bubbleAI : styles.bubbleUser,
        ]}
      >
        <Text style={[styles.bubbleText, isAI ? styles.bubbleTextAI : styles.bubbleTextUser]}>
          {message.text}
        </Text>
        {translation && (
          <Text style={styles.bubbleTranslation}>{translation}</Text>
        )}
      </View>
    </Animated.View>
  );
}

export default function ConversationReviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "ConversationReview">>();
  const { story, transcript } = route.params;
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Record<number, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (language !== "es") return;
    const aiMessages = transcript
      .map((m, i) => ({ index: i, text: m.text }))
      .filter((m) => transcript[m.index].role === "ai");
    if (aiMessages.length === 0) return;

    setIsTranslating(true);
    const baseUrl = getApiUrl();
    fetch(new URL("/api/translate", baseUrl).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: aiMessages.map((m) => m.text) }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.translations) {
          const map: Record<number, string> = {};
          aiMessages.forEach((m, i) => {
            map[m.index] = data.translations[i];
          });
          setTranslations(map);
        }
      })
      .catch((e) => console.error("Translation fetch failed:", e))
      .finally(() => setIsTranslating(false));
  }, [language, transcript]);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.replace("StorySelection");
  };

  return (
    <LinearGradient
      colors={["#1A1030", "#2D1B4E", "#1A1030"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Animated.View entering={FadeInUp.springify()}>
          <ThemedText style={styles.headerTitle}>Review your conversation</ThemedText>
          <ThemedText style={styles.headerSubtitle}>{story.title}</ThemedText>
          {isTranslating && (
            <View style={styles.translatingRow}>
              <ActivityIndicator size="small" color="rgba(255,255,255,0.5)" />
              <ThemedText style={styles.translatingText}>Loading translations…</ThemedText>
            </View>
          )}
        </Animated.View>
      </View>

      {transcript.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="message-circle" size={48} color="rgba(255,255,255,0.3)" />
          <ThemedText style={styles.emptyText}>No conversation to review.</ThemedText>
          <ThemedText style={styles.emptySubtext}>Try starting a story and chatting!</ThemedText>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {transcript.map((message, index) => (
            <ChatBubble
              key={index}
              message={message}
              storyImage={story.image}
              index={index}
              translation={translations[index]}
            />
          ))}
        </ScrollView>
      )}

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <Pressable onPress={handleContinue} style={styles.continueButton}>
          <LinearGradient
            colors={[StoryBuddyColors.primary, "#FF8FB3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>CONTINUE</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.5)",
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.3)",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  bubbleRowAI: {
    justifyContent: "flex-start",
    paddingRight: Spacing["4xl"],
  },
  bubbleRowUser: {
    justifyContent: "flex-end",
    paddingLeft: Spacing["4xl"],
  },
  bubbleAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  bubble: {
    maxWidth: "80%",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  bubbleAI: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderBottomLeftRadius: BorderRadius.xs,
  },
  bubbleUser: {
    backgroundColor: StoryBuddyColors.primary,
    borderBottomRightRadius: BorderRadius.xs,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextAI: {
    color: "#FFFFFF",
  },
  bubbleTextUser: {
    color: "#FFFFFF",
  },
  bubbleTranslation: {
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(255,255,255,0.55)",
    marginTop: Spacing.xs,
    fontStyle: "italic",
  },
  translatingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  translatingText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    backgroundColor: "rgba(26,16,48,0.95)",
  },
  continueButton: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    shadowColor: StoryBuddyColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueGradient: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
  continueText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});
