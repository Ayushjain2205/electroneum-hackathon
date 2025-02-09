import { type StreakData } from "@/lib/streak-templates";

interface StreakCardProps {
  data: StreakData;
}

export function StreakCard({ data }: StreakCardProps) {
  const getEmoji = (days: number) => {
    if (days >= 30) return "🌟";
    if (days >= 14) return "⭐";
    if (days >= 7) return "✨";
    return "💫";
  };

  const getMotivation = (days: number) => {
    if (days >= 30)
      return "You're absolutely crushing it! A whole month of dedication!";
    if (days >= 14)
      return "Two weeks strong! You're building an amazing habit!";
    if (days >= 7) return "A full week! The momentum is building!";
    if (days >= 3) return "Great start! Keep that streak alive!";
    return "Every day counts! Let's build that streak!";
  };

  return (
    <div className="space-y-4 max-w-sm">
      <div className="text-center font-bold text-xl border-b-2 border-black pb-2">
        🔥 Your Streak Stats 🔥
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">Current Streak</span>
          <div className="flex items-center gap-2">
            <span className="text-xl">{getEmoji(data.currentStreak)}</span>
            <span className="font-bold">{data.currentStreak} days</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Longest Streak</span>
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span className="font-bold">{data.longestStreak} days</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Total Days</span>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span className="font-bold">{data.totalDays}</span>
          </div>
        </div>

        <div className="pt-2 border-t-2 border-black">
          <div className="text-sm text-gray-600 mb-1">
            Progress to next milestone
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full border border-black overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
              style={{ width: `${data.milestones.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>{data.currentStreak} days</span>
            <span>{data.milestones.nextMilestone} days</span>
          </div>
        </div>

        <div className="text-center italic text-gray-600 pt-2 border-t-2 border-black">
          {getMotivation(data.currentStreak)}
        </div>
      </div>
    </div>
  );
}
