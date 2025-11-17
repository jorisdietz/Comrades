import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Questions data - inline to avoid dynamic import issues
const questionsData = [
  // VIBING level questions (favorite things, warm-up questions)
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete eten?",
    thirdPerson: "Wat is [PLAYER]'s favoriete eten?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete film?",
    thirdPerson: "Wat is [PLAYER]'s favoriete film?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete muziek genre?",
    thirdPerson: "Wat is [PLAYER]'s favoriete muziek genre?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete vakantiebestemming?",
    thirdPerson: "Wat is [PLAYER]'s favoriete vakantiebestemming?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete seizoen?",
    thirdPerson: "Wat is [PLAYER]'s favoriete seizoen?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete hobby?",
    thirdPerson: "Wat is [PLAYER]'s favoriete hobby?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete dier?",
    thirdPerson: "Wat is [PLAYER]'s favoriete dier?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete kleur?",
    thirdPerson: "Wat is [PLAYER]'s favoriete kleur?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete sport?",
    thirdPerson: "Wat is [PLAYER]'s favoriete sport?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete drankje?",
    thirdPerson: "Wat is [PLAYER]'s favoriete drankje?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete boek?",
    thirdPerson: "Wat is [PLAYER]'s favoriete boek?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete TV-serie?",
    thirdPerson: "Wat is [PLAYER]'s favoriete TV-serie?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete app op je telefoon?",
    thirdPerson: "Wat is [PLAYER]'s favoriete app op zijn/haar telefoon?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete tijd van de dag?",
    thirdPerson: "Wat is [PLAYER]'s favoriete tijd van de dag?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete plek om te ontspannen?",
    thirdPerson: "Wat is [PLAYER]'s favoriete plek om te ontspannen?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete snack?",
    thirdPerson: "Wat is [PLAYER]'s favoriete snack?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete manier om het weekend door te brengen?",
    thirdPerson: "Wat is [PLAYER]'s favoriete manier om het weekend door te brengen?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete sociale media platform?",
    thirdPerson: "Wat is [PLAYER]'s favoriete sociale media platform?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete dessert?",
    thirdPerson: "Wat is [PLAYER]'s favoriete dessert?"
  },
  {
    difficulty: "vibing" as const,
    secondPerson: "Wat is je favoriete manier van reizen?",
    thirdPerson: "Wat is [PLAYER]'s favoriete manier van reizen?"
  },
  
  // DIEP level questions (easier, more surface-level)
  {
    difficulty: "diep" as const,
    secondPerson: "Wat is je favoriete jeugdherinnering?",
    thirdPerson: "Wat is [PLAYER]'s favoriete jeugdherinnering?"
  },
  {
    difficulty: "diep" as const,
    secondPerson: "Welke eigenschap waardeer je het meest in een vriend?",
    thirdPerson: "Welke eigenschap waardeert [PLAYER] het meest in een vriend?"
  },
  {
    difficulty: "diep" as const,
    secondPerson: "Wat is je grootste angst?",
    thirdPerson: "Wat is [PLAYER]'s grootste angst?"
  },
  {
    difficulty: "diep" as const,
    secondPerson: "Wat is je grootste droom voor de toekomst?",
    thirdPerson: "Wat is [PLAYER]'s grootste droom voor de toekomst?"
  },
  {
    difficulty: "diep" as const,
    secondPerson: "Welke persoon heeft de grootste invloed op je gehad?",
    thirdPerson: "Welke persoon heeft de grootste invloed op [PLAYER] gehad?"
  },
  {
    difficulty: "diep" as const,
    secondPerson: "Wat is je favoriete manier om te ontspannen?",
    thirdPerson: "Wat is [PLAYER]'s favoriete manier om te ontspannen?"
  },
  {
    difficulty: "diep" as const,
    secondPerson: "Welke superkracht zou je willen hebben?",
    thirdPerson: "Welke superkracht zou [PLAYER] willen hebben?"
  },
  {
    difficulty: "diep" as const,
    secondPerson: "Wat is het beste advies dat je ooit hebt gekregen?",
    thirdPerson: "Wat is het beste advies dat [PLAYER] ooit heeft gekregen?"
  },
  
  // DIEPER level questions (more personal, requires more thought)
  {
    difficulty: "dieper" as const,
    secondPerson: "Wat is het moeilijkste wat je ooit hebt moeten doen?",
    thirdPerson: "Wat is het moeilijkste wat [PLAYER] ooit heeft moeten doen?"
  },
  {
    difficulty: "dieper" as const,
    secondPerson: "Over welke beslissing uit je verleden twijfel je nog steeds?",
    thirdPerson: "Over welke beslissing uit het verleden twijfelt [PLAYER] nog steeds?"
  },
  {
    difficulty: "dieper" as const,
    secondPerson: "Wat zou je doen als je wist dat je niet kon falen?",
    thirdPerson: "Wat zou [PLAYER] doen als hij/zij wist dat hij/zij niet kon falen?"
  },
  {
    difficulty: "dieper" as const,
    secondPerson: "Wat is je grootste onzekerheid over jezelf?",
    thirdPerson: "Wat is [PLAYER]'s grootste onzekerheid over zichzelf?"
  },
  {
    difficulty: "dieper" as const,
    secondPerson: "Welke fout uit je verleden zou je het liefst ongedaan maken?",
    thirdPerson: "Welke fout uit het verleden zou [PLAYER] het liefst ongedaan maken?"
  },
  {
    difficulty: "dieper" as const,
    secondPerson: "Wat is iets waar je trots op bent maar nooit over praat?",
    thirdPerson: "Wat is iets waar [PLAYER] trots op is maar nooit over praat?"
  },
  {
    difficulty: "dieper" as const,
    secondPerson: "Welke eigenschap van jezelf zou je willen veranderen?",
    thirdPerson: "Welke eigenschap van zichzelf zou [PLAYER] willen veranderen?"
  },
  {
    difficulty: "dieper" as const,
    secondPerson: "Wat is je grootste teleurstelling in het leven?",
    thirdPerson: "Wat is [PLAYER]'s grootste teleurstelling in het leven?"
  },
  
  // DIEPST level questions (very personal, intimate, vulnerable)
  {
    difficulty: "diepst" as const,
    secondPerson: "Wat is je diepste geheim dat je nog nooit aan iemand hebt verteld?",
    thirdPerson: "Wat zou [PLAYER]'s diepste geheim kunnen zijn?"
  },
  {
    difficulty: "diepst" as const,
    secondPerson: "Als je morgen zou sterven, wat zou je dan het meest betreuren?",
    thirdPerson: "Als [PLAYER] morgen zou sterven, wat zou hij/zij dan het meest betreuren?"
  },
  {
    difficulty: "diepst" as const,
    secondPerson: "Welke waarheid over jezelf probeer je te verbergen voor anderen?",
    thirdPerson: "Welke waarheid over zichzelf probeert [PLAYER] te verbergen voor anderen?"
  },
  {
    difficulty: "diepst" as const,
    secondPerson: "Wat is je grootste schaamte?",
    thirdPerson: "Wat zou [PLAYER]'s grootste schaamte kunnen zijn?"
  },
  {
    difficulty: "diepst" as const,
    secondPerson: "Welke gedachte heb je die je nooit hardop zou durven zeggen?",
    thirdPerson: "Welke gedachte heeft [PLAYER] die hij/zij nooit hardop zou durven zeggen?"
  },
  {
    difficulty: "diepst" as const,
    secondPerson: "Wat is het donkerste moment geweest in je leven?",
    thirdPerson: "Wat was het donkerste moment in [PLAYER]'s leven?"
  },
  {
    difficulty: "diepst" as const,
    secondPerson: "Welke leugen vertel je jezelf elke dag?",
    thirdPerson: "Welke leugen vertelt [PLAYER] zichzelf elke dag?"
  },
  {
    difficulty: "diepst" as const,
    secondPerson: "Wat is iets wat je hebt gedaan waar je je nog steeds schuldig over voelt?",
    thirdPerson: "Wat heeft [PLAYER] gedaan waar hij/zij zich nog steeds schuldig over voelt?"
  }
];

