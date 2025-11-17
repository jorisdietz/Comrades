import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createGame = mutation({
  args: {
    players: v.array(v.string()),
    totalRounds: v.number(),
    thinkingTime: v.number(),
    hasIntroRound: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const scores: Record<string, number> = {};
    args.players.forEach(player => {
      scores[player] = 0;
    });

    const hasIntroRound = args.hasIntroRound ?? false;

    const gameId = await ctx.db.insert("games", {
      players: args.players,
      currentRound: hasIntroRound ? 0 : 1, // Start at 0 if intro round, 1 otherwise
      totalRounds: args.totalRounds,
      thinkingTime: args.thinkingTime,
      currentPlayerIndex: 0,
      currentTurnInRound: 0,
      gamePhase: hasIntroRound ? "intro_round_start" : "level_selection",
      scores,
      hasIntroRound,
      isInIntroRound: hasIntroRound,
      introRoundTurnInRound: hasIntroRound ? 0 : undefined,
      // Initialize empty used questions tracking
      usedQuestions: {
        vibing: [],
        diep: [],
        dieper: [],
        diepst: []
      },
      createdAt: Date.now(),
    });

    return gameId;
  },
});

export const getGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  },
});

export const updateGamePhase = mutation({
  args: {
    gameId: v.id("games"),
    phase: v.union(
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
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.gameId, {
      gamePhase: args.phase,
    });
  },
});

export const setCurrentQuestion = mutation({
  args: {
    gameId: v.id("games"),
    question: v.object({
      secondPerson: v.string(),
      thirdPerson: v.string(),
      difficulty: v.union(v.literal("vibing"), v.literal("diep"), v.literal("dieper"), v.literal("diepst")),
      answer: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.gameId, {
      currentQuestion: args.question,
    });
  },
});

export const setAnswer = mutation({
  args: {
    gameId: v.id("games"),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || !game.currentQuestion) return;

    await ctx.db.patch(args.gameId, {
      currentQuestion: {
        ...game.currentQuestion,
        answer: args.answer,
      },
    });
  },
});

export const updateScores = mutation({
  args: {
    gameId: v.id("games"),
    playerScores: v.record(v.string(), v.number()),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return;

    const newScores = { ...game.scores };
    Object.entries(args.playerScores).forEach(([player, score]) => {
      newScores[player] = (newScores[player] || 0) + score;
    });

    await ctx.db.patch(args.gameId, {
      scores: newScores,
    });
  },
});

export const nextTurn = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return;

    const nextTurnInRound = game.currentTurnInRound + 1;
    
    if (nextTurnInRound >= game.players.length) {
      // Round is complete, move to next round
      const nextRound = game.currentRound + 1;
      if (nextRound > game.totalRounds) {
        // Game is finished
        await ctx.db.patch(args.gameId, {
          gamePhase: "finished",
        });
      } else {
        // Start next round
        await ctx.db.patch(args.gameId, {
          currentRound: nextRound,
          currentTurnInRound: 0,
          currentPlayerIndex: 0,
          gamePhase: "level_selection",
          currentQuestion: undefined,
        });
      }
    } else {
      // Next player in current round
      const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
      await ctx.db.patch(args.gameId, {
        currentTurnInRound: nextTurnInRound,
        currentPlayerIndex: nextPlayerIndex,
        gamePhase: "level_selection",
        currentQuestion: undefined,
      });
    }
  },
});

export const nextIntroRoundTurn = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || !game.isInIntroRound) return;

    const nextTurnInRound = (game.introRoundTurnInRound || 0) + 1;
    
    if (nextTurnInRound >= game.players.length) {
      // IntroRound is complete, move to IntroRoundEnd
      await ctx.db.patch(args.gameId, {
        gamePhase: "intro_round_end",
      });
    } else {
      // Next player in IntroRound
      const nextPlayerIndex = (game.currentPlayerIndex + 1) % game.players.length;
      await ctx.db.patch(args.gameId, {
        introRoundTurnInRound: nextTurnInRound,
        currentPlayerIndex: nextPlayerIndex,
        gamePhase: "intro_round_input",
        currentQuestion: undefined,
      });
    }
  },
});

export const startMainGame = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.gameId, {
      currentRound: 1,
      currentPlayerIndex: 0,
      currentTurnInRound: 0,
      gamePhase: "level_selection",
      isInIntroRound: false,
      currentQuestion: undefined,
    });
  },
});

export const resetIntroRoundQuestions = mutation({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return;

    // Reset only the vibing questions to start fresh for IntroRound
    const usedQuestions = game.usedQuestions || {
      vibing: [],
      diep: [],
      dieper: [],
      diepst: []
    };

    await ctx.db.patch(args.gameId, {
      usedQuestions: {
        ...usedQuestions,
        vibing: [] // Reset vibing questions for IntroRound
      }
    });
  },
});