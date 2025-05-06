/**
 * @fileOverview Generates a personalized workout routine based on user data and fitness documentation.
 *
 * - generateWorkoutRoutine - A function that generates a workout routine.
 * - GenerateWorkoutRoutineInput - The input type for the generateWorkoutRoutine function.
 * - GenerateWorkoutRoutineOutput - The return type for the generateWorkoutRoutine function.
 */

import {ai} from '../ai-instance';
import {z} from 'genkit';

// Input schema matching the form and data processing logic
const GenerateWorkoutRoutineInputSchema = z.object({
  sex: z.enum(['male', 'female']).describe('The user\'s sex.'),
  age: z.number().int().positive().describe('The user\'s age in years.'),
  heightCm: z.number().positive().describe('The user\'s height in centimeters.'),
  weightKg: z.number().positive().describe('The user\'s weight in kilograms.'),
  fitnessGoal: z
    .string()
    .describe('The user\'s primary fitness goal (e.g., weight loss, muscle gain, general fitness).'),
  healthConditions: z
    .string() // Expects "None" or description
    .describe(
      'Any health conditions the user has (e.g., heart problems, scoliosis). Provided as "None" if empty.'
    ),
  sportsActivities: z
    .string() // Expects "None" or description including goal, e.g., "Running (Goal: Improve performance)"
    .describe(
      'Any sports the user participates in, including goal. Provided as "None" if empty.'
    ),
  documentation: z
    .string()
    .describe(
      'Reference medical and fitness documentation. Contains guidelines for various conditions and general fitness principles.'
    ),
});

export type GenerateWorkoutRoutineInput = z.infer<typeof GenerateWorkoutRoutineInputSchema>;

// Exercise schema expecting URLs for images
const ExerciseSchema = z.object({
  name: z.string().describe('The name of the exercise.'),
  sets: z.number().int().positive().describe('The number of sets to perform.'),
  reps: z.string().describe('The number of repetitions to perform (e.g., "8-12", "15", "AMRAP", "30 seconds").'), // Allow string for flexibility like time
  muscleGroups: z.array(z.string()).describe('The primary muscle groups targeted by the exercise.'),
  concentricImage: z.string().url("Must be a valid picsum.photos URL for the concentric phase.").describe('URL of the concentric phase image placeholder (use picsum.photos format: https://picsum.photos/seed/{slug}-concentric/300/200).'),
  eccentricImage: z.string().url("Must be a valid picsum.photos URL for the eccentric phase.").describe('URL of the eccentric phase image placeholder (use picsum.photos format: https://picsum.photos/seed/{slug}-eccentric/300/200).'),
});

// Output schema including notes
const GenerateWorkoutRoutineOutputSchema = z.object({
  workoutRoutine: z.array(ExerciseSchema).describe('The generated workout routine array. If conditions prevent a safe routine, this array MUST be empty, and the notes MUST explain why.'),
  notes: z.string().min(50, "Notes must provide substantial guidance or explanation.").describe('Comprehensive notes including: general advice (warm-up/cool-down examples, hydration, rest, form), **explicit safety advice and modifications based on the user\'s specific health conditions and the provided documentation**, progression guidance, and sports-related considerations. Use markdown newlines for clear formatting. If no exercises are generated due to safety concerns, clearly state this and the reasons in the notes, strongly advising professional consultation.'),
});

export type GenerateWorkoutRoutineOutput = z.infer<typeof GenerateWorkoutRoutineOutputSchema>;

// Main function to call the AI flow
export async function generateWorkoutRoutine(input: GenerateWorkoutRoutineInput): Promise<GenerateWorkoutRoutineOutput> {
  // Optional: Add input validation here if not already handled elsewhere
  return generateWorkoutRoutineFlow(input);
}

