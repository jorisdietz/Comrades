import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface LevelScreenProps {
  game: any;
  gameId: Id<"games">;
}

export default function LevelScreen({ game, gameId }: LevelScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"diep" | "dieper" | "diepst" | null>(null);
  
  const updateGamePhase = useMutation(api.games.updateGamePhase);
  const setCurrentQuestion = useMutation(api.games.setCurrentQuestion);
  const markQuestionAsUsed = useMutation(api.questions.markQuestionAsUsed);

  // Get a random question for the selected difficulty
  const randomQuestion = useQuery(
    api.questions.getRandomQuestionForGame,
    selectedDifficulty ? { gameId, difficulty: selectedDifficulty } : "skip"
  );

  const currentPlayer = game.players[game.currentPlayerIndex];

  const handleLevelSelect = async (difficulty: "diep" | "dieper" | "diepst") => {
    try {
      // First set the selected difficulty to trigger the query
      setSelectedDifficulty(difficulty);
      
      // The useQuery will automatically fetch the question
      // We'll handle the rest in a useEffect or wait for the question to load
    } catch (error) {
      console.error("Error selecting level:", error);
    }
  };

  // Handle question processing when it's loaded
  React.useEffect(() => {
    if (randomQuestion && selectedDifficulty) {
      processSelectedQuestion(randomQuestion, selectedDifficulty);
    }
  }, [randomQuestion, selectedDifficulty]);

  const processSelectedQuestion = async (question: any, difficulty: "diep" | "dieper" | "diepst") => {
    try {
      // Replace [PLAYER] placeholder with current player's name
      const questionWithPlayer = {
        secondPerson: question.secondPerson,
        thirdPerson: question.thirdPerson.replace("[PLAYER]", currentPlayer),
        difficulty
      };

      // Set the current question
      await setCurrentQuestion({
        gameId,
        question: questionWithPlayer
      });

      // Mark this question as used (only if it's not the default question)
      if (question._id !== "default") {
        await markQuestionAsUsed({
          gameId,
          questionId: question._id,
          difficulty
        });
      }
      
      await updateGamePhase({ gameId, phase: "input" });
      
      // Reset selected difficulty
      setSelectedDifficulty(null);
    } catch (error) {
      console.error("Error processing selected question:", error);
      setSelectedDifficulty(null);
    }
  };

  const getDifficultyInfo = (difficulty: "diep" | "dieper" | "diepst") => {
    switch (difficulty) {
      case "diep":
        return { points: 5, distribute: 10, color: "#F59E0B" };
      case "dieper":
        return { points: 7, distribute: 15, color: "#3B82F6" };
      case "diepst":
        return { points: 10, distribute: 20, color: "#EF4444" };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RONDE {game.currentRound}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.playerText}>{currentPlayer} is de Kameraad</Text>
        
        <Text style={styles.questionText}>Hoe diep wil je gaan?</Text>

        <View style={styles.levelsContainer}>
          {(["diep", "dieper", "diepst"] as const).map((difficulty) => {
            const info = getDifficultyInfo(difficulty);
            const isLoading = selectedDifficulty === difficulty && randomQuestion === undefined;
            
            return (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.levelButton, 
                  { backgroundColor: info.color },
                  isLoading && styles.levelButtonLoading
                ]}
                onPress={() => handleLevelSelect(difficulty)}
                disabled={isLoading}
              >
                <Text style={styles.levelTitle}>
                  {isLoading ? "LADEN..." : difficulty.toUpperCase()}
                </Text>
                {!isLoading && (
                  <Text style={styles.levelSubtitle}>
                    krijg {info.points} punten, verdeel{'\n'}{info.distribute} punten
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  questionText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
  },
  levelsContainer: {
    width: '100%',
    gap: 16,
  },
  levelButton: {
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  levelButtonLoading: {
    opacity: 0.7,
  },
  levelTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  levelSubtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
});