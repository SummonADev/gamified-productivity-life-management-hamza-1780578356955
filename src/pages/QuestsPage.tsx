import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Subtask } from '@/types';
import { formatDate, getCompletionState } from '@/lib/helpers';
import { Trash2, CheckCircle, Plus, ChevronDown, ChevronUp } from 'lucide-react';

const QuestsPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questType, setQuestType] = useState<Task['questType']>('daily');
  const [deadline, setDeadline] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const xpMap = { daily: 15, weekly: 40, epic: 100 };
  const coinMap = { daily: 5, weekly: 15, epic: 40 };

  const handleAdd = () => {
    if (!title.trim()) return;
    const task: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      targetDeadline: deadline || null,
      graceDays: 2,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      projectId: null,
      questType,
      xpReward: xpMap[questType],
      coinReward: coinMap[questType],
      subtasks: [],
    };
    dispatch({ type: 'ADD_TASK', payload: task });
    setTitle('');
    setDescription('');
    setDeadline('');
    setShowForm(false);
  };

  const incomplete = state.tasks.filter((t) => !t.completed);
  const completed = state.tasks.filter((t) => t.completed);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cocoa">📜 Quests</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-sage hover:bg-sage-dark text-cocoa px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} /> New Quest
        </button>
      </div>

      {showForm && (
        <div className="bg-cloud rounded-xl p-4 space-y-3">
          <input
            className="w-full bg-white rounded-lg px-3 py-2 text-cocoa border border-mist focus:outline-none focus:border-sage"
            placeholder="Quest title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full bg-white rounded-lg px-3 py-2 text-cocoa border border-mist focus:outline-none focus:border-sage"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <div className="flex gap-3 flex-wrap">
            {(['daily', 'weekly', 'epic'] as const).map((qt) => (
              <button
                key={qt}
                onClick={() => setQuestType(qt)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  questType === qt ? 'bg-lavender text-cocoa' : 'bg-mist text-bark hover:bg-lavender/50'
                }`}
              >
                {qt === 'daily' ? '⭐ Daily' : qt === 'weekly' ? '🌟 Weekly' : '💫 Epic'}
              </button>
            ))}
          </div>
          <input
            type="date"
            className="bg-white rounded-lg px-3 py-2 text-cocoa border border-mist focus:outline-none focus:border-sage"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button onClick={handleAdd} className="bg-sage hover:bg-sage-dark text-cocoa px-4 py-2 rounded-lg font-medium transition-colors">
            Add Quest
          </button>
        </div>
      )}

      <div className="space-y-3">
        {incomplete.length === 0 && <p className="text-bark text-center py-8">No active quests. Create one above! 🗺️</p>}
        {incomplete.map((task) => (
          <div key={task.id} className="bg-cloud rounded-xl p-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => dispatch({ type: 'COMPLETE_TASK', payload: task.id })}
                className="text-sage hover:text-sage-dark mt-0.5"
              >
                <CheckCircle size={22} />
              </button>
              <div className="flex-1">
                <h3 className="font-bold text-cocoa">{task.title}</h3>
                {task.description && <p className="text-sm text-bark">{task.description}</p>}
                <div className="flex gap-2 mt-1 text-xs text-bark">
                  <span>{task.questType === 'daily' ? '⭐' : task.questType === 'weekly' ? '🌟' : '💫'} {task.questType}</span>
                  <span>· {task.xpReward} XP · {task.coinReward} 🪙</span>
                  {task.targetDeadline && <span>· Due {formatDate(task.targetDeadline)}</span>}
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                className="text-rose hover:text-rose-dark"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-bark mb-2">Completed ({completed.length})</h2>
          <div className="space-y-2">
            {completed.slice(0, 10).map((task) => (
              <div key={task.id} className="bg-cloud/50 rounded-xl p-3 flex items-center gap-3 opacity-70">
                <CheckCircle size={18} className="text-sage" />
                <span className="line-through text-bark flex-1">{task.title}</span>
                <button
                  onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                  className="text-rose/50 hover:text-rose"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestsPage;
