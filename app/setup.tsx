import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SetupScreen() {
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [currentStep, setCurrentStep] = useState(1);
  const [thinkingTime, setThinkingTime] = useState(45);
  const [totalRounds, setTotalRounds] = useState(3);
  const [hasIntroRound, setHasIntroRound] = useState(true);

  const addPlayer = () => {
    setPlayers([...players, ""]);
  };

  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const validPlayers = players.filter(p => p.trim().length > 0);
      if (validPlayers.length < 2) {
        Alert.alert("Fout", "Je hebt minimaal 2 spelers nodig!");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      const validPlayers = players.filter(p => p.trim().length > 0);
      router.push({
        pathname: "/game",
        params: {
          players: JSON.stringify(validPlayers),
          thinkingTime: thinkingTime.toString(),
          totalRounds: totalRounds.toString(),
          hasIntroRound: hasIntroRound.toString(),
        },
      });
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <ScrollView style={styles.playersContainer}>
        {players.map((player, index) => (
          <View key={index} style={styles.playerInputContainer}>
            <TextInput
              style={styles.playerInput}
              placeholder="Speler naam"
              placeholderTextColor="#9CA3AF"
              value={player}
              onChangeText={(text) => updatePlayer(index, text)}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={index === players.length - 1 ? addPlayer : () => removePlayer(index)}
            >
              <Ionicons
                name={index === players.length - 1 ? "add" : "remove"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.iconContainer}>
        <Ionicons name="people" size={80} color="white" />
      </View>

      <Text style={styles.questionText}>
        Zijn alle Kameraden van jullie huis/team/club aanwezig?
      </Text>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.iconContainer}>
        <View style={styles.notepadContainer}>
          <Ionicons name="clipboard" size={60} color="white" />
          <Ionicons name="pencil" size={40} color="white" style={styles.pencilIcon} />
        </View>
      </View>

      <Text style={styles.questionText}>
        Hebben alle Kameraden iets om op te schrijven?
      </Text>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Zet de denktijd</Text>
        <View style={styles.timeSelector}>
          {[30, 45, 60].map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.selectorButton,
                thinkingTime === time && styles.selectedButton,
              ]}
              onPress={() => setThinkingTime(time)}
            >
              <Text style={[
                styles.selectorButtonText,
                thinkingTime === time && styles.selectedButtonText,
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.selectorDescription}>
          De spelers hebben {thinkingTime} seconden om het antwoord van de Kameraad te raden
        </Text>
      </View>

      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Kies het aantal rondes</Text>
        <View style={styles.roundSelector}>
          {[1, 2, 3, 4, 5].map((rounds) => (
            <TouchableOpacity
              key={rounds}
              style={[
                styles.selectorButton,
                totalRounds === rounds && styles.selectedButton,
              ]}
              onPress={() => setTotalRounds(rounds)}
            >
              <Text style={[
                styles.selectorButtonText,
                totalRounds === rounds && styles.selectedButtonText,
              ]}>
                {rounds}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.selectorDescription}>
          Elke speler is {totalRounds} keer aan de beurt als Kameraad
        </Text>
      </View>

      <View style={styles.selectorContainer}>
        <Text style={styles.selectorTitle}>Vibing ronde</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              hasIntroRound && styles.toggleButtonActive,
            ]}
            onPress={() => setHasIntroRound(true)}
          >
            <Text style={[
              styles.toggleButtonText,
              hasIntroRound && styles.toggleButtonTextActive,
            ]}>
              AAN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !hasIntroRound && styles.toggleButtonActive,
            ]}
            onPress={() => setHasIntroRound(false)}
          >
            <Text style={[
              styles.toggleButtonText,
              !hasIntroRound && styles.toggleButtonTextActive,
            ]}>
              UIT
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.selectorDescription}>
          Begin met een vibing ronde om op te warmen
        </Text>
      </View>

      <Text style={styles.questionText}>
        Zijn alle Kameraden klaar om te beginnen?
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NIEUW SPEL</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>JA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playersContainer: {
    width: '100%',
    maxHeight: 300,
  },
  playerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    marginLeft: 12,
  },
  iconContainer: {
    marginVertical: 32,
    alignItems: 'center',
  },
  notepadContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  pencilIcon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
  },
  questionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  selectorContainer: {
    width: '100%',
    marginBottom: 32,
  },
  selectorTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  roundSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  selectorButton: {
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 50,
  },
  selectedButton: {
    backgroundColor: '#3B82F6',
  },
  selectorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectedButtonText: {
    color: 'white',
  },
  selectorDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 0,
    marginBottom: 12,
  },
  toggleButton: {
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 80,
  },
  toggleButtonActive: {
    backgroundColor: '#3B82F6',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggleButtonTextActive: {
    color: 'white',
  },
});