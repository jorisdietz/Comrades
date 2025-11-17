import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface IntroRoundStartScreenProps {
  game: any;
  gameId: Id<"games">;
}

export default function IntroRoundStartScreen({ game, gameId }: IntroRoundStartScreenProps) {
  const updateGamePhase = useMutation(api.games.updateGamePhase);
  const resetIntroRoundQuestions = useMutation(api.games.resetIntroRoundQuestions);

  const handleStartGame = async () => {
    try {
      // Reset vibing questions to ensure fresh start
      await resetIntroRoundQuestions({ gameId });
      // Start the IntroRound
      await updateGamePhase({ gameId, phase: "intro_round_input" });
    } catch (error) {
      console.error("Error starting IntroRound:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIBING RONDE</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.explanationText}>
          We beginnen met de vibing ronde om op te warmen. Iedereen krijgt een vraag over hun favoriete dingen in de wereld. Terwijl een Kameraad aan de beurt is om te antwoorden, moeten de andere spelers dat antwoord raden.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>START SPEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    backgroundColor: '#374151',
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  explanationText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  footer: {
    padding: 24,
  },
  startButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});