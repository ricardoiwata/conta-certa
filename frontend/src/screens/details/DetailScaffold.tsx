import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton, Text } from "react-native-paper";

interface DetailScaffoldProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function DetailScaffold({
  title,
  description,
  children,
}: DetailScaffoldProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 48,
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <IconButton
            icon="arrow-left"
            mode="contained-tonal"
            size={24}
            onPress={() => router.back()}
          />
          <View style={{ flex: 1 }}>
            <Text variant="titleLarge" style={{ fontWeight: "700" }}>
              {title}
            </Text>
            {description ? (
              <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
                {description}
              </Text>
            ) : null}
          </View>
        </View>

        {children}
      </ScrollView>
    </View>
  );
}
