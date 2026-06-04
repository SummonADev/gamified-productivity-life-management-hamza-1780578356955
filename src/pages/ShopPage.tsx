import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { SHOP_ITEMS } from '@/lib/constants';
import type { ShopItem } from '@/types';

const categories = ['all', 'clothing', 'accessory', 'pet', 'furniture'] as const;
type Category = (typeof categories)[number];

const ShopPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const [filter, setFilter] = useState<Category>('all');

  const filtered = filter === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.category === filter);

  const isOwned = (item: ShopItem): boolean => {
    if (item.category === 'clothing') return state.character.ownedOutfits.includes(item.id);
    if (item.category === 'accessory' || item.category === 'pet') return state.character.ownedAccessories.includes(item.id);
    return false;
  };

  const handleBuy = (item: ShopItem) => {
    if (state.coins < item.cost) return;
    if (isOwned(item) && item.category !== 'furniture') return;
    dispatch({ type: 'BUY_ITEM', payload: item });
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cocoa">🛍️ Shop</h1>
        <span className="text-lg font-bold text-honey-dark">🪙 {state.coins}</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === c ? 'bg-lavender text-cocoa' : 'bg-mist text-bark hover:bg-lavender/50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const owned = isOwned(item);
          const canAfford = state.coins >= item.cost;
          return (
            <div key={item.id} className="bg-cloud rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">{item.emoji}</div>
              <h3 className="font-bold text-cocoa text-sm">{item.name}</h3>
              <p className="text-xs text-bark mb-2">{item.description}</p>
              <p className="text-sm font-bold text-honey-dark mb-2">{item.cost} 🪙</p>
              {owned && item.category !== 'furniture' ? (
                <span className="inline-block bg-sage/30 text-sage-dark px-3 py-1 rounded-lg text-xs font-medium">Owned</span>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    canAfford
                      ? 'bg-sage hover:bg-sage-dark text-cocoa'
                      : 'bg-mist text-bark cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Buy' : 'Not enough'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopPage;
