import React from 'react';
import { useGame } from '@/context/GameContext';
import { Lock, ArrowUp } from 'lucide-react';

const WorldPage: React.FC = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-cocoa">🌍 Your World</h1>
      <p className="text-bark">Complete tasks and spend coins to unlock and upgrade areas!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {state.worldAreas.map((area) => (
          <div
            key={area.id}
            className={`rounded-xl p-5 transition-all ${
              area.unlocked ? 'bg-cloud' : 'bg-mist/50'
            }`}
          >
            <div className="text-4xl mb-2">{area.emoji}</div>
            <h3 className="font-bold text-cocoa text-lg">{area.name}</h3>
            <p className="text-sm text-bark mb-2">{area.description}</p>

            {area.unlocked ? (
              <>
                <div className="flex items-center gap-2 text-sm text-bark mb-2">
                  <span>Level {area.level}/{area.maxLevel}</span>
                </div>
                <div className="w-full bg-mist rounded-full h-2 mb-2">
                  <div
                    className="bg-sage h-2 rounded-full transition-all"
                    style={{ width: `${(area.level / area.maxLevel) * 100}%` }}
                  />
                </div>
                {area.level < area.maxLevel && (
                  <button
                    onClick={() => dispatch({ type: 'UPGRADE_AREA', payload: area.id })}
                    className="flex items-center gap-1 bg-honey hover:bg-honey-dark text-cocoa px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    <ArrowUp size={14} /> Upgrade ({(area.level + 1) * 25} 🪙)
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => dispatch({ type: 'UNLOCK_AREA', payload: area.id })}
                className="flex items-center gap-1 bg-lavender hover:bg-lavender-dark text-cocoa px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                <Lock size={14} /> Unlock ({area.unlockCost} 🪙)
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldPage;
