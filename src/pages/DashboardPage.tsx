import React, { useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { getRandomMessage, getWelcomeMessage, progressPercent, getTodayString } from '@/lib/helpers';

const DashboardPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const { character, coins, tasks, habits, dailyCheckInStreak, lastCheckIn } = state;
  const today = getTodayString();
  const canCheckIn = lastCheckIn !== today;

  const completedToday = tasks.filter(
    (t) => t.completed && t.completedAt && t.completedAt.startsWith(today)
  ).length;

  const habitsToday = habits.filter((h) => h.completedDates.includes(today)).length;

  const handleCheckIn = () => {
    dispatch({ type: 'DAILY_CHECK_IN' });
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-cocoa mb-1">🏡 {getWelcomeMessage()}</h1>
        <p className="text-bark">{getRandomMessage()}</p>
      </div>

      {/* Character Summary */}
      <div className="bg-cloud rounded-2xl p-6 flex items-center gap-6">
        <div className="text-5xl animate-bounce-slow">🧑‍🌾</div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-cocoa">{character.name}</h2>
          <p className="text-sm text-bark">Level {character.level} · {character.mood}</p>
          <div className="mt-2 w-full bg-mist rounded-full h-3">
            <div
              className="bg-sage h-3 rounded-full transition-all"
              style={{ width: `${progressPercent(character.xp, character.xpToNext)}%` }}
            />
          </div>
          <p className="text-xs text-bark mt-1">{character.xp} / {character.xpToNext} XP</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-honey-dark">🪙 {coins}</p>
        </div>
      </div>

      {/* Daily Check-in */}
      {canCheckIn && (
        <button
          onClick={handleCheckIn}
          className="w-full bg-lavender hover:bg-lavender-dark text-cocoa font-bold py-3 rounded-xl transition-colors text-lg"
        >
          ✅ Daily Check-in (Streak: {dailyCheckInStreak})
        </button>
      )}
      {!canCheckIn && (
        <div className="w-full bg-sage/30 text-cocoa font-medium py-3 rounded-xl text-center text-lg">
          🔥 Checked in! Streak: {dailyCheckInStreak} days
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard emoji="✅" label="Tasks Today" value={completedToday} />
        <StatCard emoji="🔁" label="Habits Today" value={habitsToday} />
        <StatCard emoji="🏆" label="Total Completed" value={state.totalTasksCompleted} />
        <StatCard emoji="⭐" label="Total XP" value={state.totalXpEarned} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ emoji: string; label: string; value: number }> = ({ emoji, label, value }) => (
  <div className="bg-cloud rounded-xl p-4 text-center">
    <div className="text-2xl mb-1">{emoji}</div>
    <p className="text-2xl font-bold text-cocoa">{value}</p>
    <p className="text-xs text-bark">{label}</p>
  </div>
);

export default DashboardPage;
