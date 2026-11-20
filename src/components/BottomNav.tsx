import { Award, ShoppingBag, SlidersHorizontal, Utensils } from 'lucide-react';
import { AppTab } from '../types/acai';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  bagCount: number;
}

export function BottomNav({ activeTab, onSelectTab, bagCount }: BottomNavProps) {
  const items: { id: AppTab; label: string; icon: typeof Utensils }[] = [
    { id: 'order', label: 'Order', icon: Utensils },
    { id: 'build', label: 'Build', icon: SlidersHorizontal },
    { id: 'club', label: 'Club', icon: Award },
    { id: 'bag', label: 'Bag', icon: ShoppingBag },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-4 items-center h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] w-full transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#3B1248] ${
                isActive ? 'text-[#3B1248]' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.2 : 1.7} />
                {item.id === 'bag' && bagCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#3B1248] text-white text-[10px] font-mono font-semibold flex items-center justify-center tabular-nums">
                    {bagCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] tracking-tight mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
