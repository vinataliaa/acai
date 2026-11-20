import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Flame,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  Truck,
  UserPlus,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import {
  CartItem,
  FulfillmentMode,
  MemberProfile,
  OrderRecord,
  StoreLocation,
  TimeSlot,
} from '../types/acai';
import { BowlImage } from './BowlImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bag: CartItem[];
  member: MemberProfile;
  fulfillmentMode: FulfillmentMode;
  selectedStore: StoreLocation;
  selectedSlot: TimeSlot;
  deliveryAddress: string;
  dineInPreference: string;
  applyCredits: boolean;
  onToggleApplyCredits: (val: boolean) => void;
  applyRoxaPassPerk: boolean;
  onToggleRoxaPassPerk: (val: boolean) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onAddGreenJuiceAddon: () => void;
  onOpenFulfillment: () => void;
  onOpenJoinSheet: (reason?: string, potentialSavings?: number, initialPlan?: 'free' | 'pass') => void;
  onPlaceOrder: (payload: {
    cupNote: string;
    paymentMethod: string;
    subtotal: number;
    pointsDiscount: number;
    passDiscount: number;
    deliveryFee: number;
    total: number;
  }) => OrderRecord;
  activeOrder: OrderRecord | null;
  onAdvanceOrderStage: () => void;
  onBrowseMenu: () => void;
  onOpenBuilder: () => void;
}

const STAGE_LABELS: Record<FulfillmentMode, string[]> = {
  collect: [
    'Slot Reserved',
    'Stone-Blending Cold (-4°C)',
    'Hand-Layering Crunch',
    'Ready at Pickup Shelf',
  ],
  'dine-in': [
    'Table & Slot Reserved',
    'Stone-Blending Cold (-4°C)',
    'Plating in Ceramic Bowl',
    'Served at Your Seat',
  ],
  delivery: [
    'Order Scheduled',
    'Cold-Spun & Packed',
    'Insulated Courier En Route',
    'Delivered to Door',
  ],
};

