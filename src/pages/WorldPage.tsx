import React from 'react';
import { useGame } from '@/context/GameContext';
import { Lock, ArrowUp } from 'lucide-react';

const WorldPage: React.FC = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-cocoa">🌍 Your World</h1>
      <p className="text-bark">Unlock and upgrade areas using coins earned from completing quests and habits!</p>
      <p className="text-lg font-bold text-honey-dark">🪙 {state.coins} coins</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state.worldAreas.map((area) => {
          const upgradeCost = (area.level + 1) * 25;
          const canUpgrade = area.unlocked && area.level < area.maxLevel && state.coins >= upgradeCost;
          const canUnlock = !area.unlocked && state.coins >= area.unlockCost;
          return (
            <div
              key={area.id}
              className={`rounded-xl p-5 transition-all ${
                area.unlocked ? 'bg-cloud' : 'bg-mist/50 opacity-75'
              }`}
            >
              <div className="text-4xl mb-2">{area.emoji}</div>
              <h3 className="font-bold text-cocoa text-lg">{area.name}</h3>
              <p className="text-sm text-bark mb-2">{area.description}</p>
              {area.unlocked ? (
                <div>
                  <p className="text-sm text-bark">Level {area.level}/{area.maxLevel}</p>
                  <div className="w-full bg-mist rounded-full h-2 mt-1 mb-2">
                    <div
                      className="bg-sage h-2 rounded-full"
                      style={{ width: `${(area.level / area.maxLevel) * 100}%` }}
                    />
                  </div>
                  {area.level < area.maxLevel && (
                    <button
                      onClick={() => dispatch({ type: 'UPGRADE_AREA', payload: area.id })}
                      disabled={!canUpgrade}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        canUpgrade
                          ? 'bg-honey hover:bg-honey-dark text-cocoa'
                          : 'bg-mist text-bark cursor-not-allowed'
                      }`}
                    >
                      <ArrowUp size={14} /> Upgrade ({upgradeCost} 🪙)
                    </button>
                  )}
                  {area.level >= area.maxLevel && (
                    <span className="text-sm text-sage-dark font-medium">✨ Max Level!</span>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => dispatch({ type: 'UNLOCK_AREA', payload: area.id })}
                  disabled={!canUnlock}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    canUnlock
                      ? 'bg-lavender hover:bg-lavender-dark text-cocoa'
                      : 'bg-mist text-bark cursor-not-allowed'
                  }`}
                >
                  <Lock size={14} /> Unlock ({area.unlockCost} 🪙)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorldPage;
