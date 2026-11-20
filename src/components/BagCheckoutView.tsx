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

interface BagCheckoutViewProps {
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

export function BagCheckoutView({
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
}: BagCheckoutViewProps) {
  const firstName = member.isSignedUp && member.name ? member.name.split(' ')[0] : '';
  const [cupNote, setCupNote] = useState(
    firstName ? `For ${firstName} — Fresh start` : 'Fresh start'
  );
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'card' | 'wallet'>('apple-pay');

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
    member.isSignedUp && member.isRoxaPass && member.roxaPassFreeBowlAvailable && applyRoxaPassPerk && bag.length > 0
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

  // What a guest is leaving behind right now if they don't join
  const guestMissedInstantSavings = Number((memberPricingDiff + 3.0).toFixed(2));

  const ModeIcon =
    fulfillmentMode === 'delivery'
      ? Truck
      : fulfillmentMode === 'dine-in'
        ? UtensilsCrossed
        : Store;

  if (activeOrder && bag.length === 0) {
    const stages = STAGE_LABELS[activeOrder.fulfillmentMode];
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-10">
        <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2F6B3B]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pre-Order Confirmed · #{activeOrder.orderCode}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C181F] mt-1.5">
                {stages[activeOrder.statusStage]}
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                {activeOrder.storeName} · {activeOrder.locationDetail} · {activeOrder.scheduledSlot}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4EFF6] border border-[#3B1248]/15 flex items-center gap-3 shrink-0">
              <QrCode className="w-9 h-9 text-[#3B1248]" strokeWidth={1.6} />
              <div>
                <div className="text-[11px] text-stone-500">Arrival Pass</div>
                <div className="font-mono text-base font-bold text-[#3B1248] tabular-nums">
                  {activeOrder.orderCode}
                </div>
              </div>
            </div>
          </div>

          {/* Post-Order Guest Conversion Loop */}
          {!member.isSignedUp && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F4EFF6] border border-[#3B1248]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-[#3B1248] tabular-nums">
                  Don&rsquo;t let +{activeOrder.pointsEarned} pts &amp; Stamp #1 disappear
                </div>
                <p className="text-xs text-stone-700 mt-1">
                  This order earned +{activeOrder.pointsEarned} pts and your first Ritual Stamp toward a free $8 bowl. Save them to your account in 10 seconds + unlock $3.00 for your next bowl.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenJoinSheet(
                    `Claim the +${activeOrder.pointsEarned} pts & Stamp #1 from order #${activeOrder.orderCode}`,
                    3.0,
                    'free'
                  )
                }
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Claim Points &amp; Stamp</span>
              </button>
            </div>
          )}

          {/* Prep Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">Live Craft Timeline</span>
              {activeOrder.statusStage < 3 && (
                <button
                  type="button"
                  onClick={onAdvanceOrderStage}
                  className="text-xs font-semibold text-[#3B1248] hover:underline cursor-pointer min-h-[36px]"
                >
                  Simulate Next Stage
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {stages.map((label, idx) => {
                const done = idx <= activeOrder.statusStage;
                const current = idx === activeOrder.statusStage;
                return (
                  <div
                    key={label}
                    className={`p-3 rounded-xl border transition-colors ${
                      current
                        ? 'bg-[#3B1248] text-white border-[#3B1248]'
                        : done
                          ? 'bg-[#F4EFF6] text-[#3B1248] border-[#3B1248]/20'
                          : 'bg-[#FAF9F6] text-stone-400 border-stone-200'
                    }`}
                  >
                    <div className="font-mono text-[11px] tabular-nums">0{idx + 1}</div>
                    <div className="text-xs font-semibold mt-1 leading-snug">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200">
              <div className="text-xs text-stone-500">Craftsmanship &amp; Lid Note</div>
              <div className="text-sm font-semibold text-[#1C181F] mt-1">
                Blended by {activeOrder.baristaName} · Harvest Batch #{activeOrder.batchNumber}
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Cup sleeve note: &ldquo;{activeOrder.cupNote}&rdquo;
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200">
              <div className="text-xs text-stone-500">Ritual Progress</div>
              <div className="text-sm font-semibold text-[#2F6B3B] mt-1 tabular-nums">
                {member.isSignedUp
                  ? `+${activeOrder.pointsEarned} pts earned · Stamp card ${member.stampCount}/5`
                  : 'Checked out as Guest (points unclaimed)'}
              </div>
              <p className="text-xs text-stone-600 mt-1 inline-flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#3B1248]" />
                <span>
                  {member.isSignedUp
                    ? `${Math.max(1, member.streakWeeks)}-week streak active`
                    : 'Join Club to start your streak'}
                </span>
              </p>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
            {activeOrder.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-stone-700">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-mono tabular-nums text-[#1C181F]">
                  ${((member.isSignedUp ? item.memberUnitPrice ?? item.unitPrice : item.unitPrice) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 font-semibold text-[#1C181F]">
              <span>Total Paid</span>
              <span className="font-mono text-base tabular-nums">${activeOrder.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onBrowseMenu}
              className="min-h-[46px] px-5 rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] cursor-pointer"
            >
              Order Another Bowl
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (bag.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
        <h1 className="font-display text-2xl font-semibold text-[#1C181F]">Your Bag is Empty</h1>
        <p className="text-sm text-stone-600">
          {!member.isSignedUp
            ? 'Join Belly Belly Good Club free for $3.00 welcome credit and lower member pricing on your first bowl.'
            : member.welcomeCredit > 0
              ? `You have $${member.welcomeCredit.toFixed(2)} welcome credit ready to use on your next pre-order.`
              : 'Pick a cold-spun signature bowl or craft your own personal identity blend.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBrowseMenu}
            className="min-h-[46px] px-5 rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] cursor-pointer"
          >
            Explore Menu &amp; Bundles
          </button>
          <button
            type="button"
            onClick={onOpenBuilder}
            className="min-h-[46px] px-5 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm font-semibold text-[#1C181F] hover:border-[#3B1248] cursor-pointer"
          >
            Build Custom Bowl
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-6">
        <p className="text-xs font-medium text-[#3B1248]">Review &amp; Pre-Order Checkout</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C181F] mt-1">
          {firstName ? `Ready When You Are, ${firstName}` : 'Review Your Pre-Order'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-5">
          {/* Fulfillment Summary */}
          <section className="bg-white rounded-2xl border border-stone-200 p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#F4EFF6] text-[#3B1248] flex items-center justify-center shrink-0">
                <ModeIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-stone-500 capitalize">
                  {fulfillmentMode.replace('-', ' ')} Pre-Order
                </div>
                <div className="text-sm font-semibold text-[#1C181F] mt-0.5">
                  {fulfillmentMode === 'delivery' ? deliveryAddress : selectedStore.name}
                </div>
                <div className="text-xs text-stone-600 mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#3B1248]" />
                  <span className="tabular-nums">{selectedSlot.label}</span>
                  {fulfillmentMode === 'dine-in' && <span>· {dineInPreference}</span>}
                  {fulfillmentMode === 'collect' && <span>· {selectedStore.pickupSpot}</span>}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenFulfillment}
              className="min-h-[40px] px-3 rounded-xl border border-stone-200 text-xs font-semibold text-[#3B1248] hover:border-[#3B1248] cursor-pointer shrink-0"
            >
              Change
            </button>
          </section>

          {/* Itemized Bag */}
          <section className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
            {bag.map((item) => {
              const displayUnit = member.isSignedUp
                ? item.memberUnitPrice ?? item.unitPrice
                : item.unitPrice;
              return (
                <div key={item.id} className="p-4 sm:p-5 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    <BowlImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-display text-base font-semibold text-[#1C181F]">
                          {item.name}
                        </h2>
                        <p className="text-xs text-stone-500 mt-0.5">{item.subtitle}</p>
                        {item.notes && (
                          <p className="text-xs text-[#3B1248] mt-1">Note: {item.notes}</p>
                        )}
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#1C181F] tabular-nums shrink-0">
                        ${(displayUnit * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-stone-200 rounded-xl bg-[#FAF9F6]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="min-h-[38px] min-w-[38px] flex items-center justify-center text-stone-700 hover:text-[#3B1248] cursor-pointer"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="min-h-[38px] min-w-[38px] flex items-center justify-center text-stone-700 hover:text-[#3B1248] cursor-pointer"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="min-h-[38px] px-2.5 text-xs text-stone-400 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {!hasGreenJuice && (
            <section className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-[#2F6B3B]">
                  Complete the Ritual · Save $2.00
                </div>
                <div className="text-sm font-semibold text-[#1C181F] mt-0.5">
                  Pair with Cold-Pressed Green Juice (250ml)
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Kale, Fuji apple, lemon &amp; fresh ginger · $4.50 bundle add-on (reg. $6.50)
                </p>
              </div>
              <button
                type="button"
                onClick={onAddGreenJuiceAddon}
                className="min-h-[44px] px-4 rounded-xl bg-[#F4EFF6] text-[#3B1248] text-xs font-semibold hover:bg-[#3B1248] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                + Add Pairing · $4.50
              </button>
            </section>
          )}

          <section className="bg-white rounded-2xl border border-stone-200 p-5">
            <label htmlFor="cup-sleeve-note" className="block text-xs font-semibold text-stone-800">
              Cup Sleeve Recognition Note
            </label>
            <p className="text-xs text-stone-500 mt-0.5 mb-2.5">
              Hand-written on your bowl lid by our prep barista
            </p>
            <input
              id="cup-sleeve-note"
              type="text"
              value={cupNote}
              onChange={(e) => setCupNote(e.target.value)}
              maxLength={48}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
            />
          </section>
        </div>

        {/* Right column: Loss-Avoidance Sign-Up Prompt OR Active Member Perks */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-5">
          <h2 className="font-display text-xl font-semibold text-[#1C181F]">Order Summary</h2>

          {!member.isSignedUp ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F4EFF6] border border-[#3B1248]/25 space-y-3">
                <div>
                  <div className="text-xs font-semibold text-[#3B1248] tabular-nums">
                    You&rsquo;re leaving ${guestMissedInstantSavings.toFixed(2)} on this order
                  </div>
                  <p className="text-xs text-stone-700 mt-1 leading-relaxed tabular-nums">
                    Join Belly Belly Good Club free in 10 seconds to immediately drop your total by{' '}
                    <strong>${guestMissedInstantSavings.toFixed(2)}</strong> ($3.00 welcome credit + ${memberPricingDiff.toFixed(2)} member pricing) and earn Stamp #1.
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
                  className="w-full min-h-[44px] px-4 rounded-xl bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Join Free &amp; Save ${guestMissedInstantSavings.toFixed(2)} Now</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-[#1C181F] inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3B1248]" />
                    <span>Or start Belly Good Pass · $14.90/mo</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Covers up to $13.50 on this bowl + $0 delivery today
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
                  className="min-h-[38px] px-3 rounded-lg border border-[#3B1248] text-[#3B1248] text-xs font-semibold hover:bg-[#3B1248] hover:text-white whitespace-nowrap cursor-pointer"
                >
                  Select Pass
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {availableCreditDollars > 0 && (
                <label className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-[#F4EFF6] border border-[#3B1248]/15 cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={applyCredits}
                      onChange={(e) => onToggleApplyCredits(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#3B1248] cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#3B1248]">
                        {member.welcomeCredit > 0
                          ? `Apply $${member.welcomeCredit.toFixed(2)} welcome credit`
                          : `Redeem ${member.points} reward pts`}
                      </div>
                      <div className="text-[11px] text-stone-600 mt-0.5 tabular-nums">
                        Saves up to ${availableCreditDollars.toFixed(2)} on this order
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
                  <label className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 cursor-pointer">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={applyRoxaPassPerk}
                        onChange={(e) => onToggleRoxaPassPerk(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-[#3B1248] cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#1C181F]">
                          Claim Monthly Belly Good Pass Bowl
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Covers up to $13.50 · $0 delivery active
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#2F6B3B] tabular-nums">
                      -$13.50
                    </span>
                  </label>
                )
              ) : (
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-[#1C181F] inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#3B1248]" />
                      <span>Upgrade to Belly Good Pass · $14.90/mo</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Get 1 free bowl ($13.50) + $0 delivery + Streak Shield
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
                    className="min-h-[38px] px-3 rounded-lg bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] whitespace-nowrap cursor-pointer"
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div>
            <p className="text-xs font-semibold text-stone-700 mb-2">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
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
                  className={`min-h-[42px] px-2.5 py-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    paymentMethod === pm.id
                      ? 'bg-[#3B1248] text-white border-[#3B1248]'
                      : 'bg-[#FAF9F6] text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Line Totals */}
          <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between text-stone-600">
              <span>{member.isSignedUp ? 'Member Subtotal' : 'Guest Subtotal'}</span>
              <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            {member.isSignedUp && memberPricingDiff > 0 && (
              <div className="flex items-center justify-between text-[#2F6B3B] text-xs">
                <span>Member Pricing Discount</span>
                <span className="font-mono tabular-nums">-${memberPricingDiff.toFixed(2)}</span>
              </div>
            )}
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
                <span>Belly Good Pass Free Bowl</span>
                <span className="font-mono tabular-nums">-${passDiscount.toFixed(2)}</span>
              </div>
            )}
            {pointsDiscount > 0 && (
              <div className="flex items-center justify-between text-[#3B1248]">
                <span>Member Credit Applied</span>
                <span className="font-mono tabular-nums">-${pointsDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-stone-200 font-semibold text-[#1C181F]">
              <span>Total</span>
              <span className="font-mono text-xl tabular-nums">${total.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-[#3B1248]" />
              <span className="tabular-nums">
                {member.isSignedUp
                  ? `Earns +${Math.max(10, Math.round(total * 2.5))} pts & +1 Ritual Stamp`
                  : `Sign up above to save $${guestMissedInstantSavings.toFixed(2)} & earn +1 stamp`}
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
            className="w-full min-h-[50px] px-5 rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] active:scale-[0.99] transition-all cursor-pointer tabular-nums"
          >
            {member.isSignedUp
              ? `Place Member Pre-Order · $${total.toFixed(2)}`
              : `Continue as Guest · $${total.toFixed(2)}`}
          </button>
        </aside>
      </div>
    </div>
  );
}