export const getRandomQuestionForGame = query({
  args: {
    gameId: v.id("games"),
    difficulty: v.union(v.literal("vibing"), v.literal("diep"), v.literal("dieper"), v.literal("diepst")),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return null;

    // Get all questions for this difficulty
    const allQuestions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("difficulty"), args.difficulty))
      .collect();

    if (allQuestions.length === 0) {
      // Return a default question if none exist
      const defaultQuestions = {
        vibing: {
          secondPerson: "Wat is je favoriete ding in de wereld?",
          thirdPerson: "Wat is [PLAYER]'s favoriete ding in de wereld?",
        },
        diep: {
          secondPerson: "Wat is je grootste droom?",
          thirdPerson: "Wat is [PLAYER]'s grootste droom?",
        },
        dieper: {
          secondPerson: "Wat is je grootste angst?",
          thirdPerson: "Wat is [PLAYER]'s grootste angst?",
        },
        diepst: {
          secondPerson: "Wat is je diepste geheim?",
          thirdPerson: "Wat zou [PLAYER]'s diepste geheim kunnen zijn?",
        }
      };
      
      const defaultQuestion = defaultQuestions[args.difficulty];
      return {
        _id: "default" as any,
        secondPerson: defaultQuestion.secondPerson,
        thirdPerson: defaultQuestion.thirdPerson,
        difficulty: args.difficulty,
      };
    }

    // Get used questions for this difficulty level - handle optional vibing field
    const usedQuestions = game.usedQuestions?.[args.difficulty] || [];
    
    // Filter out used questions
    const availableQuestions = allQuestions.filter(q => !usedQuestions.includes(q._id));
    
    // If all questions have been used, reset and use all questions again
    const questionsToChooseFrom = availableQuestions.length > 0 ? availableQuestions : allQuestions;
    
    // Select a random question
    const randomIndex = Math.floor(Math.random() * questionsToChooseFrom.length);
    const selectedQuestion = questionsToChooseFrom[randomIndex];
    
    // Log for debugging (remove in production)
    console.log(`Selected question for ${args.difficulty}:`, {
      totalQuestions: allQuestions.length,
      usedQuestions: usedQuestions.length,
      availableQuestions: availableQuestions.length,
      selectedQuestionId: selectedQuestion._id,
      wasReset: availableQuestions.length === 0
    });
    
    return selectedQuestion;
  },
});

