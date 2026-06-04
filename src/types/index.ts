export interface Task {
  id: string;
  title: string;
  description: string;
  targetDeadline: string | null;
  graceDays: number;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  projectId: string | null;
  questType: 'daily' | 'weekly' | 'epic';
  xpReward: number;
  coinReward: number;
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  milestones: Milestone[];
  createdAt: string;
  color: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  bestStreak: number;
  completedDates: string[];
  createdAt: string;
  xpReward: number;
}

export interface CharacterState {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  mood: 'happy' | 'excited' | 'sleepy' | 'proud' | 'encouraging';
  bodyType: number;
  hairStyle: number;
  hairColor: string;
  skinColor: string;
  outfit: string;
  accessories: string[];
  ownedOutfits: string[];
  ownedAccessories: string[];
}

export interface WorldArea {
  id: string;
  name: string;
  emoji: string;
  unlocked: boolean;
  level: number;
  maxLevel: number;
  description: string;
  unlockCost: number;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'clothing' | 'accessory' | 'furniture' | 'pet';
  emoji: string;
  cost: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'productivity' | 'consistency' | 'exploration';
  unlocked: boolean;
  condition: number;
}

export interface RoomItem {
  id: string;
  itemId: string;
  name: string;
  emoji: string;
}

export interface GameState {
  character: CharacterState;
  coins: number;
  tasks: Task[];
  projects: Project[];
  habits: Habit[];
  worldAreas: WorldArea[];
  achievements: Achievement[];
  roomItems: RoomItem[];
  totalTasksCompleted: number;
  totalXpEarned: number;
  totalCoinsEarned: number;
  lastCheckIn: string | null;
  dailyCheckInStreak: number;
}

export type GameAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_SUBTASK'; payload: { taskId: string; subtaskId: string } }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'COMPLETE_MILESTONE'; payload: { projectId: string; milestoneId: string } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'COMPLETE_HABIT'; payload: string }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'UNLOCK_AREA'; payload: string }
  | { type: 'UPGRADE_AREA'; payload: string }
  | { type: 'BUY_ITEM'; payload: ShopItem }
  | { type: 'DAILY_CHECK_IN' }
  | { type: 'UPDATE_CHARACTER'; payload: Partial<CharacterState> }
  | { type: 'SET_STATE'; payload: GameState };
