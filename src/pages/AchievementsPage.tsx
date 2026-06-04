import React from 'react';
import { useGame } from '@/context/GameContext';

const AchievementsPage: React.FC = () => {
  const { state } = useGame();
  const unlocked = state.achievements.filter((a) => a.unlocked);
  const locked = state.achievements.filter((a) => !a.unlocked);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-cocoa">🏆 Achievements</h1>
      <p className="text-bark">
        {unlocked.length} / {state.achievements.length} unlocked
      </p>

      {unlocked.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-cocoa mb-3">✨ Unlocked</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {unlocked.map((a) => (
              <div key={a.id} className="bg-cloud rounded-xl p-4 flex items-center gap-3">
                <div className="text-3xl">{a.emoji}</div>
                <div>
                  <h3 className="font-bold text-cocoa">{a.title}</h3>
                  <p className="text-xs text-bark">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-bark mb-3">🔒 Locked</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {locked.map((a) => (
            <div key={a.id} className="bg-mist/50 rounded-xl p-4 flex items-center gap-3 opacity-60">
              <div className="text-3xl grayscale">❓</div>
              <div>
                <h3 className="font-bold text-bark">{a.title}</h3>
                <p className="text-xs text-bark">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
