import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface IntroRoundJuryScreenProps {
  game: any;
  gameId: Id<"games">;
}

export default function IntroRoundJuryScreen({ game, gameId }: IntroRoundJuryScreenProps) {
  const [playerScores, setPlayerScores] = useState<Record<string, number>>({});
  const updateScores = useMutation(api.games.updateScores);
  const updateGamePhase = useMutation(api.games.updateGamePhase);

  const currentPlayer = game.players[game.currentPlayerIndex];
  const otherPlayers = game.players.filter((p: string) => p !== currentPlayer);
  
  // IntroRound: Kameraad gets 5 points, can allocate 5 points total
  const getRewardPoints = () => 5;
  const getAvailablePoints = () => 5;

  const getAllocatedPoints = () => {
    return Object.values(playerScores).reduce((sum: number, score: number) => sum + score, 0);
  };

  const updatePlayerScore = (player: string, change: number) => {
    const currentScore = playerScores[player] || 0;
    const newScore = Math.max(0, currentScore + change);
    setPlayerScores(prev => ({
      ...prev,
      [player]: newScore,
    }));
  };

  const handleFinish = async () => {
    const allocatedPoints = getAllocatedPoints();
    const availablePoints = getAvailablePoints();
    
    // This check is now redundant since button is disabled, but keeping for safety
    if (allocatedPoints !== availablePoints) {
      Alert.alert(
        "Punten verdeling",
        `Je moet precies ${availablePoints} punten verdelen. Je hebt nu ${allocatedPoints} punten verdeeld.`
      );
      return;
    }

    // Add reward points for the current player
    const finalScores = {
      ...playerScores,
      [currentPlayer]: getRewardPoints(),
    };

    await updateScores({ gameId, playerScores: finalScores });
    await updateGamePhase({ gameId, phase: "intro_round_scoreboard" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIBING RONDE</Text>
      </View>

      <View style={styles.content}>
        {game.currentQuestion && (
          <>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>VIBING</Text>
            </View>

            <Text style={styles.questionText}>
              {game.currentQuestion.thirdPerson}
            </Text>
          </>
        )}

        <Text style={styles.instructionText}>
          Welke spelers hebben het beste geraden?
        </Text>

        <View style={styles.playersContainer}>
          {/* Current player (Kameraad) gets reward points */}
          <View style={styles.playerCard}>
            <Text style={styles.playerName}>{currentPlayer}</Text>
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardText}>+{getRewardPoints()}</Text>
            </View>
          </View>

          {/* Other players can receive points */}
          {otherPlayers.map((player: string) => (
            <View key={player} style={styles.playerCard}>
              <Text style={styles.playerName}>{player}</Text>
              <View style={styles.scoreControls}>
                <TouchableOpacity
                  style={styles.scoreButton}
                  onPress={() => updatePlayerScore(player, -1)}
                >
                  <Text style={styles.scoreButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.scoreDisplay}>
                  <Text style={styles.scoreText}>{playerScores[player] || 0}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.scoreButton, styles.addButton]}
                  onPress={() => updatePlayerScore(player, 1)}
                >
                  <Text style={styles.scoreButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.pointsStatus}>
          <Text style={styles.pointsStatusText}>
            Je hebt
          </Text>
          <Text style={styles.pointsNumbers}>
            {getAllocatedPoints()} / {getAvailablePoints()}
          </Text>
          <Text style={styles.pointsStatusText}>
            punten verdeeld
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.finishButton, 
            getAllocatedPoints() !== getAvailablePoints() && styles.finishButtonDisabled
          ]} 
          onPress={handleFinish}
          disabled={getAllocatedPoints() !== getAvailablePoints()}
        >
          <Text style={[
            styles.finishButtonText,
            getAllocatedPoints() !== getAvailablePoints() && styles.finishButtonTextDisabled
          ]}>
            KLAAR
          </Text>
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
  difficultyBadge: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  difficultyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  playersContainer: {
    flex: 1,
    gap: 12,
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  rewardBadge: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rewardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#F59E0B',
  },
  scoreButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreDisplay: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  scoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsStatus: {
    alignItems: 'center',
    marginTop: 24,
  },
  pointsStatusText: {
    color: 'white',
    fontSize: 16,
  },
  pointsNumbers: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  footer: {
    padding: 24,
  },
  finishButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  finishButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finishButtonTextDisabled: {
    color: '#9CA3AF',
  },
});