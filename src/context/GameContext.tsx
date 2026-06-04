import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { GameState, GameAction, CharacterState } from '@/types';
import { INITIAL_WORLD_AREAS, INITIAL_ACHIEVEMENTS, HAIR_COLORS, SKIN_COLORS } from '@/lib/constants';
import { loadState, saveState } from '@/lib/storage';
import { calculateLevel, getCompletionState, getRewardMultiplier, getTodayString } from '@/lib/helpers';
import { v4 as uuidv4 } from 'uuid';

const defaultCharacter: CharacterState = {
  name: 'Adventurer',
  level: 1,
  xp: 0,
  xpToNext: 100,
  mood: 'happy',
  bodyType: 0,
  hairStyle: 0,
  hairColor: HAIR_COLORS[0],
  skinColor: SKIN_COLORS[0],
  outfit: 'default',
  accessories: [],
  ownedOutfits: ['default'],
  ownedAccessories: [],
};

const defaultState: GameState = {
  character: defaultCharacter,
  coins: 50,
  tasks: [],
  projects: [],
  habits: [],
  worldAreas: INITIAL_WORLD_AREAS,
  achievements: INITIAL_ACHIEVEMENTS,
  roomItems: [],
  totalTasksCompleted: 0,
  totalXpEarned: 0,
  totalCoinsEarned: 50,
  lastCheckIn: null,
  dailyCheckInStreak: 0,
};

