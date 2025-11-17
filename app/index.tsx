import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function HomeScreen() {
  const seedQuestions = useMutation(api.questions.seedQuestions);

  useEffect(() => {
    // Seed questions on app start
    seedQuestions();
  }, []);

  const handleNewGame = () => {
    router.push("/setup");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welkom bij</Text>
        
        <View style={styles.logoContainer}>
          <View style={styles.letterContainer}>
            <Text style={[styles.letter, { backgroundColor: '#F59E0B' }]}>K</Text>
            <Text style={[styles.letter, { backgroundColor: '#3B82F6' }]}>A</Text>
            <Text style={[styles.letter, { backgroundColor: '#F59E0B' }]}>M</Text>
            <Text style={[styles.letter, { backgroundColor: '#3B82F6' }]}>E</Text>
            <Text style={[styles.letter, { backgroundColor: '#EF4444' }]}>R</Text>
            <Text style={[styles.letter, { backgroundColor: '#3B82F6' }]}>A</Text>
            <Text style={[styles.letter, { backgroundColor: '#EF4444' }]}>D</Text>
            <Text style={[styles.letter, { backgroundColor: '#3B82F6' }]}>E</Text>
            <Text style={[styles.letter, { backgroundColor: '#EF4444' }]}>N</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Hoe goed ken jij je maten?</Text>

        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
          <Text style={styles.newGameButtonText}>NIEUW SPEL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937', // Dark green background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeText: {
    fontSize: 24,
    color: 'white',
    marginBottom: 32,
    fontWeight: '400',
  },
  logoContainer: {
    marginBottom: 24,
  },
  letterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  letter: {
    width: 50,
    height: 60,
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    fontStyle: 'italic',
    marginBottom: 48,
    textAlign: 'center',
  },
  newGameButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});