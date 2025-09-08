import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Button as PaperButton, Text as PaperText } from "react-native-paper";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { welcomeStyles as styles } from "../styles/welcome.styles";
import { useAppTheme } from "../theme/provider";

export default function WelcomeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Meio da tela */}
      <View style={styles.middle}>
        <Animated.Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          entering={ZoomIn.duration(600)}
        />
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <PaperText
            variant="titleLarge"
            style={[styles.title, { color: colors.primary }]}
          >
            O app que te auxilia na sua vida financeira
          </PaperText>
        </Animated.View>
      </View>

      {/* Ações embaixo */}
      <View style={styles.actions}>
        <PaperButton
          mode="contained"
          onPress={() => router.push("/login")}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Login
        </PaperButton>

        <View style={{ height: 12 }} />

        <PaperButton
          mode="contained-tonal"
          onPress={() => router.push("/signup")}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Crie uma conta
        </PaperButton>
      </View>
    </View>
  );
}