function checkAchievements(state: GameState): GameState {
  const updated = state.achievements.map(a => {
    if (a.unlocked) return a;
    let met = false;
    if (a.id === 'first-task' || a.id === 'tasks-10' || a.id === 'tasks-50' || a.id === 'tasks-100') {
      met = state.totalTasksCompleted >= a.condition;
    }
    if (a.id.startsWith('streak-')) {
      met = state.dailyCheckInStreak >= a.condition;
    }
    if (a.id === 'area-1' || a.id === 'area-3' || a.id === 'area-all') {
      const unlockedCount = state.worldAreas.filter(w => w.unlocked && w.id !== 'cottage').length;
      met = unlockedCount >= a.condition;
    }
    if (a.id === 'coins-500') {
      met = state.totalCoinsEarned >= a.condition;
    }
    if (a.id === 'room-5') {
      met = state.roomItems.length >= a.condition;
    }
    return met ? { ...a, unlocked: true } : a;
  });
  return { ...state, achievements: updated };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  let newState = state;

  switch (action.type) {
    case 'SET_STATE':
      return action.payload;

    case 'ADD_TASK':
      newState = { ...state, tasks: [...state.tasks, action.payload] };
      break;

    case 'COMPLETE_TASK': {
      const taskIndex = state.tasks.findIndex(t => t.id === action.payload);
      if (taskIndex === -1) return state;
      const task = state.tasks[taskIndex];
      if (task.completed) return state;
      const completedTask = { ...task, completed: true, completedAt: new Date().toISOString() };
      const compState = getCompletionState(completedTask);
      const multiplier = task.targetDeadline ? getRewardMultiplier(compState) : 1.0;
      const xpGained = Math.round(task.xpReward * multiplier);
      const coinsGained = Math.round(task.coinReward * multiplier);
      const totalXp = state.totalXpEarned + xpGained;
      const { level, xp, xpToNext } = calculateLevel(totalXp);
      const tasks = [...state.tasks];
      tasks[taskIndex] = completedTask;
      newState = {
        ...state,
        tasks,
        coins: state.coins + coinsGained,
        totalTasksCompleted: state.totalTasksCompleted + 1,
        totalXpEarned: totalXp,
        totalCoinsEarned: state.totalCoinsEarned + coinsGained,
        character: {
          ...state.character,
          level,
          xp,
          xpToNext,
          mood: 'happy',
        },
      };
      break;
    }

    case 'DELETE_TASK':
      newState = { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
      break;

    case 'TOGGLE_SUBTASK': {
      const { taskId, subtaskId } = action.payload;
      const tasks = state.tasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          ),
        };
      });
      newState = { ...state, tasks };
      break;
    }

    case 'ADD_PROJECT':
      newState = { ...state, projects: [...state.projects, action.payload] };
      break;

    case 'DELETE_PROJECT': {
      newState = {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        tasks: state.tasks.filter(t => t.projectId !== action.payload),
      };
      break;
    }

    case 'COMPLETE_MILESTONE': {
      const { projectId, milestoneId } = action.payload;
      const xpGained = 25;
      const coinsGained = 15;
      const totalXp = state.totalXpEarned + xpGained;
      const { level, xp, xpToNext } = calculateLevel(totalXp);
      const projects = state.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          milestones: p.milestones.map(m =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          ),
        };
      });
      newState = {
        ...state,
        projects,
        coins: state.coins + coinsGained,
        totalXpEarned: totalXp,
        totalCoinsEarned: state.totalCoinsEarned + coinsGained,
        character: { ...state.character, level, xp, xpToNext, mood: 'proud' },
      };
      break;
    }

    case 'ADD_HABIT':
      newState = { ...state, habits: [...state.habits, action.payload] };
      break;

    case 'DELETE_HABIT':
      newState = { ...state, habits: state.habits.filter(h => h.id !== action.payload) };
      break;

    case 'COMPLETE_HABIT': {
      const today = getTodayString();
      const habits = state.habits.map(h => {
        if (h.id !== action.payload) return h;
        if (h.completedDates.includes(today)) return h;
        const newStreak = h.streak + 1;
        return {
          ...h,
          completedDates: [...h.completedDates, today],
          streak: newStreak,
          bestStreak: Math.max(h.bestStreak, newStreak),
        };
      });
      const habit = state.habits.find(h => h.id === action.payload);
      const xpGained = habit ? habit.xpReward : 10;
      const coinsGained = 5;
      const totalXp = state.totalXpEarned + xpGained;
      const { level, xp, xpToNext } = calculateLevel(totalXp);
      newState = {
        ...state,
        habits,
        coins: state.coins + coinsGained,
        totalXpEarned: totalXp,
        totalCoinsEarned: state.totalCoinsEarned + coinsGained,
        character: { ...state.character, level, xp, xpToNext, mood: 'happy' },
      };
      break;
    }

    case 'UNLOCK_AREA': {
      const area = state.worldAreas.find(a => a.id === action.payload);
      if (!area || area.unlocked || state.coins < area.unlockCost) return state;
      const worldAreas = state.worldAreas.map(a =>
        a.id === action.payload ? { ...a, unlocked: true, level: 1 } : a
      );
      newState = {
        ...state,
        worldAreas,
        coins: state.coins - area.unlockCost,
        character: { ...state.character, mood: 'excited' },
      };
      break;
    }

    case 'UPGRADE_AREA': {
      const area = state.worldAreas.find(a => a.id === action.payload);
      if (!area || !area.unlocked || area.level >= area.maxLevel) return state;
      const cost = (area.level + 1) * 25;
      if (state.coins < cost) return state;
      const worldAreas = state.worldAreas.map(a =>
        a.id === action.payload ? { ...a, level: a.level + 1 } : a
      );
      newState = { ...state, worldAreas, coins: state.coins - cost };
      break;
    }

    case 'BUY_ITEM': {
      const item = action.payload;
      if (state.coins < item.cost) return state;
      const roomItem = { id: uuidv4(), itemId: item.id, name: item.name, emoji: item.emoji };
      let character = state.character;
      if (item.category === 'clothing') {
        character = { ...character, ownedOutfits: [...character.ownedOutfits, item.id] };
      } else if (item.category === 'accessory' || item.category === 'pet') {
        character = { ...character, ownedAccessories: [...character.ownedAccessories, item.id] };
      }
      newState = {
        ...state,
        coins: state.coins - item.cost,
        character,
        roomItems: item.category === 'furniture' ? [...state.roomItems, roomItem] : state.roomItems,
      };
      break;
    }

    case 'DAILY_CHECK_IN': {
      const today = getTodayString();
      if (state.lastCheckIn === today) return state;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      const streak = state.lastCheckIn === yStr ? state.dailyCheckInStreak + 1 : 1;
      const coinsGained = 10 + Math.min(streak, 30);
      const xpGained = 15;
      const totalXp = state.totalXpEarned + xpGained;
      const { level, xp, xpToNext } = calculateLevel(totalXp);
      newState = {
        ...state,
        lastCheckIn: today,
        dailyCheckInStreak: streak,
        coins: state.coins + coinsGained,
        totalXpEarned: totalXp,
        totalCoinsEarned: state.totalCoinsEarned + coinsGained,
        character: { ...state.character, level, xp, xpToNext, mood: streak >= 7 ? 'excited' : 'happy' },
      };
      break;
    }

    case 'UPDATE_CHARACTER':
      newState = { ...state, character: { ...state.character, ...action.payload } };
      break;

    default:
      return state;
  }

  return checkAchievements(newState);
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, defaultState, (initial) => {
    const saved = loadState();
    return saved ?? initial;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