export function CartDrawer({
  isOpen,
  onClose,
  bag,
  member,
  fulfillmentMode,
  selectedStore,
  selectedSlot,
  deliveryAddress,
  dineInPreference,
  applyCredits,
  onToggleApplyCredits,
  applyRoxaPassPerk,
  onToggleRoxaPassPerk,
  onUpdateQty,
  onRemoveItem,
  onAddGreenJuiceAddon,
  onOpenFulfillment,
  onOpenJoinSheet,
  onPlaceOrder,
  activeOrder,
  onAdvanceOrderStage,
  onBrowseMenu,
  onOpenBuilder,
}: CartDrawerProps) {
  const firstName = member.isSignedUp && member.name ? member.name.split(' ')[0] : '';
  const [cupNote, setCupNote] = useState(
    firstName ? `For ${firstName} — Fresh start` : 'Fresh start'
  );
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'card' | 'wallet'>('apple-pay');

  if (!isOpen) return null;

  const hasGreenJuice = bag.some((i) => i.id === 'addon-green-juice');

  const guestSubtotal = bag.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const memberSubtotal = bag.reduce(
    (sum, item) => sum + (item.memberUnitPrice ?? item.unitPrice) * item.quantity,
    0
  );

  const subtotal = member.isSignedUp ? memberSubtotal : guestSubtotal;
  const memberPricingDiff = Math.max(0, guestSubtotal - memberSubtotal);

  const rawDeliveryFee = fulfillmentMode === 'delivery' ? 3.5 : 0;
  const deliveryFee = member.isRoxaPass ? 0 : rawDeliveryFee;

  const passDiscount =
    member.isSignedUp &&
    member.isRoxaPass &&
    member.roxaPassFreeBowlAvailable &&
    applyRoxaPassPerk &&
    bag.length > 0
      ? Math.min(13.5, subtotal)
      : 0;

  const availableCreditDollars = member.isSignedUp
    ? member.welcomeCredit + member.points / 20
    : 0;
  const remainingAfterPass = Math.max(0, subtotal - passDiscount);
  const pointsDiscount =
    member.isSignedUp && applyCredits
      ? Math.min(availableCreditDollars, remainingAfterPass)
      : 0;

  const total = Math.max(0, subtotal - passDiscount - pointsDiscount + deliveryFee);
  const guestMissedInstantSavings = Number((memberPricingDiff + 3.0).toFixed(2));

  const ModeIcon =
    fulfillmentMode === 'delivery'
      ? Truck
      : fulfillmentMode === 'dine-in'
        ? UtensilsCrossed
        : Store;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-stretch lg:justify-end bg-black/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Bag preview and pre-order checkout"
    >
      {/* Backdrop click to dismiss */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="Dismiss bag preview"
      />

      <div className="relative z-10 w-full lg:max-w-lg bg-[#FAF9F6] rounded-t-3xl lg:rounded-none lg:rounded-l-3xl border-t lg:border-t-0 lg:border-l border-stone-200 max-h-[92vh] lg:max-h-screen lg:h-full flex flex-col overflow-hidden shadow-2xl">
        {/* Mobile grab handle */}
        <div className="lg:hidden pt-3 pb-1 flex justify-center bg-white">
          <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white shrink-0">
          <div>
            <p className="text-xs font-semibold text-[#3B1248]">
              {activeOrder && bag.length === 0 ? 'Live Order Pass' : 'Bag Preview & Checkout'}
            </p>
            <h2 className="font-display text-xl font-semibold text-[#1C181F]">
              {activeOrder && bag.length === 0
                ? `Order #${activeOrder.orderCode}`
                : firstName
                  ? `${firstName}'s Pre-Order`
                  : 'Your Pre-Order'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-500 hover:text-[#1C181F] hover:bg-stone-100 cursor-pointer"
            aria-label="Close bag preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeOrder && bag.length === 0 ? (
            (() => {
              const stages = STAGE_LABELS[activeOrder.fulfillmentMode];
              return (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2F6B3B]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirmed · {activeOrder.scheduledSlot}</span>
                        </div>
                        <h3 className="font-display text-xl font-semibold text-[#1C181F] mt-1">
                          {stages[activeOrder.statusStage]}
                        </h3>
                        <p className="text-xs text-stone-600 mt-1">
                          {activeOrder.storeName} · {activeOrder.locationDetail}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#F4EFF6] border border-[#3B1248]/15 text-center shrink-0">
                        <QrCode className="w-7 h-7 text-[#3B1248] mx-auto" strokeWidth={1.6} />
                        <div className="font-mono text-xs font-bold text-[#3B1248] mt-1 tabular-nums">
                          {activeOrder.orderCode}
                        </div>
                      </div>
                    </div>

                    {!member.isSignedUp && (
                      <div className="p-4 rounded-xl bg-[#F4EFF6] border border-[#3B1248]/25 space-y-2.5">
                        <div className="text-xs font-semibold text-[#3B1248] tabular-nums">
                          Claim +{activeOrder.pointsEarned} pts &amp; Stamp #1 before closing
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed">
                          Save your points and unlock $3.00 welcome credit for your next bowl in 10 seconds.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            onOpenJoinSheet(
                              `Claim the +${activeOrder.pointsEarned} pts & Stamp #1 from order #${activeOrder.orderCode}`,
                              3.0,
                              'free'
                            )
                          }
                          className="w-full min-h-[42px] px-4 rounded-xl bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] cursor-pointer inline-flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Claim Points &amp; Stamp</span>
                        </button>
                      </div>
                    )}

                    <div className="space-y-2.5 pt-2 border-t border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-700">Live Craft Timeline</span>
                        {activeOrder.statusStage < 3 && (
                          <button
                            type="button"
                            onClick={onAdvanceOrderStage}
                            className="text-xs font-semibold text-[#3B1248] hover:underline cursor-pointer"
                          >
                            Simulate Next Stage
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {stages.map((label, idx) => {
                          const done = idx <= activeOrder.statusStage;
                          const current = idx === activeOrder.statusStage;
                          return (
                            <div
                              key={label}
                              className={`p-2.5 rounded-xl border ${
                                current
                                  ? 'bg-[#3B1248] text-white border-[#3B1248]'
                                  : done
                                    ? 'bg-[#F4EFF6] text-[#3B1248] border-[#3B1248]/20'
                                    : 'bg-[#FAF9F6] text-stone-400 border-stone-200'
                              }`}
                            >
                              <div className="font-mono text-[10px] tabular-nums">0{idx + 1}</div>
                              <div className="text-xs font-semibold mt-0.5 leading-snug">{label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 text-xs space-y-1">
                      <div className="font-semibold text-[#1C181F]">
                        Blended by {activeOrder.baristaName} · Batch #{activeOrder.batchNumber}
                      </div>
                      <div className="text-stone-600">Cup sleeve: &ldquo;{activeOrder.cupNote}&rdquo;</div>
                      <div className="text-[#2F6B3B] font-medium flex items-center gap-1 pt-0.5">
                        <Flame className="w-3.5 h-3.5 text-[#3B1248]" />
                        <span>
                          {member.isSignedUp
                            ? `+${activeOrder.pointsEarned} pts · Stamp card ${member.stampCount}/5`
                            : 'Checked out as Guest'}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-stone-100 pt-3 space-y-1.5 text-xs">
                      {activeOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-stone-700">
                          <span>
                            {item.quantity}× {item.name}
                          </span>
                          <span className="font-mono tabular-nums">
                            ${((member.isSignedUp ? item.memberUnitPrice ?? item.unitPrice : item.unitPrice) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 font-semibold text-sm text-[#1C181F]">
                        <span>Total Paid</span>
                        <span className="font-mono tabular-nums">${activeOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : bag.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 text-center space-y-4 my-6">
              <h3 className="font-display text-xl font-semibold text-[#1C181F]">Your Bag is Empty</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {!member.isSignedUp
                  ? 'Join Belly Belly Good Club free for $3.00 welcome credit and lower member pricing on your first bowl.'
                  : member.welcomeCredit > 0
                    ? `You have $${member.welcomeCredit.toFixed(2)} welcome credit ready to use on your next pre-order.`
                    : 'Pick a cold-spun signature bowl or craft your own custom blend.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBrowseMenu();
                  }}
                  className="flex-1 min-h-[44px] px-4 rounded-xl bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] cursor-pointer"
                >
                  Browse Bowls &amp; Bundles
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBuilder();
                  }}
                  className="flex-1 min-h-[44px] px-4 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs font-semibold text-[#1C181F] hover:border-[#3B1248] cursor-pointer"
                >
                  Build Custom Bowl
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Fulfillment Row */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F4EFF6] text-[#3B1248] flex items-center justify-center shrink-0">
                    <ModeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-stone-500 capitalize">
                      {fulfillmentMode.replace('-', ' ')} Pre-Order
                    </div>
                    <div className="text-xs font-semibold text-[#1C181F] mt-0.5">
                      {fulfillmentMode === 'delivery' ? deliveryAddress : selectedStore.name}
                    </div>
                    <div className="text-[11px] text-stone-600 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#3B1248]" />
                      <span className="tabular-nums">{selectedSlot.label}</span>
                      {fulfillmentMode === 'dine-in' && <span>· {dineInPreference}</span>}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenFulfillment}
                  className="min-h-[38px] px-2.5 rounded-lg border border-stone-200 text-xs font-semibold text-[#3B1248] hover:border-[#3B1248] cursor-pointer shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Itemized List */}
              <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
                {bag.map((item) => {
                  const displayUnit = member.isSignedUp
                    ? item.memberUnitPrice ?? item.unitPrice
                    : item.unitPrice;
                  return (
                    <div key={item.id} className="p-3.5 flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                        <BowlImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-sm font-semibold text-[#1C181F]">
                              {item.name}
                            </h3>
                            <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                              {item.subtitle}
                            </p>
                            {item.notes && (
                              <p className="text-[11px] text-[#3B1248] mt-0.5">Note: {item.notes}</p>
                            )}
                          </div>
                          <span className="font-mono text-xs font-semibold text-[#1C181F] tabular-nums shrink-0">
                            ${(displayUnit * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2.5">
                          <div className="inline-flex items-center border border-stone-200 rounded-lg bg-[#FAF9F6]">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, -1)}
                              className="min-h-[34px] min-w-[34px] flex items-center justify-center text-stone-700 hover:text-[#3B1248] cursor-pointer"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-mono text-xs font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="min-h-[34px] min-w-[34px] flex items-center justify-center text-stone-700 hover:text-[#3B1248] cursor-pointer"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="min-h-[34px] px-2 text-[11px] text-stone-400 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bundle Upsell */}
              {!hasGreenJuice && (
                <div className="bg-white rounded-2xl border border-stone-200 p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-[#2F6B3B]">
                      Pairing Deal · Save $2.00
                    </div>
                    <div className="text-xs font-semibold text-[#1C181F]">
                      Cold-Pressed Green Juice (250ml)
                    </div>
                    <div className="text-[11px] text-stone-500">$4.50 add-on (reg. $6.50)</div>
                  </div>
                  <button
                    type="button"
                    onClick={onAddGreenJuiceAddon}
                    className="min-h-[38px] px-3 rounded-xl bg-[#F4EFF6] text-[#3B1248] text-xs font-semibold hover:bg-[#3B1248] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    + $4.50
                  </button>
                </div>
              )}

              {/* Guest Loss Avoidance Sign-Up OR Member Perks */}
              {!member.isSignedUp ? (
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-[#F4EFF6] border border-[#3B1248]/25 space-y-2.5">
                    <div>
                      <div className="text-xs font-semibold text-[#3B1248] tabular-nums">
                        You&rsquo;re leaving ${guestMissedInstantSavings.toFixed(2)} on this order
                      </div>
                      <p className="text-[11px] text-stone-700 mt-1 leading-relaxed tabular-nums">
                        Join Belly Belly Good Club free in 10 seconds to save{' '}
                        <strong>${guestMissedInstantSavings.toFixed(2)}</strong> right now ($3.00 welcome credit + ${memberPricingDiff.toFixed(2)} member pricing) and earn Stamp #1.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenJoinSheet(
                          `Apply $${guestMissedInstantSavings.toFixed(2)} instant savings to this bag`,
                          guestMissedInstantSavings,
                          'free'
                        )
                      }
                      className="w-full min-h-[42px] px-4 rounded-xl bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Join Free &amp; Save ${guestMissedInstantSavings.toFixed(2)} Now</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2.5">
                    <div>
                      <div className="text-xs font-semibold text-[#1C181F] inline-flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3B1248]" />
                        <span>Belly Good Pass · $14.90/mo</span>
                      </div>
                      <p className="text-[11px] text-stone-500">
                        Up to $13.50 off this bowl + $0 delivery
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenJoinSheet(
                          'Start Belly Good Pass to get up to $13.50 off this bowl + $0 delivery immediately',
                          Math.min(13.5, subtotal) + rawDeliveryFee,
                          'pass'
                        )
                      }
                      className="min-h-[36px] px-3 rounded-lg border border-[#3B1248] text-[#3B1248] text-xs font-semibold hover:bg-[#3B1248] hover:text-white whitespace-nowrap cursor-pointer"
                    >
                      Select Pass
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {availableCreditDollars > 0 && (
                    <label className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-[#F4EFF6] border border-[#3B1248]/15 cursor-pointer">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={applyCredits}
                          onChange={(e) => onToggleApplyCredits(e.target.checked)}
                          className="mt-0.5 w-4 h-4 accent-[#3B1248] cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#3B1248]">
                            {member.welcomeCredit > 0
                              ? `Apply $${member.welcomeCredit.toFixed(2)} welcome credit`
                              : `Redeem ${member.points} reward pts`}
                          </div>
                          <div className="text-[11px] text-stone-600 tabular-nums">
                            Up to ${availableCreditDollars.toFixed(2)} off
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-[#3B1248] tabular-nums shrink-0">
                        -${Math.min(availableCreditDollars, remainingAfterPass).toFixed(2)}
                      </span>
                    </label>
                  )}

                  {member.isRoxaPass ? (
                    member.roxaPassFreeBowlAvailable && (
                      <label className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-white border border-stone-200 cursor-pointer">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={applyRoxaPassPerk}
                            onChange={(e) => onToggleRoxaPassPerk(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-[#3B1248] cursor-pointer"
                          />
                          <div>
                            <div className="text-xs font-semibold text-[#1C181F]">
                              Claim Monthly Belly Good Pass Bowl
                            </div>
                            <div className="text-[11px] text-stone-500">
                              Covers up to $13.50 · $0 delivery
                            </div>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#2F6B3B] tabular-nums">
                          -$13.50
                        </span>
                      </label>
                    )
                  ) : (
                    <div className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2.5">
                      <div>
                        <div className="text-xs font-semibold text-[#1C181F] inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#3B1248]" />
                          <span>Belly Good Pass · $14.90/mo</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          1 free bowl ($13.50) + $0 delivery
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenJoinSheet(
                            'Upgrade to Belly Good Pass for 1 free bowl + $0 delivery',
                            Math.min(13.5, subtotal) + rawDeliveryFee,
                            'pass'
                          )
                        }
                        className="min-h-[36px] px-3 rounded-lg bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] whitespace-nowrap cursor-pointer"
                      >
                        Upgrade
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Cup Sleeve Note & Payment */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3.5">
                <div>
                  <label htmlFor="drawer-cup-note" className="block text-xs font-semibold text-stone-800 mb-1">
                    Cup Sleeve Note
                  </label>
                  <input
                    id="drawer-cup-note"
                    type="text"
                    value={cupNote}
                    onChange={(e) => setCupNote(e.target.value)}
                    maxLength={48}
                    className="w-full min-h-[40px] px-3 py-1.5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-stone-800 mb-1.5">Payment Method</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'apple-pay', label: 'Apple Pay' },
                        { id: 'card', label: 'Visa ·· 4242' },
                        { id: 'wallet', label: 'BBG Pay' },
                      ] as const
                    ).map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`min-h-[38px] px-2 py-1.5 rounded-xl border text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          paymentMethod === pm.id
                            ? 'bg-[#3B1248] text-white border-[#3B1248]'
                            : 'bg-[#FAF9F6] text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <CreditCard className="w-3 h-3 shrink-0" />
                        <span className="truncate">{pm.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Drawer Footer */}
        {bag.length > 0 && (
          <div className="p-4 bg-white border-t border-stone-200 space-y-3 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>{member.isSignedUp ? 'Member Subtotal' : 'Guest Subtotal'}</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {fulfillmentMode === 'delivery' && (
                <div className="flex items-center justify-between text-stone-600">
                  <span>Thermal Courier</span>
                  <span className="font-mono tabular-nums">
                    {deliveryFee === 0 ? 'Free (Pass)' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}
              {passDiscount > 0 && (
                <div className="flex items-center justify-between text-[#2F6B3B]">
                  <span>Belly Good Pass Bowl</span>
                  <span className="font-mono tabular-nums">-${passDiscount.toFixed(2)}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex items-center justify-between text-[#3B1248]">
                  <span>Member Credit Applied</span>
                  <span className="font-mono tabular-nums">-${pointsDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-sm font-semibold text-[#1C181F]">
                <span>Total</span>
                <span className="font-mono text-lg tabular-nums">${total.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-stone-500 flex items-center gap-1 pt-0.5">
                <Sparkles className="w-3 h-3 text-[#3B1248]" />
                <span className="tabular-nums">
                  {member.isSignedUp
                    ? `Earns +${Math.max(10, Math.round(total * 2.5))} pts & +1 Stamp`
                    : `Join above to save $${guestMissedInstantSavings.toFixed(2)} & earn Stamp #1`}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onPlaceOrder({
                  cupNote: cupNote.trim() || (firstName ? `For ${firstName}` : 'Fresh prep'),
                  paymentMethod,
                  subtotal,
                  pointsDiscount,
                  passDiscount,
                  deliveryFee,
                  total,
                })
              }
              className="w-full min-h-[48px] px-5 rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] active:scale-[0.99] transition-all cursor-pointer tabular-nums"
            >
              {member.isSignedUp
                ? `Place Member Pre-Order · $${total.toFixed(2)}`
                : `Continue as Guest · $${total.toFixed(2)}`}
            </button>
          </div>
        )}

        {activeOrder && bag.length === 0 && (
          <div className="p-4 bg-white border-t border-stone-200 shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onBrowseMenu();
              }}
              className="w-full min-h-[46px] px-5 rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] cursor-pointer"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
