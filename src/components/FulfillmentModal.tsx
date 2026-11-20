import { useState } from 'react';
import { Check, Clock, MapPin, Store, Truck, UtensilsCrossed, X } from 'lucide-react';
import { PREORDER_SLOTS, STORE_LOCATIONS } from '../data/acaiData';
import { FulfillmentMode } from '../types/acai';

interface FulfillmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: FulfillmentMode;
  storeId: string;
  slotId: string;
  deliveryAddress: string;
  dineInPreference: string;
  savedAddresses: string[];
  isRoxaPass: boolean;
  onSave: (next: {
    mode: FulfillmentMode;
    storeId: string;
    slotId: string;
    deliveryAddress: string;
    dineInPreference: string;
  }) => void;
}

export function FulfillmentModal({
  isOpen,
  onClose,
  mode,
  storeId,
  slotId,
  deliveryAddress,
  dineInPreference,
  savedAddresses,
  isRoxaPass,
  onSave,
}: FulfillmentModalProps) {
  const [draftMode, setDraftMode] = useState<FulfillmentMode>(mode);
  const [draftStoreId, setDraftStoreId] = useState(storeId);
  const [draftSlotId, setDraftSlotId] = useState(slotId);
  const [draftAddress, setDraftAddress] = useState(deliveryAddress);
  const [draftDineIn, setDraftDineIn] = useState(dineInPreference);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSave({
      mode: draftMode,
      storeId: draftStoreId,
      slotId: draftSlotId,
      deliveryAddress: draftAddress.trim() || savedAddresses[0],
      dineInPreference: draftDineIn,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Pre-order fulfillment and schedule"
    >
      <div className="w-full lg:max-w-xl bg-[#FAF9F6] rounded-t-3xl lg:rounded-3xl border border-stone-200 max-h-[88vh] flex flex-col overflow-hidden">
        {/* Mobile grab handle */}
        <div className="lg:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#1C181F]">Schedule Your Ritual</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Blended cold 6 minutes before your chosen arrival window
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-500 hover:text-[#1C181F] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close fulfillment sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Fulfillment Mode Segmented Tabs */}
          <div>
            <p className="text-xs font-semibold text-stone-700 mb-2.5">How would you like your açai?</p>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/70 rounded-xl">
              {(
                [
                  { id: 'collect', label: 'Collect', icon: Store },
                  { id: 'dine-in', label: 'Dine In', icon: UtensilsCrossed },
                  { id: 'delivery', label: 'Delivery', icon: Truck },
                ] as const
              ).map((option) => {
                const Icon = option.icon;
                const active = draftMode === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDraftMode(option.id)}
                    className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-white text-[#3B1248] shadow-xs'
                        : 'text-stone-600 hover:text-[#1C181F]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Store Selector or Delivery Address */}
          {draftMode === 'delivery' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-stone-700">Delivery Address</p>
                <span className="text-xs font-medium text-[#2F6B3B]">
                  {isRoxaPass ? 'Roxa Pass: $0 Delivery' : '$3.50 insulated courier'}
                </span>
              </div>
              <div className="space-y-2">
                {savedAddresses.map((addr) => {
                  const selected = draftAddress === addr;
                  return (
                    <button
                      key={addr}
                      type="button"
                      onClick={() => setDraftAddress(addr)}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-2xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                        selected
                          ? 'bg-white border-[#3B1248] text-[#1C181F]'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <MapPin className="w-4 h-4 text-[#3B1248] shrink-0" />
                        <span className="text-sm font-medium truncate">{addr}</span>
                      </div>
                      {selected && <Check className="w-4 h-4 text-[#3B1248] shrink-0" />}
                    </button>
                  );
                })}
                <input
                  type="text"
                  value={draftAddress}
                  onChange={(e) => setDraftAddress(e.target.value)}
                  placeholder="Or enter a new street address..."
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-[#1C181F] placeholder:text-stone-400 focus:outline-none focus:border-[#3B1248]"
                />
              </div>
              <p className="text-xs text-stone-500">
                Packed in thermal bamboo-lined carriers with separate crunch jars so your granola never softens.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-stone-700">
                {draftMode === 'dine-in' ? 'Choose Açai House & Seating' : 'Choose Pickup Bar'}
              </p>
              <div className="space-y-2">
                {STORE_LOCATIONS.map((loc) => {
                  const selected = draftStoreId === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setDraftStoreId(loc.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                        selected
                          ? 'bg-white border-[#3B1248]'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[#1C181F]">{loc.name}</div>
                          <div className="text-xs text-stone-500 mt-0.5">
                            {loc.address} · {draftMode === 'dine-in' ? `${loc.dineInSeatsAvailable} ceramic-bar seats open` : loc.pickupSpot}
                          </div>
                        </div>
                        <span className="text-xs font-mono font-medium text-[#3B1248] tabular-nums shrink-0">
                          {loc.prepMinutes}m prep
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {draftMode === 'dine-in' && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-stone-700 mb-2">Dine-In Seating Preference</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Window Counter', 'Courtyard Table', 'Any Quiet Seat'].map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setDraftDineIn(pref)}
                        className={`min-h-[44px] px-2.5 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                          draftDineIn === pref
                            ? 'bg-[#3B1248] text-white border-[#3B1248]'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pre-order Time Window */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-stone-700">Pre-Order Time Window</p>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Order ahead, zero melt
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PREORDER_SLOTS.map((slot) => {
                const selected = draftSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setDraftSlotId(slot.id)}
                    className={`min-h-[52px] px-3 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#F4EFF6] border-[#3B1248] text-[#3B1248]'
                        : 'bg-white border-stone-200 text-[#1C181F] hover:border-stone-300'
                    }`}
                  >
                    <div className="text-xs font-semibold tabular-nums">{slot.label}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{slot.sublabel}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="p-4 bg-white border-t border-stone-200">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full min-h-[48px] rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] active:scale-[0.99] transition-all cursor-pointer"
          >
            Confirm Pre-Order Window
          </button>
        </div>
      </div>
    </div>
  );
}
