import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState, type ComponentProps } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";

import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { ONBOARDING_COMPLETED_KEY, markOnboardingCompletedInSession } from "@/constants/onboarding";
import type { AppTheme } from "@/theme/paper";

type OnboardingIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface OnboardingPage {
  eyebrow: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  icon: OnboardingIcon;
  accent: string;
}

const pages: OnboardingPage[] = [
  {
    eyebrow: "Move daily",
    title: "Turn every workout into visible momentum.",
    subtitle: "Follow simple daily actions designed to keep your body moving and your energy high.",
    metric: "+1,012",
    metricLabel: "Steps logged",
    icon: "run-fast",
    accent: "#58D1C1"
  },
  {
    eyebrow: "Stay consistent",
    title: "Build a streak that feels easy to protect.",
    subtitle: "See what is next, keep habits in rhythm, and never lose sight of your 30 day goal.",
    metric: "18",
    metricLabel: "Day streak",
    icon: "calendar-check",
    accent: "#B7F500"
  },
  {
    eyebrow: "Track progress",
    title: "Celebrate the changes that compound over time.",
    subtitle:
      "Review your wins, spot trends, and keep pushing with progress that is clear at a glance.",
    metric: "88",
    metricLabel: "Score now",
    icon: "chart-timeline-variant",
    accent: "#67C7EB"
  }
];

export default function OnboardingScreen() {
  const theme = useTheme<AppTheme>();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastPage = activeIndex === pages.length - 1;
  const backgroundColors = theme.dark
    ? (["#061018", "#0B1620", "#111C28"] as const)
    : (["#E8F7F4", "#EEF6FF", "#FFF8F1"] as const);

  const completeOnboarding = async () => {
    markOnboardingCompletedInSession();

    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    } finally {
      router.replace("/login" as never);
    }
  };

  const handleNext = () => {
    if (isLastPage) {
      void completeOnboarding();
      return;
    }

    scrollRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(Math.min(Math.max(nextIndex, 0), pages.length - 1));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LinearGradient colors={backgroundColors} style={StyleSheet.absoluteFill} />
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.topBar}>
        <Text variant="titleMedium" style={[styles.brand, theme.dark && styles.textDark]}>
          BellyBlast 30
        </Text>
        <Pressable
          onPress={() => {
            void completeOnboarding();
          }}
          hitSlop={12}
          style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}
        >
          <Text variant="labelLarge" style={styles.skipText}>
            Skip
          </Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {pages.map((page) => (
          <View key={page.title} style={[styles.page, { width }]}>
            <HeroCard page={page} dark={theme.dark} />
            <View style={styles.copy}>
              <Text variant="labelLarge" style={styles.eyebrow}>
                {page.eyebrow}
              </Text>
              <Text variant="displaySmall" style={[styles.title, theme.dark && styles.textDark]}>
                {page.title}
              </Text>
              <Text
                variant="bodyLarge"
                style={[styles.subtitle, theme.dark && styles.subtitleDark]}
              >
                {page.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.indicators} accessibilityRole="tablist">
          {pages.map((page, index) => {
            const active = index === activeIndex;

            return (
              <View
                key={page.eyebrow}
                style={[
                  styles.indicator,
                  active && styles.activeIndicator,
                  active && { backgroundColor: page.accent }
                ]}
              />
            );
          })}
        </View>

        <GradientButton
          label={isLastPage ? "Start your journey" : "Continue"}
          onPress={handleNext}
          showLoadingOnPress={isLastPage}
        />
      </View>
    </SafeAreaView>
  );
}

function HeroCard({ page, dark }: { page: OnboardingPage; dark: boolean }) {
  return (
    <GlassCard padding={18} tint={dark ? "rgba(10, 20, 29, 0.82)" : "rgba(255, 255, 255, 0.76)"}>
      <View style={styles.hero}>
        <LinearGradient
          colors={["rgba(88, 209, 193, 0.92)", "rgba(103, 199, 235, 0.78)"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.heroGradient}
        >
          <View style={styles.phoneFrame}>
            <View style={styles.phoneHeader}>
              <View style={styles.phonePill} />
              <Text variant="labelSmall" style={styles.phoneTime}>
                9:41
              </Text>
            </View>
            <View style={[styles.iconBubble, { backgroundColor: page.accent }]}>
              <MaterialCommunityIcons name={page.icon} size={42} color="#061018" />
            </View>
            <Text variant="headlineMedium" style={styles.metric}>
              {page.metric}
            </Text>
            <Text variant="labelLarge" style={styles.metricLabel}>
              {page.metricLabel}
            </Text>
            <View style={styles.miniGraph}>
              <View style={[styles.graphBar, styles.graphOne]} />
              <View style={[styles.graphBar, styles.graphTwo]} />
              <View style={[styles.graphBar, styles.graphThree]} />
              <View style={[styles.graphBar, styles.graphFour]} />
            </View>
          </View>
        </LinearGradient>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  brand: {
    color: "#10212D",
    fontWeight: "900"
  },
  skipButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.16)"
  },
  skipText: {
    color: "#29AA97",
    fontWeight: "800"
  },
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    justifyContent: "center",
    gap: 26
  },
  hero: {
    minHeight: 330,
    borderRadius: 30,
    overflow: "hidden"
  },
  heroGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  phoneFrame: {
    width: "76%",
    maxWidth: 250,
    minHeight: 278,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.28)",
    backgroundColor: "rgba(6, 16, 24, 0.92)",
    alignItems: "center",
    padding: 18,
    shadowColor: "#031016",
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 14
    },
    elevation: 9
  },
  phoneHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22
  },
  phonePill: {
    width: 60,
    height: 16,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.08)"
  },
  phoneTime: {
    color: "#EAF2F7",
    fontWeight: "800"
  },
  iconBubble: {
    width: 92,
    height: 92,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    transform: [{ rotate: "-6deg" }]
  },
  metric: {
    color: "#FFFFFF",
    fontWeight: "900"
  },
  metricLabel: {
    color: "#AFC4D2",
    fontWeight: "800",
    marginTop: 4
  },
  miniGraph: {
    height: 54,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 22
  },
  graphBar: {
    width: 18,
    borderRadius: 999,
    backgroundColor: "#B7F500"
  },
  graphOne: {
    height: 22,
    opacity: 0.52
  },
  graphTwo: {
    height: 34,
    opacity: 0.72
  },
  graphThree: {
    height: 46
  },
  graphFour: {
    height: 28,
    opacity: 0.64
  },
  copy: {
    gap: 10
  },
  eyebrow: {
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "#29AA97",
    fontWeight: "900"
  },
  title: {
    color: "#10212D",
    fontWeight: "900",
    lineHeight: 44
  },
  subtitle: {
    color: "#4B6578",
    lineHeight: 23
  },
  subtitleDark: {
    color: "#AEC1CF"
  },
  textDark: {
    color: "#ECF4F8"
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 18
  },
  indicators: {
    height: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  indicator: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: "rgba(128, 147, 163, 0.36)"
  },
  activeIndicator: {
    width: 34
  },
  glowOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    top: 72,
    right: -80,
    backgroundColor: "rgba(79, 214, 197, 0.24)"
  },
  glowTwo: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    bottom: 84,
    left: -96,
    backgroundColor: "rgba(66, 145, 235, 0.18)"
  },
  pressed: {
    opacity: 0.72
  }
});
