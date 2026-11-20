import { ShoppingBag, ChevronDown } from 'lucide-react';
import { AppTab, FulfillmentMode } from '../types/acai';

interface TopBarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onJumpToBundles: () => void;
  bagCount: number;
  bagTotal: number;
  fulfillmentMode: FulfillmentMode;
  selectedSlotLabel: string;
  onOpenFulfillment: () => void;
}

const MODE_LABELS: Record<FulfillmentMode, string> = {
  'dine-in': 'Dine In',
  collect: 'Collect',
  delivery: 'Delivery',
};

export function TopBar({
  activeTab,
  onSelectTab,
  onJumpToBundles,
  bagCount,
  bagTotal,
  fulfillmentMode,
  selectedSlotLabel,
  onOpenFulfillment,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/92 backdrop-blur-md border-b border-stone-200/80">
      {/* Desktop 3-Zone Contract */}
      <div className="hidden lg:flex max-w-6xl mx-auto items-center justify-between gap-8 px-6 h-16">
        <button
          type="button"
          onClick={() => onSelectTab('order')}
          className="font-display text-2xl font-bold tracking-tight text-[#1C181F] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B1248]"
        >
          Roxa
        </button>

        <nav className="flex items-center gap-7 text-sm font-medium text-stone-600" aria-label="Main navigation">
          <button
            type="button"
            onClick={() => onSelectTab('order')}
            className={`py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer hover:text-[#1C181F] ${
              activeTab === 'order' ? 'text-[#3B1248] font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            Menu
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('build')}
            className={`py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer hover:text-[#1C181F] ${
              activeTab === 'build' ? 'text-[#3B1248] font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            Custom Bowl
          </button>
          <button
            type="button"
            onClick={onJumpToBundles}
            className="py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer hover:text-[#1C181F]"
          >
            Bundles
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('club')}
            className={`py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer hover:text-[#1C181F] ${
              activeTab === 'club' ? 'text-[#3B1248] font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            Roxa Club
          </button>
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('bag')}
            className="inline-flex items-center gap-2.5 min-h-[40px] px-4 py-2 rounded-xl bg-[#3B1248] text-white text-sm font-medium hover:bg-[#260A30] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B1248]"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.8} />
            <span className="tabular-nums">
              {bagCount > 0 ? `Bag (${bagCount}) · $${bagTotal.toFixed(2)}` : 'Bag (0)'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Compact Header (<= 52px) */}
      <div className="lg:hidden flex items-center justify-between px-4 h-[52px]">
        <button
          type="button"
          onClick={() => onSelectTab('order')}
          className="font-display text-xl font-bold tracking-tight text-[#1C181F] whitespace-nowrap shrink-0 min-h-[44px] flex items-center"
        >
          Roxa
        </button>

        <button
          type="button"
          onClick={onOpenFulfillment}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 text-xs font-medium text-[#1C181F] hover:text-[#3B1248] transition-colors whitespace-nowrap shrink-0"
          aria-label="Change pre-order fulfillment and time"
        >
          <span className="text-[#3B1248] font-semibold">{MODE_LABELS[fulfillmentMode]}</span>
          <span aria-hidden="true" className="text-stone-400">·</span>
          <span className="text-stone-600 tabular-nums max-w-[130px] truncate">{selectedSlotLabel}</span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        </button>
      </div>
    </header>
  );
}