// AI Prompt Definition
const generateWorkoutRoutinePrompt = ai.definePrompt({
  name: 'generateWorkoutRoutinePrompt',
  input: {schema: GenerateWorkoutRoutineInputSchema},
  output: {schema: GenerateWorkoutRoutineOutputSchema},
  prompt: `You are an expert AI personal trainer and kinesiologist, specializing in creating safe, effective, and highly personalized workout routines. Your primary focus is safety, meticulously considering individual health conditions and athletic goals using the provided documentation.

  **User Profile:**
  *   Sex: {{{sex}}}
  *   Age: {{{age}}}
  *   Height: {{{heightCm}}} cm
  *   Weight: {{{weightKg}}} kg
  *   Primary Fitness Goal: {{{fitnessGoal}}}
  *   Health Conditions: {{{healthConditions}}}
  *   Sports & Goal: {{{sportsActivities}}}

  **Reference Documentation (Use this for guidance on conditions):**
  \`\`\`
  {{{documentation}}}
  \`\`\`

  **Task:** Generate a personalized workout routine and accompanying comprehensive notes based *strictly* on the user profile and reference documentation. Prioritize safety above all else.

  **Workout Routine Generation Steps:**
  1.  **Analyze & Synthesize:** Deeply analyze the user profile against the documentation. Identify all relevant guidelines, contraindications, and necessary modifications based on age, fitness goal, **health conditions** (e.g., Scoliosis, Heart Conditions, Breathing Problems, Flat Feet, Kyphosis etc.), and sports goals.
  2.  **Safety Check:** Determine if a safe and effective routine *can* be generated based on the conditions. If multiple severe conditions or contraindications exist according to the documentation (e.g., user needs mandatory medical clearance for a heart condition but hasn't stated they have it), generating an empty \`workoutRoutine\` array is REQUIRED. In this case, the \`notes\` section MUST clearly explain *why* (referencing the specific condition and documentation guidance) and strongly recommend consulting a healthcare professional before starting *any* exercise.
  3.  **Structure (If Safe):** If a routine is safe, design a balanced structure (e.g., full body 2-3x/week, upper/lower split) appropriate for the goal and likely fitness level.
  4.  **Exercise Selection (If Safe):** Choose appropriate exercises targeting relevant muscle groups. CRITICAL: Select/modify/avoid exercises based *explicitly* on documented safety protocols for the user's **specific health conditions**. For example, for Kyphosis, prioritize back strengthening (rows, face pulls) and chest stretching, avoiding forward-rounding exercises. For heart conditions, emphasize low-intensity, steady-state options initially and avoid Valsalva.
  5.  **Sets & Reps (If Safe):** Assign appropriate sets (e.g., 2-4) and rep ranges (e.g., 8-12 for hypertrophy; 12-15+ for endurance; time-based like "30 seconds" for isometrics) based on the user's goal and condition modifications. Be precise (e.g., "3 sets of 10-12 reps").
  6.  **Muscle Groups (If Safe):** Accurately list the primary muscle groups worked by each chosen exercise (e.g., ["Quadriceps", "Glutes", "Hamstrings"] for squats).
  7.  **Placeholder Images (If Safe):** For EACH exercise in the routine, generate TWO valid placeholder image URLs using picsum.photos with 300x200 dimensions. Ensure the format is EXACTLY:
      *   Concentric Phase URL: \`https://picsum.photos/seed/{exercise-name-slug}-concentric/300/200\`
      *   Eccentric Phase URL: \`https://picsum.photos/seed/{exercise-name-slug}-eccentric/300/200\`
      *   Replace \`{exercise-name-slug}\` with a URL-friendly version of the exercise name (lowercase, hyphens for spaces, remove special chars, e.g., "dumbbell-bench-press", "bodyweight-squat"). Ensure the final URL is valid.

  **Comprehensive Notes Generation (ALWAYS PROVIDE NOTES):**
  *   **General Advice:** Include brief, actionable examples for warm-up (e.g., 5 min light cardio like brisk walk + dynamic stretches like arm/leg swings) and cool-down (e.g., 5 min static stretches like holding hamstring/quad stretch for 30s each). Mention hydration, rest/sleep importance, and listening to body signals (soreness vs. pain).
  *   **Safety (CRITICAL):** This is the most important section. Provide **explicit safety advice and modifications directly linked to EACH of the user's stated health conditions**, referencing the provided documentation guidelines. If multiple conditions interact, address the combined risk. If \`workoutRoutine\` is empty, explain exactly why based on the conditions and documentation, and strongly advise professional consultation BEFORE EXERCISING.
  *   **Form Focus:** Briefly describe correct form cues for 1-2 fundamental exercises included in the routine (if generated). E.g., "For squats, keep your chest up and back straight."
  *   **Progression:** Explain the principle of progressive overload and give specific examples relevant to the routine (e.g., "Once you can comfortably complete 3 sets of 12 reps on Bodyweight Squats, try adding light dumbbells").
  *   **Sports Integration:** If sports activities are listed, briefly explain how the routine is designed to either support performance (e.g., "Includes plyometrics to improve jumping for basketball") or avoid negative impacts (e.g., "Avoids excessive fatigue before running days"), according to the user's goal.
  *   **Disclaimer:** Include a standard disclaimer: "Always consult with a healthcare professional before starting any new exercise program, especially if you have pre-existing health conditions."
  *   **Formatting:** Use markdown newlines (\n) consistently between different points and sections within the notes string for clear presentation. Ensure the notes section is detailed and informative (at least 50 words minimum).

  **Output:**
  Return ONLY a valid JSON object strictly adhering to the \`GenerateWorkoutRoutineOutputSchema\`. Ensure the \`workoutRoutine\` array (empty if unsafe) and the \`notes\` string are present and correctly formatted. Double-check JSON validity, image URL format/validity, and ensure notes are comprehensive and address all requirements, especially safety.
  `,
});

