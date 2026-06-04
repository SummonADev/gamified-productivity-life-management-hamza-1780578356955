import type { WorldArea, ShopItem, Achievement } from '@/types';

export const INITIAL_WORLD_AREAS: WorldArea[] = [
  { id: 'cottage', name: 'Starter Cottage', emoji: '🏡', unlocked: true, level: 1, maxLevel: 5, description: 'Your cozy home base', unlockCost: 0 },
  { id: 'garden', name: 'Garden', emoji: '🌻', unlocked: false, level: 0, maxLevel: 5, description: 'A peaceful place to grow flowers', unlockCost: 50 },
  { id: 'forest', name: 'Forest', emoji: '🌲', unlocked: false, level: 0, maxLevel: 5, description: 'A magical forest full of secrets', unlockCost: 100 },
  { id: 'beach', name: 'Beach', emoji: '🏖️', unlocked: false, level: 0, maxLevel: 5, description: 'Waves gently lap at the shore', unlockCost: 150 },
  { id: 'mountain', name: 'Mountain', emoji: '⛰️', unlocked: false, level: 0, maxLevel: 5, description: 'A majestic peak with stunning views', unlockCost: 200 },
  { id: 'town', name: 'Town Square', emoji: '🏘️', unlocked: false, level: 0, maxLevel: 5, description: 'The heart of the community', unlockCost: 250 },
  { id: 'observatory', name: 'Observatory', emoji: '🔭', unlocked: false, level: 0, maxLevel: 5, description: 'Gaze at the stars and dream', unlockCost: 300 },
  { id: 'festival', name: 'Festival Grounds', emoji: '🎪', unlocked: false, level: 0, maxLevel: 5, description: 'Where seasonal celebrations happen', unlockCost: 400 },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'shirt-cozy', name: 'Cozy Sweater', category: 'clothing', emoji: '🧶', cost: 30, description: 'A warm and comfy sweater' },
  { id: 'shirt-flower', name: 'Flower Shirt', category: 'clothing', emoji: '🌸', cost: 25, description: 'A shirt with pretty flower patterns' },
  { id: 'hat-beret', name: 'Artist Beret', category: 'clothing', emoji: '🎨', cost: 35, description: 'For the creative soul' },
  { id: 'hat-wizard', name: 'Wizard Hat', category: 'clothing', emoji: '🧙', cost: 50, description: 'Channel your inner wizard' },
  { id: 'glasses-round', name: 'Round Glasses', category: 'accessory', emoji: '👓', cost: 20, description: 'Scholarly and cute' },
  { id: 'scarf-rainbow', name: 'Rainbow Scarf', category: 'accessory', emoji: '🌈', cost: 25, description: 'A colorful scarf for any weather' },
  { id: 'pet-cat', name: 'Cozy Cat', category: 'pet', emoji: '🐱', cost: 80, description: 'A purring companion' },
  { id: 'pet-dog', name: 'Happy Puppy', category: 'pet', emoji: '🐶', cost: 80, description: 'Always excited to see you' },
  { id: 'pet-bunny', name: 'Fluffy Bunny', category: 'pet', emoji: '🐰', cost: 70, description: 'Soft and sweet' },
  { id: 'pet-bird', name: 'Songbird', category: 'pet', emoji: '🐦', cost: 60, description: 'Sings a cheerful tune' },
  { id: 'furn-plant', name: 'Potted Plant', category: 'furniture', emoji: '🪴', cost: 15, description: 'Brings life to any room' },
  { id: 'furn-lamp', name: 'Fairy Lamp', category: 'furniture', emoji: '✨', cost: 20, description: 'A warm magical glow' },
  { id: 'furn-bookshelf', name: 'Bookshelf', category: 'furniture', emoji: '📚', cost: 40, description: 'Filled with wonderful stories' },
  { id: 'furn-rug', name: 'Cozy Rug', category: 'furniture', emoji: '🟤', cost: 25, description: 'Soft under your feet' },
  { id: 'furn-painting', name: 'Nature Painting', category: 'furniture', emoji: '🖼️', cost: 30, description: 'A beautiful landscape' },
  { id: 'wings-fairy', name: 'Fairy Wings', category: 'accessory', emoji: '🧚', cost: 100, description: 'Sparkly and magical' },
  { id: 'backpack-adventure', name: 'Adventure Pack', category: 'accessory', emoji: '🎒', cost: 45, description: 'Ready for any quest' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-task', title: 'First Step', description: 'Complete your first task', emoji: '⭐', category: 'productivity', unlocked: false, condition: 1 },
  { id: 'tasks-10', title: 'Getting Going', description: 'Complete 10 tasks', emoji: '🌟', category: 'productivity', unlocked: false, condition: 10 },
  { id: 'tasks-50', title: 'Productive Soul', description: 'Complete 50 tasks', emoji: '💫', category: 'productivity', unlocked: false, condition: 50 },
  { id: 'tasks-100', title: 'Century Club', description: 'Complete 100 tasks', emoji: '🏆', category: 'productivity', unlocked: false, condition: 100 },
  { id: 'streak-7', title: 'Week Warrior', description: 'Maintain a 7-day check-in streak', emoji: '🔥', category: 'consistency', unlocked: false, condition: 7 },
  { id: 'streak-30', title: 'Monthly Master', description: 'Maintain a 30-day check-in streak', emoji: '💪', category: 'consistency', unlocked: false, condition: 30 },
  { id: 'streak-100', title: 'Legendary', description: 'Maintain a 100-day streak', emoji: '👑', category: 'consistency', unlocked: false, condition: 100 },
  { id: 'area-1', title: 'Explorer', description: 'Unlock your first new area', emoji: '🗺️', category: 'exploration', unlocked: false, condition: 1 },
  { id: 'area-3', title: 'Adventurer', description: 'Unlock 3 areas', emoji: '🧭', category: 'exploration', unlocked: false, condition: 3 },
  { id: 'area-all', title: 'World Builder', description: 'Unlock all areas', emoji: '🌍', category: 'exploration', unlocked: false, condition: 7 },
  { id: 'coins-500', title: 'Saver', description: 'Earn 500 total coins', emoji: '💰', category: 'productivity', unlocked: false, condition: 500 },
  { id: 'room-5', title: 'Decorator', description: 'Place 5 items in your room', emoji: '🏠', category: 'exploration', unlocked: false, condition: 5 },
];

