import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";

interface IntroRoundTimerScreenProps {
  game: any;
  gameId: Id<"games">;
}

export default function IntroRoundTimerScreen({ game, gameId }: IntroRoundTimerScreenProps) {
  const [timeLeft, setTimeLeft] = useState(game.thinkingTime);
  const [isRunning, setIsRunning] = useState(true);
  const updateGamePhase = useMutation(api.games.updateGamePhase);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const handleFinish = async () => {
    await updateGamePhase({ gameId, phase: "intro_round_answer" });
  };

  const formatTime = (seconds: number) => {
    return `[${seconds}]`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIBING RONDE</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.playerText}>
          {game.players[game.currentPlayerIndex]} is de Kameraad
        </Text>

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

        <View style={styles.timerContainer}>
          <Ionicons name="hourglass" size={80} color="white" />
          <Text style={styles.timerText}>
            {formatTime(timeLeft)}
          </Text>
          <Text style={styles.timerLabel}>seconden</Text>
        </View>

        <Text style={styles.instructionText}>
          Alle andere spelers RADEN wat de Kameraad heeft geantwoord. Ze schrijven hun antwoord voor zichzelf op.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.finishButtonText}>KLAAR</Text>
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
  playerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  difficultyBadge: {
    backgroundColor: '#10B981',
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
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  timerText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 16,
  },
  timerLabel: {
    color: 'white',
    fontSize: 18,
    marginTop: 8,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
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
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});