import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    players: v.array(v.string()),
    currentRound: v.number(),
    totalRounds: v.number(),
    thinkingTime: v.number(), // in seconds
    currentPlayerIndex: v.number(),
    currentTurnInRound: v.number(),
    gamePhase: v.union(
      v.literal("setup"),
      v.literal("intro_round_start"),
      v.literal("intro_round_input"),
      v.literal("intro_round_timer"),
      v.literal("intro_round_answer"),
      v.literal("intro_round_jury"),
      v.literal("intro_round_scoreboard"),
      v.literal("intro_round_end"),
      v.literal("level_selection"),
      v.literal("input"),
      v.literal("timer"),
      v.literal("answer"),
      v.literal("jury"),
      v.literal("scoreboard"),
      v.literal("finished")
    ),
    scores: v.record(v.string(), v.number()), // player name -> total score
    currentQuestion: v.optional(v.object({
      secondPerson: v.string(),
      thirdPerson: v.string(),
      difficulty: v.union(v.literal("vibing"), v.literal("diep"), v.literal("dieper"), v.literal("diepst")),
      answer: v.optional(v.string())
    })),
    // Track used questions per difficulty level to prevent repeats
    usedQuestions: v.optional(v.object({
      vibing: v.optional(v.array(v.id("questions"))),
      diep: v.array(v.id("questions")),
      dieper: v.array(v.id("questions")),
      diepst: v.array(v.id("questions"))
    })),
    // IntroRound settings - temporarily optional for migration
    hasIntroRound: v.optional(v.boolean()),
    isInIntroRound: v.optional(v.boolean()),
    introRoundTurnInRound: v.optional(v.number()),
    createdAt: v.number(),
  }),
  
  questions: defineTable({
    secondPerson: v.string(),
    thirdPerson: v.string(),
    difficulty: v.union(v.literal("vibing"), v.literal("diep"), v.literal("dieper"), v.literal("diepst")),
  }),
});