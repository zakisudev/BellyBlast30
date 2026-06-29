import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Snackbar, Text, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatCard } from "@/components/cards/StatCard";
import { MeasurementCard } from "@/components/cards/MeasurementCard";
import { MeasurementForm } from "@/components/forms/MeasurementForm";
import { TrendChart } from "@/components/charts/TrendChart";
import { BeforeAfterSlider } from "@/components/progress/BeforeAfterSlider";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useScrollToTopOnFocus } from "@/hooks/useScrollToTopOnFocus";
import { useProgressStore } from "@/store/progressStore";
import type { AppTheme } from "@/theme/paper";
import { todayISO } from "@/utils/date";

export default function ProgressScreen() {
  const { latest, measurements, saveMeasurement } = useMeasurements();
  const photos = useProgressStore((state) => state.photos);
  const addPhoto = useProgressStore((state) => state.addPhoto);
  const theme = useTheme<AppTheme>();
  const scrollRef = useRef<ScrollView>(null);

  useScrollToTopOnFocus(scrollRef);

  const sortedPhotos = [...photos].sort((a, b) => a.date.localeCompare(b.date));
  const beforePhoto = sortedPhotos[0];
  const afterPhoto = sortedPhotos[sortedPhotos.length - 1];

  const [message, setMessage] = useState("");

  const latestWeight = latest?.weightKg ?? null;
  const latestWaist = latest?.waistCm ?? null;
  const backgroundGradient = theme.dark
    ? (["#07101A", "#0E1924", "#111C28"] as const)
    : (["#EAF4FF", "#F1FBF8", "#F7F8FF"] as const);

  const addPhotoFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage("Photo library permission is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8
    });

    if (!result.canceled && result.assets[0]?.uri) {
      addPhoto({
        id: `${Date.now()}`,
        date: todayISO(),
        uri: result.assets[0].uri,
        source: "gallery"
      });
      setMessage("Progress photo added.");
    }
  };

  const handleMeasurementSubmit = () => {
    setMessage("Measurement saved.");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient colors={backgroundGradient} style={StyleSheet.absoluteFill} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={[styles.title, theme.dark && styles.titleDark]}>
          Progress
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Track body changes, hydration, and photos across the 30-day protocol.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <StatCard
              title="Latest Weight"
              value={latestWeight !== null ? `${latestWeight} kg` : "No data"}
              icon="weight-kilogram"
              tone="teal"
            />
          </View>
          <View style={styles.summaryCol}>
            <StatCard
              title="Latest Waist"
              value={latestWaist !== null ? `${latestWaist} cm` : "No data"}
              icon="ruler-square"
              tone="amber"
            />
          </View>
        </View>

        <MeasurementCard latest={latest} />

        <MeasurementForm
          onSubmit={(entry) => {
            const error = saveMeasurement(entry);
            if (error) {
              setMessage(error);
              return;
            }
            handleMeasurementSubmit();
          }}
        />

        <View style={styles.chartsWrap}>
          <TrendChart
            title="Weight Trend (kg)"
            points={measurements.map((entry) => entry.weightKg)}
            color="#2D9A8D"
          />
          <TrendChart
            title="Waist Trend (cm)"
            points={measurements.map((entry) => entry.waistCm)}
            color="#D58E4F"
          />
        </View>

        <Text variant="titleLarge" style={[styles.sectionTitle, theme.dark && styles.titleDark]}>
          Progress Photos
        </Text>

        {beforePhoto && afterPhoto && beforePhoto.id !== afterPhoto.id ? (
          <BeforeAfterSlider
            beforeUri={beforePhoto.uri}
            afterUri={afterPhoto.uri}
            beforeLabel={beforePhoto.date}
            afterLabel={afterPhoto.date}
          />
        ) : null}

        <Text variant="bodyMedium" style={styles.action} onPress={addPhotoFromGallery}>
          + Add from Gallery
        </Text>
        <View style={styles.photoGrid}>
          {photos.map((photo) => (
            <Image key={photo.id} source={{ uri: photo.uri }} style={styles.photo} />
          ))}
        </View>

        <Snackbar visible={Boolean(message)} onDismiss={() => setMessage("")}>
          {message}
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontWeight: "800"
  },
  content: {
    padding: 18,
    paddingBottom: 120
  },
  subtitle: {
    opacity: 0.75,
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 20
  },
  titleDark: {
    color: "#EAF2F7"
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 2
  },
  summaryCol: {
    flex: 1
  },
  chartsWrap: {
    marginTop: 8
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 8
  },
  action: {
    color: "#0F8977",
    marginBottom: 10,
    fontWeight: "700"
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  photo: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 12
  }
});
