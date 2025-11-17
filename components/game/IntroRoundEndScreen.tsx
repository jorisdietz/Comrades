import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface IntroRoundEndScreenProps {
  game: any;
  gameId: Id<"games">;
}

export default function IntroRoundEndScreen({ game, gameId }: IntroRoundEndScreenProps) {
  const startMainGame = useMutation(api.games.startMainGame);

  const handleStartMainGame = async () => {
    await startMainGame({ gameId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RONDE 1</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.explanationText}>
          Dat was de Vibing ronde. Nu begint het echte spel! Om de beurt kiest iedereen een categorie van persoonlijke vragen. Openheid wordt beloond! Terwijl een Kameraad aan de beurt is om te antwoorden, moeten de andere spelers dat antwoord raden.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartMainGame}>
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