import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  UserPlus,
  UtensilsCrossed,
} from 'lucide-react';
import { MENU_ITEMS, getTierProgress } from '../data/acaiData';
import {
  CartItem,
  CustomBowl,
  FulfillmentMode,
  MemberProfile,
  MenuItem,
  OrderRecord,
  StoreLocation,
  TimeSlot,
} from '../types/acai';
import { BowlImage } from './BowlImage';

interface HomeOrderViewProps {
  member: MemberProfile;
  bag: CartItem[];
  activeOrder: OrderRecord | null;
  fulfillmentMode: FulfillmentMode;
  selectedStore: StoreLocation;
  selectedSlot: TimeSlot;
  deliveryAddress: string;
  dineInPreference: string;
  menuFilter: 'all' | 'signature' | 'bundle';
  onChangeFilter: (filter: 'all' | 'signature' | 'bundle') => void;
  onChangeModeQuick: (mode: FulfillmentMode) => void;
  onOpenFulfillment: () => void;
  onSelectMenuItem: (item: MenuItem) => void;
  onQuickAddMenuItem: (item: MenuItem) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onOpenCart: () => void;
  customBowls: CustomBowl[];
  onQuickAddCustomBowl: (bowl: CustomBowl) => void;
  onOpenBuilder: () => void;
  onOpenClub: () => void;
  onOpenJoinSheet: (reason?: string) => void;
  showMemberBannerB: boolean;
  onJoinNowClick: () => void;
  recentlyAddedId: string | null;
}

