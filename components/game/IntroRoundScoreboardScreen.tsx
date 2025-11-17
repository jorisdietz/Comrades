import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface IntroRoundScoreboardScreenProps {
  game: any;
  gameId: Id<"games">;
}

export default function IntroRoundScoreboardScreen({ game, gameId }: IntroRoundScoreboardScreenProps) {
  const nextIntroRoundTurn = useMutation(api.games.nextIntroRoundTurn);

  const handleNextPlayer = async () => {
    await nextIntroRoundTurn({ gameId });
  };

  // Sort players by score (descending)
  const sortedPlayers = game.players
    .map((player: string) => ({
      name: player,
      score: game.scores[player] || 0,
    }))
    .sort((a: any, b: any) => b.score - a.score);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIBING RONDE</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.scoreboardTitle}>SCOREBOARD</Text>

        <View style={styles.playersContainer}>
          {sortedPlayers.map((player: any, index: number) => (
            <View key={player.name} style={styles.playerRow}>
              <Text style={styles.playerRank}>{index + 1}</Text>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>{player.score}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPlayer}>
          <Text style={styles.nextButtonText}>VOLGENDE KAMERAAD</Text>
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
  },
  scoreboardTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
  },
  playersContainer: {
    flex: 1,
    gap: 16,
  },
  playerRow: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerRank: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    width: 40,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scoreContainer: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: 24,
  },
  nextButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});