import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface AnswerScreenProps {
  game: any;
  gameId: Id<"games">;
}

export default function AnswerScreen({ game, gameId }: AnswerScreenProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const updateGamePhase = useMutation(api.games.updateGamePhase);

  const handleDistributePoints = async () => {
    await updateGamePhase({ gameId, phase: "jury" });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "diep": return "#F59E0B";
      case "dieper": return "#3B82F6";
      case "diepst": return "#EF4444";
      default: return "#F59E0B";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RONDE {game.currentRound}</Text>
      </View>

      <View style={styles.content}>
        {game.currentQuestion && (
          <>
            <View style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(game.currentQuestion.difficulty) }
            ]}>
              <Text style={styles.difficultyText}>
                {game.currentQuestion.difficulty.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.questionText}>
              {game.currentQuestion.thirdPerson}
            </Text>
          </>
        )}

        <Text style={styles.instructionText}>
          Lees de antwoorden van de andere spelers
        </Text>

        <TouchableOpacity
          style={styles.answerCard}
          onPress={() => setShowAnswer(!showAnswer)}
        >
          <Text style={styles.answerCardText}>
            {showAnswer && game.currentQuestion?.answer
              ? game.currentQuestion.answer
              : "Bekijk antwoord van de Kameraad"
            }
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.distributeButton} onPress={handleDistributePoints}>
          <Text style={styles.distributeButtonText}>VERDEEL PUNTEN</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyBadge: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  answerCard: {
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerCardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
  },
  distributeButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  distributeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});