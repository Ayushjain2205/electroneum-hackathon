export type WorkoutType =
  | "legs"
  | "arms"
  | "chest"
  | "back"
  | "shoulders"
  | "core"
  | "cardio"
  | "full-body";

export interface Exercise {
  name: string;
  sets: number;
  reps: string; // Can be "12" or "Until failure" or "30 seconds"
  notes?: string;
}

export interface WorkoutPlan {
  type: WorkoutType;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export function formatWorkoutToMarkdown(workout: WorkoutPlan): string {
  return `# ${workout.type.toUpperCase()} DAY WORKOUT 💪
Duration: ${workout.duration} | Level: ${workout.difficulty}

## Warm-up (5-10 minutes)
${workout.warmup.map((w) => `• ${w}`).join("\n")}

## Main Workout
${workout.exercises
  .map(
    (exercise, index) => `
${index + 1}. **${exercise.name}**
   - Sets: ${exercise.sets}
   - Reps: ${exercise.reps}
   ${exercise.notes ? `   - Note: ${exercise.notes}` : ""}`
  )
  .join("\n")}

## Cool-down (5-10 minutes)
${workout.cooldown.map((c) => `• ${c}`).join("\n")}

Remember to:
• Stay hydrated 💧
• Maintain proper form
• Listen to your body
• Rest between sets (30-60 seconds)

Good luck! 🎯`;
}

// Common warm-up and cool-down templates
export const commonWarmups = {
  general: [
    "Light jogging in place for 2 minutes",
    "Arm circles (forward and backward)",
    "Shoulder rolls",
    "Hip rotations",
    "Jumping jacks for 1 minute",
  ],
  legs: [
    "Light jogging in place for 2 minutes",
    "Bodyweight squats (10 reps)",
    "Walking lunges (10 each leg)",
    "Hip rotations",
    "Ankle rotations",
  ],
  upper: [
    "Arm circles (forward and backward)",
    "Shoulder rolls",
    "Wall push-ups (10 reps)",
    "Torso twists",
    "Light jumping jacks",
  ],
};

export const commonCooldowns = [
  "Light walking in place",
  "Deep breathing exercises",
  "Basic stretches for worked muscle groups",
  "Light shoulder and arm stretches",
  "Gentle torso twists",
];
