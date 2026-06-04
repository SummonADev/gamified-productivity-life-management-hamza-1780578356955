import React from 'react';
import { useGame } from '@/context/GameContext';
import { SHOP_ITEMS } from '@/lib/constants';
import type { ShopItem } from '@/types';

const ShopPage: React.FC = () => {
  const { state, dispatch } = useGame();

  const isOwned = (item: ShopItem) => {
    if (item.category === 'clothing') return state.character.ownedOutfits.includes(item.id);
    if (item.category === 'accessory' || item.category === 'pet') return state.character.ownedAccessories.includes(item.id);
    return state.roomItems.some((r) => r.itemId === item.id);
  };

  const canAfford = (item: ShopItem) => state.coins >= item.cost;

  const categories = ['clothing', 'accessory', 'pet', 'furniture'] as const;
  const categoryLabels = { clothing: '👕 Clothing', accessory: '🎀 Accessories', pet: '🐾 Pets', furniture: '🛋️ Furniture' };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cocoa">🛒 Shop</h1>
        <span className="text-lg font-bold text-honey-dark">🪙 {state.coins}</span>
      </div>

      {categories.map((cat) => {
        const items = SHOP_ITEMS.filter((i) => i.category === cat);
        return (
          <div key={cat}>
            <h2 className="text-lg font-bold text-cocoa mb-3">{categoryLabels[cat]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((item) => {
                const owned = isOwned(item);
                const afford = canAfford(item);
                return (
                  <div key={item.id} className="bg-cloud rounded-xl p-4 flex items-center gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-cocoa">{item.name}</h3>
                      <p className="text-xs text-bark">{item.description}</p>
                      <p className="text-sm font-medium text-honey-dark">{item.cost} 🪙</p>
                    </div>
                    {owned ? (
                      <span className="text-sm text-sage-dark font-medium">Owned ✓</span>
                    ) : (
                      <button
                        onClick={() => dispatch({ type: 'BUY_ITEM', payload: item })}
                        disabled={!afford}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          afford
                            ? 'bg-honey hover:bg-honey-dark text-cocoa'
                            : 'bg-mist text-bark cursor-not-allowed'
                        }`}
                      >
                        Buy
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShopPage;
