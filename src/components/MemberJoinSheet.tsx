import { useState } from 'react';
import { Award, Check, ShieldCheck, Sparkles, X } from 'lucide-react';

interface MemberJoinSheetProps {
  isOpen: boolean;
  onClose: () => void;
  contextReason?: string;
  potentialSavings?: number;
  initialPlan?: 'free' | 'pass';
  onCompleteSignup: (payload: {
    name: string;
    email: string;
    phone: string;
    joinRoxaPass: boolean;
  }) => void;
}

export function MemberJoinSheet({
  isOpen,
  onClose,
  contextReason,
  potentialSavings = 0,
  initialPlan = 'free',
  onCompleteSignup,
}: MemberJoinSheetProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState<'free' | 'pass'>(initialPlan);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    if (!cleanName) {
      setError('Please enter your first name so we can label your cup sleeve.');
      return;
    }
    if (!cleanEmail && !cleanPhone) {
      setError('Enter an email or mobile number to save your points and blends.');
      return;
    }
    setError('');
    onCompleteSignup({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      joinRoxaPass: plan === 'pass',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Join Belly Belly Good Club"
    >
      <div className="w-full lg:max-w-lg bg-[#FAF9F6] rounded-t-3xl lg:rounded-3xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden">
        <div className="lg:hidden pt-3 pb-1 flex justify-center bg-white">
          <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white">
          <div>
            <p className="text-xs font-semibold text-[#3B1248]">Belly Belly Good Membership</p>
            <h2 className="font-display text-xl font-semibold text-[#1C181F]">
              Join in 10 Seconds
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-500 hover:text-[#1C181F] hover:bg-stone-100 cursor-pointer"
            aria-label="Close sign up sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#F4EFF6] border border-[#3B1248]/15">
            <div className="text-xs font-semibold text-[#3B1248] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                {contextReason || 'Unlock $3.00 welcome credit + member pricing immediately'}
              </span>
            </div>
            {potentialSavings > 0 && (
              <p className="text-xs text-stone-700 mt-1 tabular-nums">
                Instant savings waiting on your current bag: <strong>${potentialSavings.toFixed(2)}</strong>
              </p>
            )}
          </div>

          {/* Plan Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPlan('free')}
              className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                plan === 'free'
                  ? 'bg-white border-[#3B1248]'
                  : 'bg-white/70 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C181F] inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#3B1248]" />
                  <span>Ritual Club</span>
                </span>
                <span className="font-mono text-xs font-semibold text-[#2F6B3B]">Free</span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#3B1248] shrink-0" />
                  <span>$3.00 welcome credit today</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#3B1248] shrink-0" />
                  <span>10% off member pricing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#3B1248] shrink-0" />
                  <span>Save custom bowls &amp; stamps</span>
                </li>
              </ul>
            </button>

            <button
              type="button"
              onClick={() => setPlan('pass')}
              className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                plan === 'pass'
                  ? 'bg-white border-[#3B1248]'
                  : 'bg-white/70 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1C181F] inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3B1248]" />
                  <span>Belly Good Pass</span>
                </span>
                <span className="font-mono text-xs font-semibold text-[#3B1248] tabular-nums">
                  $14.90/mo
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#3B1248] shrink-0" />
                  <span>1 free bowl ($13.50) every month</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#3B1248] shrink-0" />
                  <span>$0 delivery + 6m priority prep</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-[#3B1248] shrink-0" />
                  <span>Monthly Streak Shield included</span>
                </li>
              </ul>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="join-name" className="block text-xs font-semibold text-stone-700 mb-1">
                First Name (for your cup sleeve)
              </label>
              <input
                id="join-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Maya"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="join-email" className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  id="join-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
                />
              </div>
              <div>
                <label htmlFor="join-phone" className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile (for pickup alerts)
                </label>
                <input
                  id="join-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(415) 555-0142"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-sm text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full min-h-[48px] px-5 rounded-xl bg-[#3B1248] text-white text-sm font-semibold hover:bg-[#260A30] active:scale-[0.99] transition-all cursor-pointer"
          >
            {plan === 'pass'
              ? 'Join Belly Good Pass & Unlock Free Bowl'
              : 'Join Free & Claim $3.00 Welcome Credit'}
          </button>

          <p className="text-[11px] text-center text-stone-500">
            No spam. Your saved blends, stamps, and member prices apply immediately.
          </p>
        </form>
      </div>
    </div>
  );
}
