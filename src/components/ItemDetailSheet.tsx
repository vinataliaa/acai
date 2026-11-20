import { useState } from 'react';
import { Minus, Plus, UserPlus, X } from 'lucide-react';
import { BASE_OPTIONS, BOWL_SIZES } from '../data/acaiData';
import { BowlSizeId, MenuItem } from '../types/acai';
import { BowlImage } from './BowlImage';

interface ItemDetailSheetProps {
  item: MenuItem | null;
  isMember: boolean;
  onClose: () => void;
  onOpenJoinSheet: (reason?: string) => void;
  onAddToBag: (payload: {
    item: MenuItem;
    sizeId: BowlSizeId;
    baseId: string;
    quantity: number;
    unitPrice: number;
    memberUnitPrice: number;
    notes: string;
  }) => void;
}

export function ItemDetailSheet({
  item,
  isMember,
  onClose,
  onOpenJoinSheet,
  onAddToBag,
}: ItemDetailSheetProps) {
  const [sizeId, setSizeId] = useState<BowlSizeId>('regular');
  const [baseId, setBaseId] = useState<string>(item?.defaultBaseId ?? 'para-velvet');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!item) return null;

  const isBundle = item.category === 'bundle';
  const sizeObj = BOWL_SIZES.find((s) => s.id === sizeId) ?? BOWL_SIZES[0];
  const baseObj = BASE_OPTIONS.find((b) => b.id === baseId) ?? BASE_OPTIONS[0];
  const defaultBaseObj = BASE_OPTIONS.find((b) => b.id === item.defaultBaseId) ?? BASE_OPTIONS[0];

  const baseSwapDelta = isBundle ? 0 : Math.max(0, baseObj.priceDelta - defaultBaseObj.priceDelta);
  const guestUnitPrice = item.price + (isBundle ? 0 : sizeObj.priceDelta) + baseSwapDelta;
  const memberUnitPrice = item.memberPrice + (isBundle ? 0 : sizeObj.priceDelta) + baseSwapDelta;
  const activeUnitPrice = isMember ? memberUnitPrice : guestUnitPrice;
  const totalPrice = activeUnitPrice * quantity;
  const displayKcal = item.calories + (isBundle ? 0 : sizeObj.kcalDelta);

  const handleSubmit = () => {
    onAddToBag({
      item,
      sizeId: isBundle ? 'regular' : sizeId,
      baseId: isBundle ? item.defaultBaseId : baseId,
      quantity,
      unitPrice: guestUnitPrice,
      memberUnitPrice,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="Dismiss item details"
      />

      <div className="relative z-10 w-full lg:max-w-2xl bg-[#FAF9F6] rounded-t-3xl lg:rounded-3xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden">
        <div className="lg:hidden pt-3 pb-1 flex justify-center bg-white shrink-0">
          <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
        </div>

        {/* Compact Sticky Sheet Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-stone-200 bg-white shrink-0">
          <div className="min-w-0">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[#1C181F] truncate">
              {item.name}
            </h2>
            <p className="text-[11px] text-stone-500 truncate tabular-nums">
              {item.flavorNotes.join(' · ')} · {displayKcal} kcal
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl text-stone-500 hover:text-[#1C181F] hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close item details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unified Scrollable Body (Image scrolls away cleanly so customization has full space) */}
        <div className="flex-1 p-5 overflow-y-auto overscroll-contain space-y-5">
          <div className="flex flex-col sm:flex-row gap-4 items-start bg-white rounded-2xl border border-stone-200 p-3.5">
            <div className="w-full sm:w-36 h-32 sm:h-28 rounded-xl overflow-hidden bg-stone-100 shrink-0">
              <BowlImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-[#3B1248]">{item.harvestOrigin}</p>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mt-1">
                {item.description}
              </p>
            </div>
          </div>

          {!isMember && (
            <div className="p-3 rounded-xl bg-[#F4EFF6] border border-[#3B1248]/15 flex items-center justify-between gap-3">
              <span className="text-xs text-[#3B1248] font-medium tabular-nums">
                Member price: <strong>${memberUnitPrice.toFixed(2)}</strong> (save $
                {(guestUnitPrice - memberUnitPrice).toFixed(2)} + $3.00 welcome credit)
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenJoinSheet(`Get ${item.name} at the $${memberUnitPrice.toFixed(2)} member price`);
                }}
                className="text-xs font-semibold text-[#3B1248] underline whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Join Free</span>
              </button>
            </div>
          )}

          {item.includedItems && (
            <div className="border-t border-stone-200 pt-4">
              <p className="text-xs font-semibold text-stone-800 mb-2">Included in this Bundle</p>
              <ul className="space-y-1.5 text-sm text-stone-700">
                {item.includedItems.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {item.compareAtPrice && (
                <p className="text-xs font-semibold text-[#2F6B3B] mt-2.5 tabular-nums">
                  Bundle advantage: Save ${(item.compareAtPrice - activeUnitPrice).toFixed(2)} vs. ordering separately
                </p>
              )}
            </div>
          )}

          {!isBundle && (
            <>
              <div className="border-t border-stone-200 pt-4">
                <p className="text-xs font-semibold text-stone-800 mb-2.5">Bowl Size</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {BOWL_SIZES.map((s) => {
                    const selected = sizeId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSizeId(s.id)}
                        className={`min-h-[52px] px-3.5 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#F4EFF6] border-[#3B1248] text-[#3B1248]'
                            : 'bg-white border-stone-200 text-[#1C181F] hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{s.label}</span>
                          <span className="font-mono tabular-nums">
                            {s.priceDelta === 0 ? 'Included' : `+$${s.priceDelta.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 tabular-nums">
                          {s.weightGrams}g cold-spun base
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4">
                <p className="text-xs font-semibold text-stone-800 mb-2.5">Açai Base Blend</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BASE_OPTIONS.map((b) => {
                    const selected = baseId === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBaseId(b.id)}
                        className={`min-h-[52px] px-3.5 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          selected
                            ? 'bg-[#F4EFF6] border-[#3B1248] text-[#3B1248]'
                            : 'bg-white border-stone-200 text-[#1C181F] hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{b.name}</span>
                          <span className="font-mono tabular-nums">
                            {b.id === item.defaultBaseId
                              ? 'Default'
                              : b.priceDelta > defaultBaseObj.priceDelta
                                ? `+$${(b.priceDelta - defaultBaseObj.priceDelta).toFixed(2)}`
                                : 'No extra cost'}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{b.sugarNote}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="border-t border-stone-200 pt-4 pb-2">
            <label htmlFor="item-prep-note" className="block text-xs font-semibold text-stone-800 mb-1.5">
              Preparation Note (Optional)
            </label>
            <input
              id="item-prep-note"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Crunch on the side, extra crisp coconut..."
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm text-[#1C181F] placeholder:text-stone-400 focus:outline-none focus:border-[#3B1248]"
            />
            <p className="text-[11px] text-stone-500 mt-2">Allergens: {item.allergens.join(', ')}</p>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-stone-200 flex items-center gap-3 shrink-0">
          <div className="flex items-center border border-stone-200 rounded-xl bg-[#FAF9F6]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-700 hover:text-[#3B1248] cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-mono font-semibold tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-700 hover:text-[#3B1248] cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 min-h-[48px] px-5 rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] active:scale-[0.99] transition-all cursor-pointer tabular-nums"
          >
            Add to Bag · ${totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
