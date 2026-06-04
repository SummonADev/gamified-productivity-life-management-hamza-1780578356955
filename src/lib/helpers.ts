import { XP_PER_LEVEL, POSITIVE_MESSAGES, WELCOME_BACK_MESSAGES } from '@/lib/constants';
import type { Task, CharacterState } from '@/types';

export function calculateLevel(totalXp: number): { level: number; xp: number; xpToNext: number } {
  let level = 1;
  let remaining = totalXp;
  let needed = XP_PER_LEVEL;
  while (remaining >= needed) {
    remaining -= needed;
    level++;
    needed = Math.floor(XP_PER_LEVEL * (1 + (level - 1) * 0.1));
  }
  return { level, xp: remaining, xpToNext: needed };
}

export function getCompletionState(task: Task): 'early' | 'ontime' | 'grace' | 'missed' | 'none' {
  if (!task.completed || !task.completedAt || !task.targetDeadline) return 'none';
  const completed = new Date(task.completedAt);
  const target = new Date(task.targetDeadline);
  const final = new Date(target);
  final.setDate(final.getDate() + task.graceDays);

  const dayBefore = new Date(target);
  dayBefore.setDate(dayBefore.getDate() - 1);

  if (completed <= dayBefore) return 'early';
  if (completed <= target) return 'ontime';
  if (completed <= final) return 'grace';
  return 'missed';
}

export function getRewardMultiplier(state: 'early' | 'ontime' | 'grace' | 'missed' | 'none'): number {
  switch (state) {
    case 'early': return 1.5;
    case 'ontime': return 1.0;
    case 'grace': return 0.5;
    case 'missed': return 0.25;
    default: return 1.0;
  }
}

export function getMood(character: CharacterState, recentActivity: boolean): CharacterState['mood'] {
  if (!recentActivity) return 'sleepy';
  if (character.level > 5) return 'proud';
  return 'happy';
}

export function getRandomMessage(): string {
  return POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
}

export function getWelcomeMessage(): string {
  return WELCOME_BACK_MESSAGES[Math.floor(Math.random() * WELCOME_BACK_MESSAGES.length)];
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function progressPercent(current: number, max: number): number {
  if (max === 0) return 0;
  return Math.min(100, Math.round((current / max) * 100));
}
