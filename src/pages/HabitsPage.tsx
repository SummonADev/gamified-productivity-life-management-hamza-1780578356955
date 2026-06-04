import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import type { Habit } from '@/types';
import { getTodayString } from '@/lib/helpers';
import { Trash2, Plus, CheckCircle } from 'lucide-react';

const HABIT_ICONS = ['💧', '🏃', '📖', '🧘', '💤', '🥗', '🎵', '✍️', '🧹', '🌿'];

const HabitsPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState(HABIT_ICONS[0]);
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
                className={`text-xl p-1 rounded-lg ${icon === ic ? 'bg-lavender' : 'hover:bg-mist'}`}
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
        {state.habits.length === 0 && <p className="text-bark text-center py-8">No habits yet. Start building good ones! 🌱</p>}
        {state.habits.map((habit) => {
          const doneToday = habit.completedDates.includes(today);
          return (
            <div key={habit.id} className="bg-cloud rounded-xl p-4 flex items-center gap-4">
              <button
                onClick={() => !doneToday && dispatch({ type: 'COMPLETE_HABIT', payload: habit.id })}
                className={`text-3xl transition-transform ${doneToday ? 'opacity-50' : 'hover:scale-110'}`}
                disabled={doneToday}
              >
                {doneToday ? <CheckCircle size={28} className="text-sage" /> : <span>{habit.icon}</span>}
              </button>
              <div className="flex-1">
                <h3 className={`font-bold ${doneToday ? 'line-through text-bark' : 'text-cocoa'}`}>{habit.title}</h3>
                <p className="text-xs text-bark">
                  🔥 Streak: {habit.streak} · Best: {habit.bestStreak} · {habit.frequency}
                </p>
              </div>
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
