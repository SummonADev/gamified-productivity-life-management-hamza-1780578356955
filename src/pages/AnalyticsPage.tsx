import React from 'react';
import { useGame } from '@/context/GameContext';
import { getTodayString, progressPercent } from '@/lib/helpers';

const AnalyticsPage: React.FC = () => {
  const { state } = useGame();
  const { tasks, habits, totalTasksCompleted, totalXpEarned, totalCoinsEarned, dailyCheckInStreak, worldAreas, achievements } = state;

  const completedTasks = tasks.filter((t) => t.completed);
  const activeTasks = tasks.filter((t) => !t.completed);
  const unlockedAreas = worldAreas.filter((a) => a.unlocked).length;
  const totalAreas = worldAreas.length;
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;

  const today = getTodayString();
  const habitsCompletedToday = habits.filter((h) => h.completedDates.includes(today)).length;
  const tasksCompletedToday = completedTasks.filter(
    (t) => t.completedAt && t.completedAt.startsWith(today)
  ).length;

  const bestHabitStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);

  const stats = [
    { label: 'Total Tasks Completed', value: totalTasksCompleted, emoji: '✅' },
    { label: 'Active Quests', value: activeTasks.length, emoji: '📜' },
    { label: 'Tasks Today', value: tasksCompletedToday, emoji: '📋' },
    { label: 'Habits Today', value: habitsCompletedToday, emoji: '🔁' },
    { label: 'Total XP Earned', value: totalXpEarned, emoji: '⭐' },
    { label: 'Total Coins Earned', value: totalCoinsEarned, emoji: '🪙' },
    { label: 'Check-in Streak', value: dailyCheckInStreak, emoji: '🔥' },
    { label: 'Best Habit Streak', value: bestHabitStreak, emoji: '💪' },
    { label: 'Areas Unlocked', value: `${unlockedAreas}/${totalAreas}`, emoji: '🌍' },
    { label: 'Achievements', value: `${unlockedAchievements}/${totalAchievements}`, emoji: '🏆' },
  ];

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-cocoa">📊 Analytics</h1>
      <p className="text-bark">Track your progress and see how far you've come!</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-cloud rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <p className="text-2xl font-bold text-cocoa">{stat.value}</p>
            <p className="text-xs text-bark">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* World Progress */}
      <div className="bg-cloud rounded-xl p-4">
        <h2 className="text-lg font-bold text-cocoa mb-3">🌍 World Progress</h2>
        <div className="space-y-2">
          {worldAreas.map((area) => (
            <div key={area.id} className="flex items-center gap-3">
              <span className="text-xl">{area.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className={area.unlocked ? 'text-cocoa font-medium' : 'text-bark'}>{area.name}</span>
                  <span className="text-bark text-xs">
                    {area.unlocked ? `Lv ${area.level}/${area.maxLevel}` : '🔒 Locked'}
                  </span>
                </div>
                <div className="w-full bg-mist rounded-full h-2 mt-1">
                  <div
                    className="bg-sage h-2 rounded-full transition-all"
                    style={{ width: `${area.unlocked ? progressPercent(area.level, area.maxLevel) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Streaks */}
      {habits.length > 0 && (
        <div className="bg-cloud rounded-xl p-4">
          <h2 className="text-lg font-bold text-cocoa mb-3">🔁 Habit Streaks</h2>
          <div className="space-y-2">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-3">
                <span className="text-xl">{habit.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-cocoa font-medium">{habit.title}</span>
                    <span className="text-bark text-xs">🔥 {habit.streak} (Best: {habit.bestStreak})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