export const markQuestionAsUsed = mutation({
  args: {
    gameId: v.id("games"),
    questionId: v.id("questions"),
    difficulty: v.union(v.literal("vibing"), v.literal("diep"), v.literal("dieper"), v.literal("diepst")),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return;

    // Initialize usedQuestions if it doesn't exist - handle optional vibing field
    const usedQuestions = game.usedQuestions || {
      vibing: [],
      diep: [],
      dieper: [],
      diepst: []
    };

    // Get current used questions for this difficulty - handle optional vibing field
    const currentUsed = usedQuestions[args.difficulty] || [];
    
    // Get all questions for this difficulty to check if we need to reset
    const allQuestions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("difficulty"), args.difficulty))
      .collect();

    // If we've used all questions, reset the list
    let newUsedQuestions;
    if (currentUsed.length >= allQuestions.length) {
      // Reset: start fresh with just this question
      newUsedQuestions = [args.questionId];
      console.log(`Reset used questions for ${args.difficulty}, starting fresh with question ${args.questionId}`);
    } else {
      // Add the new question to used list if not already there
      newUsedQuestions = currentUsed.includes(args.questionId) 
        ? currentUsed 
        : [...currentUsed, args.questionId];
      console.log(`Added question ${args.questionId} to used list for ${args.difficulty}. Used: ${newUsedQuestions.length}/${allQuestions.length}`);
    }

    // Update the game with the new used questions - ensure vibing field exists
    await ctx.db.patch(args.gameId, {
      usedQuestions: {
        vibing: usedQuestions.vibing || [],
        diep: usedQuestions.diep || [],
        dieper: usedQuestions.dieper || [],
        diepst: usedQuestions.diepst || [],
        [args.difficulty]: newUsedQuestions
      }
    });
  },
});

export const seedQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if questions already exist
    const existingQuestions = await ctx.db.query("questions").first();
    if (existingQuestions) {
      return { message: "Questions already seeded" };
    }

    // Insert all questions
    for (const question of questionsData) {
      await ctx.db.insert("questions", question);
    }

    return { message: `Seeded ${questionsData.length} questions` };
  },
});