export function HomeOrderView({
  member,
  bag,
  activeOrder,
  fulfillmentMode,
  selectedStore,
  selectedSlot,
  deliveryAddress,
  dineInPreference,
  menuFilter,
  onChangeFilter,
  onChangeModeQuick,
  onOpenFulfillment,
  onSelectMenuItem,
  onQuickAddMenuItem,
  onUpdateQty,
  onOpenCart,
  customBowls,
  onQuickAddCustomBowl,
  onOpenBuilder,
  onOpenClub,
  onOpenJoinSheet,
  showMemberBannerB,
  onJoinNowClick,
  recentlyAddedId,
}: HomeOrderViewProps) {
  const heroItem = MENU_ITEMS[0];
  const filteredItems = MENU_ITEMS.filter((item) =>
    menuFilter === 'all' ? true : item.category === menuFilter
  );

  const bagCount = bag.reduce((sum, i) => sum + i.quantity, 0);
  const bagSubtotal = bag.reduce(
    (sum, i) =>
      sum + (member.isSignedUp ? i.memberUnitPrice ?? i.unitPrice : i.unitPrice) * i.quantity,
    0
  );
  const guestSavingsOnBag = bag.reduce(
    (sum, i) => sum + Math.max(0, i.unitPrice - (i.memberUnitPrice ?? i.unitPrice)) * i.quantity,
    0
  );

  const firstName = member.isSignedUp && member.name ? member.name.split(' ')[0] : '';
  const primaryCustomBowl = customBowls[0];
  const tierInfo = getTierProgress(member.totalBowlsOrdered);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Recognition + Pre-order Convenience Header */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            {member.isSignedUp ? (
              <>
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-[#3B1248]">
                    {member.isRoxaPass ? 'Belly Good Pass Member' : `${member.tier} Member`}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{member.tasteArchetype}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{member.totalBowlsOrdered} bowls enjoyed</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C181F] mt-1.5 tracking-tight">
                  {getGreeting()}, {firstName}. Member pricing is active.
                </h1>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-[#3B1248]">Wild Amazonian Açai House</span>
                  <span aria-hidden="true">·</span>
                  <span>Pre-order for Dine In, Store Pickup, or Delivery</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C181F] mt-1.5 tracking-tight">
                  {getGreeting()}. Cold-spun fresh 6 minutes before you arrive.
                </h1>
              </>
            )}
          </div>

          {/* 1-Tap Pre-Order Mode & Time Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl">
              {(
                [
                  { id: 'collect', label: 'Collect', icon: Store },
                  { id: 'dine-in', label: 'Dine In', icon: UtensilsCrossed },
                  { id: 'delivery', label: 'Delivery', icon: Truck },
                ] as const
              ).map((m) => {
                const Icon = m.icon;
                const active = fulfillmentMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onChangeModeQuick(m.id)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      active ? 'bg-white text-[#3B1248] shadow-xs' : 'text-stone-600 hover:text-[#1C181F]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onOpenFulfillment}
              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] hover:border-[#3B1248] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C181F] whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-[#3B1248] shrink-0" />
                <span className="tabular-nums">{selectedSlot.label}</span>
              </div>
              <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                {fulfillmentMode === 'delivery'
                  ? deliveryAddress
                  : fulfillmentMode === 'dine-in'
                    ? `${selectedStore.name} · ${dineInPreference}`
                    : selectedStore.name}
              </div>
            </button>
          </div>
        </div>

        {/* Sign-Up Conversion Strip (Guests) OR Tier + Streak Strip (Members) */}
        {member.isSignedUp ? (
          <div className="mt-5 pt-4 border-t border-stone-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#1C181F]">
                  <Flame className="w-4 h-4 text-[#3B1248] shrink-0" />
                  <span>
                    <strong className="font-semibold tabular-nums">
                      {member.streakWeeks > 0 ? `${member.streakWeeks}-week streak` : 'Week 1 started'}
                    </strong>
                    {' '}— {member.streakDaysLeft} days left to keep your ritual bonus
                  </span>
                </div>
                {member.welcomeCredit > 0 && (
                  <div className="text-[#2F6B3B] font-semibold tabular-nums">
                    ${member.welcomeCredit.toFixed(2)} welcome credit ready at checkout
                  </div>
                )}
                {member.expiringPoints > 0 && (
                  <div className="text-stone-600">
                    <span className="font-mono font-semibold text-[#3B1248] tabular-nums">
                      {member.expiringPoints} pts (${(member.expiringPoints / 20).toFixed(2)})
                    </span>{' '}
                    expiring in {member.expiringDaysLeft} days
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onOpenClub}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B1248] hover:underline whitespace-nowrap shrink-0 cursor-pointer min-h-[36px]"
              >
                <span className="tabular-nums">Stamp card {member.stampCount}/5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Member Tier Indicator & Progress Bar */}
            <button
              type="button"
              onClick={onOpenClub}
              className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-stone-200 hover:border-[#3B1248] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-left cursor-pointer"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-[#3B1248]">
                  {tierInfo.currentTier.name} Tier
                </span>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span className="text-stone-600 tabular-nums">
                  {tierInfo.currentTier.pointsRateLabel}
                </span>
                <span aria-hidden="true" className="text-stone-400">·</span>
                <span className="text-stone-700 tabular-nums">
                  {tierInfo.nextTier
                    ? `${tierInfo.bowlsNeededForNext} bowl${tierInfo.bowlsNeededForNext === 1 ? '' : 's'} to ${tierInfo.nextTier.name} Tier`
                    : 'Highest tier unlocked'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 sm:w-48 shrink-0">
                <div className="flex-1 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-[#3B1248] rounded-full transition-all"
                    style={{ width: `${tierInfo.progressPercent}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] font-semibold text-[#3B1248] tabular-nums">
                  {tierInfo.nextTier ? `${member.totalBowlsOrdered}/${tierInfo.nextTier.minBowls}` : 'Max'}
                </span>
              </div>
            </button>
          </div>
        ) : (
          <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-stone-700">
              <strong className="text-[#3B1248]">Don&rsquo;t pay full guest price:</strong> Join Belly Belly Good Club free in 10 seconds to unlock{' '}
              <strong className="font-semibold text-[#1C181F]">$3.00 welcome credit</strong>, member pricing on every bowl, and your 5-bowl reward card.
            </div>
            <button
              type="button"
              onClick={() =>
                onOpenJoinSheet('Unlock $3.00 welcome credit + instant member pricing on every bowl')
              }
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#F4EFF6] border border-[#3B1248]/25 text-xs font-semibold text-[#3B1248] hover:bg-[#3B1248] hover:text-white transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join Free · Claim $3.00</span>
            </button>
          </div>
        )}
      </section>

      {/* Tested Element (Version B only): Encourage customers to sign up as members */}
      {showMemberBannerB && !member.isSignedUp && (
        <section
          aria-label="Member sign-up invitation"
          className="bg-[#3B1248] text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <h2 className="font-display text-lg sm:text-xl font-semibold leading-snug">
              Join Belly Belly Good membership before you check out
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              Sign up in seconds to unlock 10% member pricing on every bowl and bundle, claim your $3.00 welcome credit, and keep every stamp from today&rsquo;s order.
            </p>
          </div>
          <button
            type="button"
            onClick={onJoinNowClick}
            className="min-h-[46px] px-6 py-2.5 rounded-xl bg-white text-[#3B1248] text-sm font-semibold hover:bg-stone-100 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Join now
          </button>
        </section>
      )}

      {/* Inline Live Bag Preview (on the same page, no page switch) */}
      {bag.length > 0 && (
        <section
          aria-label="Current bag preview"
          className="bg-white rounded-2xl border border-[#3B1248]/30 p-4 sm:p-5 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F4EFF6] text-[#3B1248] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#1C181F] tabular-nums">
                  Bag Preview · {bagCount} {bagCount === 1 ? 'item' : 'items'} · ${bagSubtotal.toFixed(2)}
                </div>
                <div className="text-[11px] text-stone-500">
                  {!member.isSignedUp
                    ? `Join free inside preview to save $${(guestSavingsOnBag + 3.0).toFixed(2)} on this order`
                    : `${selectedStore.name} · ${selectedSlot.label}`}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
            >
              <span>Preview &amp; Checkout · ${bagSubtotal.toFixed(2)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
            {bag.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#FAF9F6] border border-stone-200 text-xs"
              >
                <span className="font-medium text-[#1C181F] max-w-[150px] truncate">{item.name}</span>
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="w-6 h-6 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:text-[#3B1248] cursor-pointer"
                    aria-label={`Remove one ${item.name}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-4 text-center font-mono font-semibold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="w-6 h-6 rounded-md bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:text-[#3B1248] cursor-pointer"
                    aria-label={`Add one ${item.name}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeOrder && bag.length === 0 && (
        <section className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#2F6B3B] shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-[#1C181F] tabular-nums">
                Active Pre-Order #{activeOrder.orderCode}
              </span>
              <span className="text-stone-500">
                {' '}· {activeOrder.storeName} · {activeOrder.scheduledSlot}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenCart}
            className="min-h-[38px] px-3.5 rounded-xl bg-[#F4EFF6] text-[#3B1248] text-xs font-semibold hover:bg-[#3B1248] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Live Prep Pass
          </button>
        </section>
      )}

      {/* Focal Anchor Hero */}
      <section className="bg-white rounded-3xl border border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 relative min-h-[240px] sm:min-h-[320px] bg-stone-100">
          <BowlImage
            src={heroItem.image}
            alt={heroItem.name}
            className="w-full h-full object-cover lg:absolute lg:inset-0"
          />
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-medium text-stone-500">
              Wild Pará Harvest · {heroItem.prepMinutes} min stone-blended prep
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C181F] mt-2 leading-tight [text-wrap:balance]">
              {heroItem.name}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed mt-3">
              {heroItem.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span>{heroItem.flavorNotes.join(' · ')}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{heroItem.calories} kcal</span>
            </div>
            {!member.isSignedUp && (
              <p className="text-xs font-medium text-[#2F6B3B] mt-3 tabular-nums">
                Member price: ${heroItem.memberPrice.toFixed(2)} (save $
                {(heroItem.price - heroItem.memberPrice).toFixed(2)} + $3.00 welcome credit)
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onSelectMenuItem(heroItem)}
              className="flex-1 min-w-[160px] min-h-[48px] px-5 py-3 rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] active:scale-[0.99] transition-all cursor-pointer tabular-nums"
            >
              Order Bowl · $
              {(member.isSignedUp ? heroItem.memberPrice : heroItem.price).toFixed(2)}
            </button>
            {primaryCustomBowl ? (
              <button
                type="button"
                onClick={() => onQuickAddCustomBowl(primaryCustomBowl)}
                className="min-h-[48px] px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs font-semibold text-[#1C181F] hover:border-[#3B1248] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#3B1248]" />
                <span>Reorder {primaryCustomBowl.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenBuilder}
                className="min-h-[48px] px-4 py-3 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs font-semibold text-[#1C181F] hover:border-[#3B1248] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#3B1248]" />
                <span>Build Your Own</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Own Identity Saved Blends Row */}
      <section aria-labelledby="saved-blends-heading">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 id="saved-blends-heading" className="font-display text-xl sm:text-2xl font-semibold text-[#1C181F]">
              Your Signature Identity
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {member.isSignedUp
                ? 'Custom bowls crafted and named by you — ready in one tap'
                : 'Craft and name your own custom blend, then save it to your membership'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBuilder}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-[#3B1248] hover:border-[#3B1248] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Craft New Blend</span>
          </button>
        </div>

        {customBowls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customBowls.map((bowl) => {
              const added = recentlyAddedId === bowl.id;
              return (
                <div
                  key={bowl.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                      <span className="font-medium text-[#3B1248]">Your Signature</span>
                      <span className="font-mono tabular-nums">{bowl.totalKcal} kcal</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#1C181F] mt-1">
                      {bowl.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">{bowl.moodLabel}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="font-mono text-sm font-semibold text-[#1C181F] tabular-nums">
                      ${bowl.unitPrice.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onQuickAddCustomBowl(bowl)}
                      className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                        added
                          ? 'bg-[#2F6B3B] text-white'
                          : 'bg-[#F4EFF6] text-[#3B1248] hover:bg-[#3B1248] hover:text-white'
                      }`}
                    >
                      {added ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>1-Tap Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#1C181F]">
                No saved blend yet — create your signature recipe
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Pick your exact açai base, crunch, and drizzle, name it as your own, and save it to your Ritual Club account for 1-tap pre-orders.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenBuilder}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Build &amp; Name Bowl
            </button>
          </div>
        )}
      </section>

      {/* Menu & Bundles Grid */}
      <section id="menu-catalog" aria-labelledby="menu-catalog-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 id="menu-catalog-heading" className="font-display text-xl sm:text-2xl font-semibold text-[#1C181F]">
              Signature Bowls &amp; Value Bundles
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Members unlock lower pricing on every bowl and bundle automatically
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl self-start sm:self-auto">
            {(
              [
                { id: 'all', label: 'All Menu' },
                { id: 'signature', label: 'Bowls' },
                { id: 'bundle', label: 'Bundles' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeFilter(tab.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  menuFilter === tab.id
                    ? 'bg-white text-[#3B1248] shadow-xs'
                    : 'text-stone-600 hover:text-[#1C181F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const added = recentlyAddedId === item.id;
            const activePrice = member.isSignedUp ? item.memberPrice : item.price;
            const memberDelta = item.price - item.memberPrice;

            return (
              <article
                key={item.id}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5"
              >
                <button
                  type="button"
                  onClick={() => onSelectMenuItem(item)}
                  className="text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#3B1248] cursor-pointer"
                >
                  <div className="aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                    <BowlImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-4 pb-3">
                    <div className="text-[12px] text-stone-500 flex items-center justify-between gap-2">
                      <span className="truncate">
                        {item.category === 'bundle' ? 'Bundle Pack' : 'Signature Bowl'} · {item.prepMinutes} min
                      </span>
                      <span className="font-mono tabular-nums shrink-0">{item.calories} kcal</span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-[#1C181F] mt-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                    {!member.isSignedUp ? (
                      <p className="text-xs font-semibold text-[#2F6B3B] mt-2 tabular-nums">
                        Member price ${item.memberPrice.toFixed(2)} (save ${memberDelta.toFixed(2)})
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-[#2F6B3B] mt-2 tabular-nums">
                        Member price applied · saves ${memberDelta.toFixed(2)}
                      </p>
                    )}
                    {item.limitedBatchLeft && (
                      <p className="text-xs font-medium text-[#3B1248] mt-1.5">
                        {item.limitedBatchLeft} left in this batch
                      </p>
                    )}
                  </div>
                </button>

                <div className="mt-auto px-4 pb-4 pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[15px] font-semibold text-[#1C181F] tabular-nums">
                      ${activePrice.toFixed(2)}
                    </span>
                    {member.isSignedUp ? (
                      <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                        ${item.price.toFixed(2)}
                      </span>
                    ) : (
                      item.compareAtPrice && (
                        <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                          ${item.compareAtPrice.toFixed(2)}
                        </span>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onQuickAddMenuItem(item)}
                    className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                      added
                        ? 'bg-[#2F6B3B] text-white'
                        : 'bg-[#3B1248] text-white hover:bg-[#260A30]'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Quick Add</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
