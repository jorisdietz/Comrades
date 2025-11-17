import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import LevelScreen from "@/components/game/LevelScreen";
import InputScreen from "@/components/game/InputScreen";
import TimerScreen from "@/components/game/TimerScreen";
import AnswerScreen from "@/components/game/AnswerScreen";
import JuryScreen from "@/components/game/JuryScreen";
import ScoreboardScreen from "@/components/game/ScoreboardScreen";
import FinishedScreen from "@/components/game/FinishedScreen";
import IntroRoundStartScreen from "@/components/game/IntroRoundStartScreen";
import IntroRoundInputScreen from "@/components/game/IntroRoundInputScreen";
import IntroRoundTimerScreen from "@/components/game/IntroRoundTimerScreen";
import IntroRoundAnswerScreen from "@/components/game/IntroRoundAnswerScreen";
import IntroRoundJuryScreen from "@/components/game/IntroRoundJuryScreen";
import IntroRoundScoreboardScreen from "@/components/game/IntroRoundScoreboardScreen";
import IntroRoundEndScreen from "@/components/game/IntroRoundEndScreen";

export default function GameScreen() {
  const params = useLocalSearchParams();
  const [gameId, setGameId] = useState<Id<"games"> | null>(null);
  
  const createGame = useMutation(api.games.createGame);
  // Always call useQuery with the same structure - use "skip" when gameId is null
  const game = useQuery(api.games.getGame, gameId ? { gameId } : "skip");

  useEffect(() => {
    const initializeGame = async () => {
      if (params.players && params.thinkingTime && params.totalRounds && params.hasIntroRound && !gameId) {
        const players = JSON.parse(params.players as string);
        const thinkingTime = parseInt(params.thinkingTime as string);
        const totalRounds = parseInt(params.totalRounds as string);
        const hasIntroRound = params.hasIntroRound === 'true';

        const newGameId = await createGame({
          players,
          thinkingTime,
          totalRounds,
          hasIntroRound,
        });
        
        setGameId(newGameId);
      }
    };

    initializeGame();
  }, [params, gameId]);

  // Show loading while gameId is being set or game is being fetched
  if (!gameId || game === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Spel wordt geladen...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error if game doesn't exist
  if (game === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Spel niet gevonden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderGamePhase = () => {
    switch (game.gamePhase) {
      case "intro_round_start":
        return <IntroRoundStartScreen game={game} gameId={gameId} />;
      case "intro_round_input":
        return <IntroRoundInputScreen game={game} gameId={gameId} />;
      case "intro_round_timer":
        return <IntroRoundTimerScreen game={game} gameId={gameId} />;
      case "intro_round_answer":
        return <IntroRoundAnswerScreen game={game} gameId={gameId} />;
      case "intro_round_jury":
        return <IntroRoundJuryScreen game={game} gameId={gameId} />;
      case "intro_round_scoreboard":
        return <IntroRoundScoreboardScreen game={game} gameId={gameId} />;
      case "intro_round_end":
        return <IntroRoundEndScreen game={game} gameId={gameId} />;
      case "level_selection":
        return <LevelScreen game={game} gameId={gameId} />;
      case "input":
        return <InputScreen game={game} gameId={gameId} />;
      case "timer":
        return <TimerScreen game={game} gameId={gameId} />;
      case "answer":
        return <AnswerScreen game={game} gameId={gameId} />;
      case "jury":
        return <JuryScreen game={game} gameId={gameId} />;
      case "scoreboard":
        return <ScoreboardScreen game={game} gameId={gameId} />;
      case "finished":
        return <FinishedScreen game={game} />;
      default:
        return game.hasIntroRound ? <IntroRoundStartScreen game={game} gameId={gameId} /> : <LevelScreen game={game} gameId={gameId} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderGamePhase()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
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
});