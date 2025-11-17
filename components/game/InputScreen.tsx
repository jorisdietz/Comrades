import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface InputScreenProps {
  game: any;
  gameId: Id<"games">;
}

export default function InputScreen({ game, gameId }: InputScreenProps) {
  const [answer, setAnswer] = useState("");
  const updateGamePhase = useMutation(api.games.updateGamePhase);
  const setAnswerMutation = useMutation(api.games.setAnswer);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      Alert.alert("Fout", "Vul een antwoord in!");
      return;
    }

    await setAnswerMutation({ gameId, answer: answer.trim() });
    await updateGamePhase({ gameId, phase: "timer" });
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
        <Text style={styles.playerText}>
          {game.players[game.currentPlayerIndex]} is de Kameraad
        </Text>

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
              {game.currentQuestion.secondPerson}
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
          </>
        )}
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