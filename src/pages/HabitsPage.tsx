import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import type { Habit } from '@/types';
import { getTodayString } from '@/lib/helpers';
import { Trash2, CheckCircle, Plus, Flame } from 'lucide-react';

const HABIT_ICONS = ['💧', '🏃', '📖', '🧘', '💤', '🥗', '✍️', '🎵', '🌿', '💪'];

const HabitsPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [icon, setIcon] = useState<string>(HABIT_ICONS[0]);
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');
  const today = getTodayString();

  const handleAdd = () => {
    if (!title.trim()) return;
    const habit: Habit = {
      id: uuidv4(),
      title: title.trim(),
      icon,
      frequency,
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
      xpReward: frequency === 'daily' ? 10 : frequency === 'weekly' ? 25 : 50,
    };
    dispatch({ type: 'ADD_HABIT', payload: habit });
    setTitle('');
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cocoa">🔁 Habits</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-sage hover:bg-sage-dark text-cocoa px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> New Habit
        </button>
      </div>

      {showForm && (
        <div className="bg-cloud rounded-xl p-4 space-y-3">
          <input
            className="w-full bg-white rounded-lg px-3 py-2 text-cocoa border border-mist focus:outline-none focus:border-sage"
            placeholder="Habit name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {HABIT_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                  icon === ic ? 'bg-lavender' : 'bg-mist hover:bg-lavender/50'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            {(['daily', 'weekly', 'monthly'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  frequency === f ? 'bg-lavender text-cocoa' : 'bg-mist text-bark hover:bg-lavender/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button onClick={handleAdd} className="bg-sage hover:bg-sage-dark text-cocoa px-4 py-2 rounded-lg font-medium transition-colors">
            Add Habit
          </button>
        </div>
      )}

      <div className="space-y-3">
        {state.habits.length === 0 && (
          <p className="text-bark text-center py-8">No habits yet. Start building one! 🌱</p>
        )}
        {state.habits.map((habit) => {
          const doneToday = habit.completedDates.includes(today);
          return (
            <div key={habit.id} className="bg-cloud rounded-xl p-4 flex items-center gap-3">
              <button
                onClick={() => !doneToday && dispatch({ type: 'COMPLETE_HABIT', payload: habit.id })}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                  doneToday ? 'bg-sage scale-105' : 'bg-mist hover:bg-sage/50'
                }`}
                disabled={doneToday}
              >
                {habit.icon}
              </button>
              <div className="flex-1">
                <h3 className={`font-bold ${doneToday ? 'text-sage-dark' : 'text-cocoa'}`}>{habit.title}</h3>
                <div className="flex gap-2 text-xs text-bark">
                  <span className="flex items-center gap-0.5"><Flame size={12} /> {habit.streak}</span>
                  <span>· Best: {habit.bestStreak}</span>
                  <span>· {habit.frequency}</span>
                </div>
              </div>
              {doneToday && <CheckCircle size={20} className="text-sage" />}
              <button
                onClick={() => dispatch({ type: 'DELETE_HABIT', payload: habit.id })}
                className="text-rose hover:text-rose-dark"
              >
                <Trash2 size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitsPage;
