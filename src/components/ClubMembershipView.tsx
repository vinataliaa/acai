import { useState } from 'react';
import { Award, Check, Crown, Flame, Pencil, RotateCcw, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { MEMBERSHIP_TIERS, STORE_LOCATIONS, getTierProgress } from '../data/acaiData';
import { MemberProfile, OrderRecord } from '../types/acai';

interface ClubMembershipViewProps {
  member: MemberProfile;
  orders: OrderRecord[];
  onCompleteSignup: (payload: {
    name: string;
    email: string;
    phone: string;
    joinRoxaPass: boolean;
    favoriteStoreId?: string;
  }) => void;
  onUpdateName: (name: string) => void;
  onToggleRoxaPass: () => void;
  onGoToCheckoutWithRedeem: () => void;
  onReorderOrder: (order: OrderRecord) => void;
  onPreviewTierBowls: (bowlCount: number) => void;
  onResetGuestDemo: () => void;
}

export function ClubMembershipView({
  member,
  orders,
  onCompleteSignup,
  onUpdateName,
  onToggleRoxaPass,
  onGoToCheckoutWithRedeem,
  onReorderOrder,
  onPreviewTierBowls,
  onResetGuestDemo,
}: ClubMembershipViewProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(member.name);

  // Guest sign-up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupStoreId, setSignupStoreId] = useState(member.favoriteStoreId || 'hayes');
  const [signupPlan, setSignupPlan] = useState<'free' | 'pass'>('free');
  const [signupError, setSignupError] = useState('');

  const handleSaveName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed) {
      onUpdateName(trimmed);
    }
    setEditingName(false);
  };

  const handleGuestSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) {
      setSignupError('Enter your first name so our baristas know who to label the cup for.');
      return;
    }
    if (!signupEmail.trim() && !signupPhone.trim()) {
      setSignupError('Add an email or mobile number to store your stamps and custom bowls.');
      return;
    }
    setSignupError('');
    onCompleteSignup({
      name: signupName.trim(),
      email: signupEmail.trim(),
      phone: signupPhone.trim(),
      joinRoxaPass: signupPlan === 'pass',
      favoriteStoreId: signupStoreId,
    });
  };

  if (!member.isSignedUp) {
    return (
      <div className="space-y-8 pb-10">
        {/* Guest Membership Value Hero */}
        <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#3B1248]">Belly Belly Good Club &amp; Pass</p>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1C181F] mt-1.5 leading-tight [text-wrap:balance]">
                Make your weekly açai effortless — and stop paying full guest prices.
              </h1>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                Join in 10 seconds to unlock immediate member pricing across all bowls and bundles, keep your custom-named recipes, and collect stamps toward free bowls.
              </p>
            </div>

            {/* Tier Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSignupPlan('free')}
                className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer ${
                  signupPlan === 'free'
                    ? 'bg-[#F4EFF6] border-[#3B1248]'
                    : 'bg-[#FAF9F6] border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1C181F] inline-flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#3B1248]" />
                    <span>Ritual Club</span>
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#2F6B3B]">Free</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3B1248] shrink-0" />
                    <span>$3.00 welcome credit today</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3B1248] shrink-0" />
                    <span>10% lower member menu prices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3B1248] shrink-0" />
                    <span>5th-bowl $8.00 stamp reward</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3B1248] shrink-0" />
                    <span>Save custom-named bowls</span>
                  </li>
                </ul>
              </button>

              <button
                type="button"
                onClick={() => setSignupPlan('pass')}
                className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer ${
                  signupPlan === 'pass'
                    ? 'bg-[#F4EFF6] border-[#3B1248]'
                    : 'bg-[#FAF9F6] border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1C181F] inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#3B1248]" />
                    <span>Belly Good Pass</span>
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#3B1248] tabular-nums">
                    $14.90/mo
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3B1248] shrink-0" />
                    <span>1 free signature bowl/mo ($13.50)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3B1248] shrink-0" />
                    <span>$0 delivery on every order</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3B1248] shrink-0" />
                    <span>Priority 6-min skip-the-line prep</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3B1248] shrink-0" />
                    <span>1 monthly Streak Shield included</span>
                  </li>
                </ul>
              </button>
            </div>
          </div>

          {/* Inline Fast Sign-up Form */}
          <form
            onSubmit={handleGuestSignupSubmit}
            className="lg:col-span-6 bg-[#FAF9F6] rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[#1C181F]">
                Create Your Member Pass
              </h2>
              <span className="text-xs font-semibold text-[#2F6B3B]">
                {signupPlan === 'pass' ? 'Includes 1 Free Bowl Now' : '+$3.00 Instant Credit'}
              </span>
            </div>

            <div>
              <label htmlFor="club-name" className="block text-xs font-semibold text-stone-700 mb-1">
                Your Name (printed on your cup sleeve)
              </label>
              <input
                id="club-name"
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="e.g., Maya Lin"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="club-email" className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  id="club-email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
                />
              </div>
              <div>
                <label htmlFor="club-phone" className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number
                </label>
                <input
                  id="club-phone"
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="(415) 555-0142"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="club-store" className="block text-xs font-semibold text-stone-700 mb-1">
                Home Açai House
              </label>
              <select
                id="club-store"
                value={signupStoreId}
                onChange={(e) => setSignupStoreId(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
              >
                {STORE_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} · {loc.neighborhood}
                  </option>
                ))}
              </select>
            </div>

            {signupError && (
              <p className="text-xs font-medium text-red-700" role="alert">
                {signupError}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] px-5 rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] active:scale-[0.99] transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>
                {signupPlan === 'pass'
                  ? 'Join Belly Good Pass ($14.90/mo) & Unlock Perks'
                  : 'Join Free & Claim $3.00 Welcome Credit'}
              </span>
            </button>

            <p className="text-[11px] text-stone-500 text-center">
              Member prices apply immediately to every bowl and bundle in your Bag.
            </p>
          </form>
        </section>
      </div>
    );
  }

  const tierInfo = getTierProgress(member.totalBowlsOrdered);

  return (
    <div className="space-y-8 pb-10">
      {/* Recognition + Tier Progress Header */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="font-semibold text-[#3B1248]">
                {member.isRoxaPass ? 'Belly Good Pass Member' : `${member.tier} Tier`}
              </span>
              <span aria-hidden="true">·</span>
              <span>Member since {member.memberSince}</span>
              <span aria-hidden="true">·</span>
              <span>{member.tasteArchetype}</span>
            </div>

            {editingName ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  maxLength={32}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#3B1248] bg-[#FAF9F6] font-display text-xl font-semibold text-[#1C181F] focus:outline-none"
                  aria-label="Member name"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="min-h-[44px] px-4 rounded-xl bg-[#3B1248] text-white text-xs font-semibold cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-1.5">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C181F]">
                  {member.name}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setNameDraft(member.name);
                    setEditingName(true);
                  }}
                  className="min-h-[40px] min-w-[40px] rounded-xl border border-stone-200 flex items-center justify-center text-stone-500 hover:text-[#3B1248] hover:border-[#3B1248] transition-colors cursor-pointer"
                  aria-label="Edit your member name"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <p className="text-sm text-stone-600 mt-2 max-w-xl">
              Recognized across all 3 Belly Belly Good Açai Houses. Member pricing is automatically active on every bowl and bundle.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100 shrink-0">
            <div>
              <div className="text-xs text-stone-500">Available Credit</div>
              <div className="font-mono text-2xl font-semibold text-[#1C181F] tabular-nums mt-0.5">
                ${(member.welcomeCredit + member.points / 20).toFixed(2)}
              </div>
              <div className="text-[11px] text-[#2F6B3B] font-medium tabular-nums">
                {member.points} pts
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Ritual Streak</div>
              <div className="font-mono text-2xl font-semibold text-[#3B1248] tabular-nums mt-0.5">
                {member.streakWeeks}w
              </div>
              <div className="text-[11px] text-stone-500">+25% earn rate</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Bowls Enjoyed</div>
              <div className="font-mono text-2xl font-semibold text-[#1C181F] tabular-nums mt-0.5">
                {member.totalBowlsOrdered}
              </div>
              <div className="text-[11px] text-stone-500">
                {tierInfo.nextTier
                  ? `${tierInfo.bowlsNeededForNext} to ${tierInfo.nextTier.name} tier`
                  : 'Crown tier unlocked'}
              </div>
            </div>
          </div>
        </div>

        {/* Tier Progress Indicator Bar */}
        <div className="pt-5 border-t border-stone-100 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#1C181F]">
              <Crown className="w-4 h-4 text-[#3B1248]" />
              <span>
                {tierInfo.currentTier.name} Tier Active · {tierInfo.currentTier.pointsRateLabel}
              </span>
            </div>
            <span className="text-stone-600 tabular-nums">
              {tierInfo.nextTier
                ? `${member.totalBowlsOrdered} / ${tierInfo.nextTier.minBowls} bowls toward ${tierInfo.nextTier.name} Tier`
                : `${member.totalBowlsOrdered} bowls enjoyed · Top tier unlocked`}
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-[#3B1248] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(6, tierInfo.progressPercent)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Membership Tier Ladder */}
      <section aria-labelledby="membership-tiers-heading" className="space-y-4">
        <div>
          <h2 id="membership-tiers-heading" className="font-display text-xl sm:text-2xl font-semibold text-[#1C181F]">
            Membership Tiers &amp; Perks
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Every pre-order counts toward your tier status — unlocked tiers stay active for the full year
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {MEMBERSHIP_TIERS.map((tierDef) => {
            const isCurrent = tierInfo.currentTier.id === tierDef.id;
            const isUnlocked = member.totalBowlsOrdered >= tierDef.minBowls;
            const bowlsAway = Math.max(0, tierDef.minBowls - member.totalBowlsOrdered);

            return (
              <div
                key={tierDef.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                  isCurrent
                    ? 'bg-[#F4EFF6] border-[#3B1248]'
                    : isUnlocked
                      ? 'bg-white border-stone-200'
                      : 'bg-white/70 border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-semibold text-stone-500 tabular-nums">
                      {tierDef.minBowls === 0 ? '0+ bowls' : `${tierDef.minBowls}+ bowls`}
                    </span>
                    <span
                      className={`font-semibold ${
                        isCurrent
                          ? 'text-[#3B1248]'
                          : isUnlocked
                            ? 'text-[#2F6B3B]'
                            : 'text-stone-500'
                      }`}
                    >
                      {isCurrent
                        ? 'Current Tier'
                        : isUnlocked
                          ? 'Unlocked'
                          : `${bowlsAway} bowl${bowlsAway === 1 ? '' : 's'} away`}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-[#1C181F] mt-1.5">
                    {tierDef.name} Tier
                  </h3>
                  <p className="text-xs font-medium text-[#3B1248] mt-0.5 tabular-nums">
                    {tierDef.pointsRateLabel}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">{tierDef.tagline}</p>

                  <ul className="mt-4 space-y-2 text-xs text-stone-700">
                    {tierDef.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <Check
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isUnlocked ? 'text-[#3B1248]' : 'text-stone-400'
                          }`}
                        />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stamp Card + Loss Avoidance Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[#1C181F]">
                5-Bowl Ritual Stamp Card
              </h2>
              <span className="font-mono text-xs font-semibold text-[#3B1248] tabular-nums">
                {member.stampCount} / 5 stamps
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1.5">
              {member.stampCount >= 5
                ? 'Your complimentary $8.00 bowl reward is unlocked and ready in your Bag.'
                : `${5 - member.stampCount} more bowl${5 - member.stampCount === 1 ? '' : 's'} unlocks a complimentary $8.00 bowl credit.`}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {[1, 2, 3, 4, 5].map((step) => {
              const filled = step <= member.stampCount;
              return (
                <div
                  key={step}
                  className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-colors ${
                    filled
                      ? 'bg-[#3B1248] border-[#3B1248] text-white'
                      : 'bg-[#FAF9F6] border-dashed border-stone-300 text-stone-400'
                  }`}
                >
                  {filled ? (
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      {step === 5 ? '$8' : step}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span className="inline-flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#3B1248]" />
              <span>
                Streak window: <strong className="text-[#1C181F]">{member.streakDaysLeft} days left</strong>
              </span>
            </span>
            <span className="font-medium text-[#3B1248]">+25% multiplier active</span>
          </div>
        </section>

        {/* Welcome Credit / Expiring Points */}
        <section className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[#1C181F]">
                Active Rewards &amp; Protection
              </h2>
              <Award className="w-5 h-5 text-[#3B1248]" strokeWidth={1.7} />
            </div>

            {member.welcomeCredit > 0 ? (
              <div className="mt-3 p-4 rounded-xl bg-[#F4EFF6] border border-[#3B1248]/15">
                <div className="text-sm font-semibold text-[#3B1248] tabular-nums">
                  ${member.welcomeCredit.toFixed(2)} Welcome Credit Waiting
                </div>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  Apply your welcome credit directly on your next dine-in, collection, or delivery pre-order before it expires in 7 days.
                </p>
              </div>
            ) : member.expiringPoints > 0 ? (
              <div className="mt-3 p-4 rounded-xl bg-[#F4EFF6] border border-[#3B1248]/15">
                <div className="text-sm font-semibold text-[#3B1248] tabular-nums">
                  {member.expiringPoints} pts (${(member.expiringPoints / 20).toFixed(2)} value) expire in{' '}
                  {member.expiringDaysLeft} days
                </div>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  Apply your credit at checkout so nothing goes unused.
                </p>
              </div>
            ) : (
              <div className="mt-3 p-4 rounded-xl bg-[#FAF9F6] border border-stone-200">
                <div className="text-sm font-semibold text-[#2F6B3B]">
                  10% Member Pricing Active
                </div>
                <p className="text-xs text-stone-600 mt-1 tabular-nums">
                  You have {member.points} pts (${(member.points / 20).toFixed(2)} value) ready whenever you order.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onGoToCheckoutWithRedeem}
            className="w-full min-h-[46px] px-4 rounded-xl bg-[#3B1248] text-white text-xs font-semibold hover:bg-[#260A30] transition-colors cursor-pointer"
          >
            Open Bag &amp; Apply Member Perks
          </button>
        </section>
      </div>

      {/* Belly Good Pass Upgrade */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#3B1248]">
              <Sparkles className="w-4 h-4" />
              <span>Belly Good Pass Upgrade · $14.90 / month</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C181F]">
              {member.isRoxaPass
                ? 'Your Belly Good Pass is Active'
                : 'Upgrade to Belly Good Pass — pays for itself in 1 bowl + 1 delivery'}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
              Includes one complimentary signature bowl every month ($13.50 value), $0 delivery on every order, priority 6-minute cold-blend queue, and one monthly Streak Shield.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={onToggleRoxaPass}
              className={`w-full min-h-[50px] px-5 rounded-xl text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 ${
                member.isRoxaPass
                  ? 'bg-[#F4EFF6] text-[#3B1248] border border-[#3B1248] hover:bg-stone-100'
                  : 'bg-[#3B1248] text-white hover:bg-[#260A30]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {member.isRoxaPass ? 'Belly Good Pass Active (Pause)' : 'Upgrade to Belly Good Pass · $14.90/mo'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Past Orders */}
      {orders.length > 0 && (
        <section aria-labelledby="order-history-heading">
          <h2 id="order-history-heading" className="font-display text-xl font-semibold text-[#1C181F] mb-3">
            Recent Rituals
          </h2>
          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    <span className="font-mono font-semibold text-[#1C181F] tabular-nums">
                      #{ord.orderCode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{ord.fulfillmentMode.replace('-', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ord.storeName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ord.createdAt}</span>
                  </div>
                  <div className="text-sm font-semibold text-[#1C181F] mt-1">
                    {ord.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Crafted by {ord.baristaName} (Batch #{ord.batchNumber}) · Cup note: &ldquo;{ord.cupNote}&rdquo;
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className="font-mono text-sm font-semibold text-[#1C181F] tabular-nums">
                    ${ord.total.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onReorderOrder(ord)}
                    className="min-h-[42px] px-3.5 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-xs font-semibold text-[#3B1248] hover:border-[#3B1248] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/70">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span>Preview tier:</span>
          {[
            { label: 'Seed (1)', bowls: 1 },
            { label: 'Harvest (12)', bowls: 12 },
            { label: 'Crown (22)', bowls: 22 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onPreviewTierBowls(preset.bowls)}
              className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-stone-700 hover:border-[#3B1248] hover:text-[#3B1248] transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onResetGuestDemo}
          className="text-xs text-stone-400 hover:text-stone-700 underline cursor-pointer"
        >
          Reset to Guest Sign-Up View
        </button>
      </div>
    </div>
  );
}
