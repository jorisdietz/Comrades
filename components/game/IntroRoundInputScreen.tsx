import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface IntroRoundInputScreenProps {
  game: any;
  gameId: Id<"games">;
}

export default function IntroRoundInputScreen({ game, gameId }: IntroRoundInputScreenProps) {
  const [answer, setAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [questionProcessed, setQuestionProcessed] = useState(false);
  
  const updateGamePhase = useMutation(api.games.updateGamePhase);
  const setAnswerMutation = useMutation(api.games.setAnswer);
  const setCurrentQuestion = useMutation(api.games.setCurrentQuestion);
  const markQuestionAsUsed = useMutation(api.questions.markQuestionAsUsed);

  // Get a random vibing question
  const randomQuestion = useQuery(
    api.questions.getRandomQuestionForGame,
    { gameId, difficulty: "vibing" }
  );

  const currentPlayer = game.players[game.currentPlayerIndex];

  // Set the question when it loads
  useEffect(() => {
    if (randomQuestion && !selectedQuestion && !questionProcessed) {
      const processQuestion = async () => {
        try {
          const questionWithPlayer = {
            secondPerson: randomQuestion.secondPerson,
            thirdPerson: randomQuestion.thirdPerson.replace("[PLAYER]", currentPlayer),
            difficulty: "vibing" as const
          };
          
          setSelectedQuestion(questionWithPlayer);
          await setCurrentQuestion({ gameId, question: questionWithPlayer });
          
          // Mark question as used if it's not the default
          if (randomQuestion._id !== "default") {
            await markQuestionAsUsed({
              gameId,
              questionId: randomQuestion._id,
              difficulty: "vibing"
            });
          }
          
          setQuestionProcessed(true);
        } catch (error) {
          console.error("Error processing question:", error);
          Alert.alert("Fout", "Er ging iets mis bij het laden van de vraag.");
        }
      };
      
      processQuestion();
    }
  }, [randomQuestion, selectedQuestion, currentPlayer, questionProcessed]);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      Alert.alert("Fout", "Vul een antwoord in!");
      return;
    }

    try {
      await setAnswerMutation({ gameId, answer: answer.trim() });
      await updateGamePhase({ gameId, phase: "intro_round_timer" });
    } catch (error) {
      console.error("Error submitting answer:", error);
      Alert.alert("Fout", "Er ging iets mis bij het opslaan van je antwoord.");
    }
  };

  if (!selectedQuestion) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>VIBING RONDE</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Vraag wordt geladen...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIBING RONDE</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.playerText}>
          {currentPlayer} is de Kameraad
        </Text>

        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>VIBING</Text>
        </View>

        <Text style={styles.questionText}>
          {selectedQuestion.secondPerson}
        </Text>

        <TextInput
          style={styles.answerInput}
          placeholder="Jouw antwoord"
          placeholderTextColor="#9CA3AF"
          value={answer}
          onChangeText={setAnswer}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>KLAAR</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  playerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  difficultyBadge: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 32,
  },
  difficultyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 28,
  },
  answerInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    width: '100%',
    minHeight: 120,
  },
  footer: {
    padding: 24,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});