import { internalMutation } from "./_generated/server";

export const migrateGameSchema = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all games with old schema
    const games = await ctx.db.query("games").collect();
    
    for (const game of games) {
      // Check if this game has the old schema
      const gameAny = game as any;
      if ('gamePhase' in gameAny && !('phase' in gameAny)) {
        // Skip migration since the current schema uses 'gamePhase', not 'phase'
        // This migration is no longer needed
      }
    }
    
    return { migrated: games.length };
  },
});

export const migrateIntroRoundFields = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get all games that might be missing IntroRound fields
    const games = await ctx.db.query("games").collect();
    let migrated = 0;
    
    for (const game of games) {
      const gameAny = game as any;
      
      // Check if the game is missing the new IntroRound fields
      if (!('hasIntroRound' in gameAny)) {
        await ctx.db.patch(game._id, {
          hasIntroRound: false, // Default to false for existing games
          isInIntroRound: false,
          introRoundTurnInRound: undefined,
          // Ensure usedQuestions includes vibing if it doesn't exist
          usedQuestions: {
            vibing: [],
            diep: gameAny.usedQuestions?.diep || [],
            dieper: gameAny.usedQuestions?.dieper || [],
            diepst: gameAny.usedQuestions?.diepst || []
          }
        });
        migrated++;
      }
    }
    
    return { migrated };
  },
});

export const clearAllGames = internalMutation({
  args: {},
  handler: async (ctx) => {
    const games = await ctx.db.query("games").collect();
    for (const game of games) {
      await ctx.db.delete(game._id);
    }
    return { deleted: games.length };
  },
});