export const POSITIVE_MESSAGES: string[] = [
  'You made progress today! 🌱',
  'Every little step counts! 🌈',
  'Your future self appreciates this! 💛',
  'You\'re doing amazing! ✨',
  'Keep going at your own pace! 🐌',
  'Small steps lead to big adventures! 🗺️',
  'You\'re growing stronger every day! 🌻',
  'Be proud of yourself! 🌟',
  'You showed up, and that matters! 💜',
  'Progress, not perfection! 🎨',
];

export const WELCOME_BACK_MESSAGES: string[] = [
  'Welcome back! We missed you! 💕',
  'So glad to see you again! 🌸',
  'Your world has been waiting for you! 🏡',
  'Ready for a new adventure? 🗺️',
  'It\'s always a good time to start! 🌅',
];

export const XP_PER_LEVEL = 100;

export const HAIR_COLORS = ['#2C1810', '#8B4513', '#DAA520', '#B22222', '#FF6347', '#FF69B4', '#9370DB', '#4682B4', '#2E8B57', '#F5F5DC'];
export const SKIN_COLORS = ['#FFDBB4', '#EDB98A', '#D08B5B', '#AE5D29', '#694D3D', '#F5D6C3'];
export const HAIR_STYLES = ['Short & Neat', 'Long & Flowing', 'Curly', 'Ponytail', 'Bun', 'Braids', 'Pixie Cut', 'Wavy'];
export const BODY_TYPES = ['Petite', 'Average', 'Athletic', 'Curvy', 'Tall'];
