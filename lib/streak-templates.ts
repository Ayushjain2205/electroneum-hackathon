export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActive: string;
  streakStartDate: string;
  totalDays: number;
  milestones: {
    nextMilestone: number;
    progress: number;
  };
}

export interface StreakDisplay {
  type: "streak";
  data: StreakData;
}

export function isStreakRequest(text: string): boolean {
  const streakKeywords = [
    "streak",
    "progress",
    "days",
    "record",
    "consecutive",
    "achievement",
  ];
  const questionWords = ["what", "how", "show", "tell", "check", "view"];

  const lowercaseText = text.toLowerCase();
  return (
    streakKeywords.some((keyword) => lowercaseText.includes(keyword)) &&
    questionWords.some((word) => lowercaseText.includes(word))
  );
}

export function formatStreakMessage(streak: StreakData): string {
  const emoji = getStreakEmoji(streak.currentStreak);

  return `🔥 **Your Streak Stats** 🔥

${emoji} Current Streak: **${streak.currentStreak} days**
🏆 Longest Streak: **${streak.longestStreak} days**
📅 Total Active Days: **${streak.totalDays}**
🎯 Next Milestone: **${streak.milestones.nextMilestone} days**
📊 Progress: **${streak.milestones.progress}%**

Keep going! You're doing great! 💪
${getStreakMotivation(streak.currentStreak)}`;
}

function getStreakEmoji(days: number): string {
  if (days >= 30) return "🌟";
  if (days >= 14) return "⭐";
  if (days >= 7) return "✨";
  return "💫";
}

function getStreakMotivation(days: number): string {
  if (days >= 30)
    return "You're absolutely crushing it! A whole month of dedication!";
  if (days >= 14) return "Two weeks strong! You're building an amazing habit!";
  if (days >= 7) return "A full week! The momentum is building!";
  if (days >= 3) return "Great start! Keep that streak alive!";
  return "Every day counts! Let's build that streak!";
}
