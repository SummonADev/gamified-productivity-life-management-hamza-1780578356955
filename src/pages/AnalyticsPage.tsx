import React from 'react';
import { useGame } from '@/context/GameContext';
import { progressPercent, getTodayString } from '@/lib/helpers';

const AnalyticsPage: React.FC = () => {
  const { state } = useGame();
  const today = getTodayString();

  const completedToday = state.tasks.filter(
    (t) => t.completed && t.completedAt && t.completedAt.startsWith(today)
  ).length;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const weeklyData = last7.map((day) => ({
    day: day.slice(5),
    tasks: state.tasks.filter((t) => t.completed && t.completedAt && t.completedAt.startsWith(day)).length,
    habits: state.habits.reduce((c, h) => c + (h.completedDates.includes(day) ? 1 : 0), 0),
  }));

  const maxVal = Math.max(1, ...weeklyData.map((d) => d.tasks + d.habits));

  const unlockedAreas = state.worldAreas.filter((a) => a.unlocked).length;
  const totalAreas = state.worldAreas.length;
  const unlockedAch = state.achievements.filter((a) => a.unlocked).length;
  const totalAch = state.achievements.length;

  const habitConsistency = state.habits.length > 0
    ? Math.round(
        (state.habits.reduce((acc, h) => acc + (h.completedDates.includes(today) ? 1 : 0), 0) /
          state.habits.length) *
          100
      )
    : 0;

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-cocoa">📊 Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticCard emoji="✅" label="Total Tasks" value={state.totalTasksCompleted} />
        <AnalyticCard emoji="⭐" label="Total XP" value={state.totalXpEarned} />
        <AnalyticCard emoji="🪙" label="Total Coins" value={state.totalCoinsEarned} />
        <AnalyticCard emoji="🔥" label="Check-in Streak" value={state.dailyCheckInStreak} />
      </div>

      <div className="bg-cloud rounded-xl p-4">
        <h2 className="text-lg font-bold text-cocoa mb-3">Weekly Activity</h2>
        <div className="flex items-end gap-2 h-32">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '100px' }}>
                <div className="w-full flex flex-col justify-end" style={{ height: '100px' }}>
                  <div
                    className="bg-sage rounded-t-sm w-full transition-all"
                    style={{ height: `${(d.tasks / maxVal) * 100}px` }}
                  />
                  <div
                    className="bg-lavender w-full transition-all"
                    style={{ height: `${(d.habits / maxVal) * 100}px` }}
                  />
                </div>
              </div>
              <span className="text-xs text-bark">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-bark">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-sage inline-block" /> Tasks</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-lavender inline-block" /> Habits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ProgressCard emoji="🌍" label="World Progress" current={unlockedAreas} total={totalAreas} />
        <ProgressCard emoji="🏆" label="Achievements" current={unlockedAch} total={totalAch} />
        <div className="bg-cloud rounded-xl p-4 text-center">
          <div className="text-2xl mb-1">🔁</div>
          <p className="text-2xl font-bold text-cocoa">{habitConsistency}%</p>
          <p className="text-xs text-bark">Habit Consistency Today</p>
        </div>
      </div>

      <div className="bg-cloud rounded-xl p-4 text-center">
        <p className="text-lg font-bold text-cocoa">Level {state.character.level}</p>
        <div className="w-full max-w-xs mx-auto bg-mist rounded-full h-3 mt-2">
          <div
            className="bg-sage h-3 rounded-full transition-all"
            style={{ width: `${progressPercent(state.character.xp, state.character.xpToNext)}%` }}
          />
        </div>
        <p className="text-xs text-bark mt-1">
          {state.character.xp} / {state.character.xpToNext} XP to Level {state.character.level + 1}
        </p>
      </div>
    </div>
  );
};

const AnalyticCard: React.FC<{ emoji: string; label: string; value: number }> = ({ emoji, label, value }) => (
  <div className="bg-cloud rounded-xl p-4 text-center">
    <div className="text-2xl mb-1">{emoji}</div>
    <p className="text-2xl font-bold text-cocoa">{value}</p>
    <p className="text-xs text-bark">{label}</p>
  </div>
);

const ProgressCard: React.FC<{ emoji: string; label: string; current: number; total: number }> = ({
  emoji,
  label,
  current,
  total,
}) => (
  <div className="bg-cloud rounded-xl p-4 text-center">
    <div className="text-2xl mb-1">{emoji}</div>
    <p className="text-2xl font-bold text-cocoa">{current}/{total}</p>
    <p className="text-xs text-bark">{label}</p>
    <div className="w-full bg-mist rounded-full h-2 mt-2">
      <div
        className="bg-sage h-2 rounded-full transition-all"
        style={{ width: `${progressPercent(current, total)}%` }}
      />
    </div>
  </div>
);

export default AnalyticsPage;
