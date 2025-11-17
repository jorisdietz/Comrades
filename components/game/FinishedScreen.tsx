import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

interface FinishedScreenProps {
  game: any;
}

export default function FinishedScreen({ game }: FinishedScreenProps) {
  const handleNewGame = () => {
    router.replace("/");
  };

  // Sort players by score (descending)
  const sortedPlayers = game.players
    .map((player: string) => ({
      name: player,
      score: game.scores[player] || 0,
    }))
    .sort((a: any, b: any) => b.score - a.score);

  const winner = sortedPlayers[0];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.gameOverTitle}>SPEL AFGELOPEN</Text>
        
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerLabel}>Winnaar:</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerScore}>{winner.score} punten</Text>
        </View>

        <View style={styles.finalScoresContainer}>
          <Text style={styles.finalScoresTitle}>Eindstand:</Text>
          {sortedPlayers.map((player: any, index: number) => (
            <View key={player.name} style={styles.finalPlayerRow}>
              <Text style={styles.finalPlayerRank}>{index + 1}.</Text>
              <Text style={styles.finalPlayerName}>{player.name}</Text>
              <Text style={styles.finalPlayerScore}>{player.score}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
          <Text style={styles.newGameButtonText}>NIEUW SPEL</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
  },
  winnerContainer: {
    alignItems: 'center',
    marginBottom: 48,
    padding: 24,
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    width: '100%',
  },
  winnerLabel: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  winnerName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  winnerScore: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  finalScoresContainer: {
    width: '100%',
    marginBottom: 48,
  },
  finalScoresTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  finalPlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  finalPlayerRank: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 30,
  },
  finalPlayerName: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginLeft: 16,
  },
  finalPlayerScore: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newGameButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});