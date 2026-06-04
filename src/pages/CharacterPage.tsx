import React from 'react';
import { useGame } from '@/context/GameContext';
import { HAIR_COLORS, SKIN_COLORS, HAIR_STYLES, BODY_TYPES } from '@/lib/constants';
import { progressPercent } from '@/lib/helpers';

const CharacterPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const { character } = state;

  const update = (payload: Partial<typeof character>) => {
    dispatch({ type: 'UPDATE_CHARACTER', payload });
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-cocoa">🧑‍🌾 Character</h1>

      {/* Preview */}
      <div className="bg-cloud rounded-2xl p-6 text-center">
        <div className="text-6xl mb-3 animate-bounce-slow">🧑‍🌾</div>
        <h2 className="text-xl font-bold text-cocoa">{character.name}</h2>
        <p className="text-bark">Level {character.level} · {character.mood}</p>
        <div className="mt-2 max-w-xs mx-auto">
          <div className="w-full bg-mist rounded-full h-3">
            <div
              className="bg-sage h-3 rounded-full transition-all"
              style={{ width: `${progressPercent(character.xp, character.xpToNext)}%` }}
            />
          </div>
          <p className="text-xs text-bark mt-1">{character.xp} / {character.xpToNext} XP</p>
        </div>
      </div>

      {/* Name */}
      <div className="bg-cloud rounded-xl p-4">
        <label className="text-sm font-medium text-cocoa block mb-1">Name</label>
        <input
          className="w-full bg-white rounded-lg px-3 py-2 text-cocoa border border-mist focus:outline-none focus:border-sage"
          value={character.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </div>

      {/* Hair Color */}
      <div className="bg-cloud rounded-xl p-4">
        <label className="text-sm font-medium text-cocoa block mb-2">Hair Color</label>
        <div className="flex gap-2 flex-wrap">
          {HAIR_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => update({ hairColor: c })}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${character.hairColor === c ? 'border-cocoa scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Skin Color */}
      <div className="bg-cloud rounded-xl p-4">
        <label className="text-sm font-medium text-cocoa block mb-2">Skin Color</label>
        <div className="flex gap-2 flex-wrap">
          {SKIN_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => update({ skinColor: c })}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${character.skinColor === c ? 'border-cocoa scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Hair Style */}
      <div className="bg-cloud rounded-xl p-4">
        <label className="text-sm font-medium text-cocoa block mb-2">Hair Style</label>
        <div className="flex gap-2 flex-wrap">
          {HAIR_STYLES.map((s, i) => (
            <button
              key={s}
              onClick={() => update({ hairStyle: i })}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                character.hairStyle === i ? 'bg-lavender text-cocoa' : 'bg-mist text-bark hover:bg-lavender/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Body Type */}
      <div className="bg-cloud rounded-xl p-4">
        <label className="text-sm font-medium text-cocoa block mb-2">Body Type</label>
        <div className="flex gap-2 flex-wrap">
          {BODY_TYPES.map((b, i) => (
            <button
              key={b}
              onClick={() => update({ bodyType: i })}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                character.bodyType === i ? 'bg-lavender text-cocoa' : 'bg-mist text-bark hover:bg-lavender/50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Owned Items */}
      <div className="bg-cloud rounded-xl p-4">
        <label className="text-sm font-medium text-cocoa block mb-2">Owned Outfits</label>
        <div className="flex gap-2 flex-wrap">
          {character.ownedOutfits.map((o) => (
            <button
              key={o}
              onClick={() => update({ outfit: o })}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                character.outfit === o ? 'bg-sage text-cocoa' : 'bg-mist text-bark hover:bg-sage/50'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterPage;