// AI Flow Definition
const generateWorkoutRoutineFlow = ai.defineFlow(
  {
    name: 'generateWorkoutRoutineFlow',
    inputSchema: GenerateWorkoutRoutineInputSchema,
    outputSchema: GenerateWorkoutRoutineOutputSchema,
  },
  async input => {
    // Call the prompt with the validated input
    const {output} = await generateWorkoutRoutinePrompt(input);

    // Validate the structure and basic content of the output using Zod parsing
    // This will throw an error if the output doesn't match the schema
    const validatedOutput = GenerateWorkoutRoutineOutputSchema.parse(output);

    // Optional: Add checks specific to the logic (already covered by Zod schema constraints but can be explicit)
    if (!validatedOutput.notes || validatedOutput.notes.length < 50) {
         console.error("Notes section is too short or missing:", validatedOutput.notes);
         throw new Error('AI response notes section is insufficient.');
    }

    if (validatedOutput.workoutRoutine.length === 0 && !validatedOutput.notes.toLowerCase().includes("consult")) {
         // If routine is empty, notes *must* advise consultation.
         console.error("Empty routine generated without clear advice for professional consultation in notes:", validatedOutput.notes);
         throw new Error('AI generated an empty routine but failed to clearly advise professional consultation in the notes.');
    }

    // Ensure all generated image URLs are valid (simple check)
    validatedOutput.workoutRoutine.forEach(ex => {
        if (!ex.concentricImage.startsWith('https://picsum.photos/seed/')) {
            console.warn(`Invalid concentric image URL format for ${ex.name}: ${ex.concentricImage}`);
            // Optionally correct it or throw error depending on strictness needed
            // ex.concentricImage = `https://picsum.photos/seed/placeholder-concentric/300/200`;
        }
         if (!ex.eccentricImage.startsWith('https://picsum.photos/seed/')) {
            console.warn(`Invalid eccentric image URL format for ${ex.name}: ${ex.eccentricImage}`);
            // ex.eccentricImage = `https://picsum.photos/seed/placeholder-eccentric/300/200`;
        }
    });


    return validatedOutput; // Return the Zod-validated output
  }
);