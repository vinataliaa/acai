import { useMemo, useState } from 'react';
import { BookmarkCheck, Check, Plus, Sparkles } from 'lucide-react';
import {
  BASE_OPTIONS,
  BOWL_SIZES,
  TOPPING_OPTIONS,
  computeTasteArchetype,
} from '../data/acaiData';
import { BowlSizeId, CustomBowl } from '../types/acai';

interface BowlBuilderViewProps {
  memberName: string;
  isMember: boolean;
  onSaveAndAdd: (bowl: CustomBowl, shouldSaveIdentity: boolean) => void;
  onPromptJoinToSave: (bowlName: string) => void;
}

const MOOD_PRESETS = [
  'Morning Focus',
  'Post-Run Recovery',
  'Afternoon Lift',
  'Evening Reset',
];

export function BowlBuilderView({
  memberName,
  isMember,
  onSaveAndAdd,
  onPromptJoinToSave,
}: BowlBuilderViewProps) {
  const firstName = memberName ? memberName.split(' ')[0] : 'My';
  const [bowlName, setBowlName] = useState(`${firstName}'s Evening Reset`);
  const [moodLabel, setMoodLabel] = useState('Morning Focus');
  const [sizeId, setSizeId] = useState<BowlSizeId>('regular');
  const [baseId, setBaseId] = useState<string>('para-velvet');
  const [fruitIds, setFruitIds] = useState<string[]>(['strawberry', 'banana']);
  const [crunchIds, setCrunchIds] = useState<string[]>(['oat-granola']);
  const [drizzleIds, setDrizzleIds] = useState<string[]>(['almond-butter']);
  const [boostIds, setBoostIds] = useState<string[]>([]);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  const fruits = TOPPING_OPTIONS.filter((t) => t.category === 'fruit');
  const crunches = TOPPING_OPTIONS.filter((t) => t.category === 'crunch');
  const drizzles = TOPPING_OPTIONS.filter((t) => t.category === 'drizzle');
  const boosts = TOPPING_OPTIONS.filter((t) => t.category === 'boost');

  const toggleItem = (
    list: string[],
    setter: (next: string[]) => void,
    id: string,
    maxCount: number
  ) => {
    if (list.includes(id)) {
      setter(list.filter((item) => item !== id));
    } else if (list.length < maxCount) {
      setter([...list, id]);
    } else {
      setter([...list.slice(1), id]);
    }
  };

  const { unitPrice, memberUnitPrice, totalKcal, selectedNames, archetype } = useMemo(() => {
    const basePrice = 9.5;
    const sizeObj = BOWL_SIZES.find((s) => s.id === sizeId) ?? BOWL_SIZES[0];
    const baseObj = BASE_OPTIONS.find((b) => b.id === baseId) ?? BASE_OPTIONS[0];
    const allPickedIds = [...fruitIds, ...crunchIds, ...drizzleIds, ...boostIds];
    const pickedToppings = TOPPING_OPTIONS.filter((t) => allPickedIds.includes(t.id));

    const toppingsPrice = pickedToppings.reduce((acc, item) => acc + item.price, 0);
    const toppingsKcal = pickedToppings.reduce((acc, item) => acc + item.kcal, 0);
    const full = basePrice + sizeObj.priceDelta + baseObj.priceDelta + toppingsPrice;

    return {
      unitPrice: full,
      memberUnitPrice: Number((full * 0.9).toFixed(2)),
      totalKcal: baseObj.kcal + sizeObj.kcalDelta + toppingsKcal,
      selectedNames: pickedToppings.map((t) => t.name),
      archetype: computeTasteArchetype({ baseId, fruitIds, crunchIds, drizzleIds, boostIds }),
    };
  }, [sizeId, baseId, fruitIds, crunchIds, drizzleIds, boostIds]);

  const handleSubmit = () => {
    const cleanName = bowlName.trim() || `${firstName}'s Custom Blend`;
    const newBowl: CustomBowl = {
      id: `custom-${Date.now()}`,
      name: cleanName,
      moodLabel,
      sizeId,
      baseId,
      fruitIds,
      crunchIds,
      drizzleIds,
      boostIds,
      unitPrice: Number(unitPrice.toFixed(2)),
      totalKcal,
      createdAt: 'Just now',
    };
    onSaveAndAdd(newBowl, saveToProfile);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);

    if (saveToProfile && !isMember) {
      onPromptJoinToSave(cleanName);
    }
  };

  const selectedBase = BASE_OPTIONS.find((b) => b.id === baseId) ?? BASE_OPTIONS[0];

  return (
    <div className="pb-10">
      <div className="mb-6">
        <p className="text-xs font-medium text-[#3B1248]">Personal Bowl Identity</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1C181F] mt-1">
          Craft &amp; Name Your Own Blend
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Build your exact texture and flavor balance. Save it to your Belly Belly Good Club profile for 10% member pricing and 1-tap pre-orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white rounded-2xl border border-stone-200 p-5">
            <h2 className="font-display text-lg font-semibold text-[#1C181F]">01. Bowl Size</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {BOWL_SIZES.map((s) => {
                const active = sizeId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSizeId(s.id)}
                    className={`min-h-[56px] p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#F4EFF6] border-[#3B1248] text-[#3B1248]'
                        : 'bg-[#FAF9F6] border-stone-200 text-[#1C181F] hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{s.label}</span>
                      <span className="font-mono tabular-nums">
                        {s.priceDelta === 0 ? '$9.50 base' : `+$${s.priceDelta.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5 tabular-nums">
                      {s.weightGrams}g cold-spun pulp base
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-stone-200 p-5">
            <h2 className="font-display text-lg font-semibold text-[#1C181F]">02. Wild Açai Base</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {BASE_OPTIONS.map((b) => {
                const active = baseId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBaseId(b.id)}
                    className={`min-h-[68px] p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#F4EFF6] border-[#3B1248] text-[#3B1248]'
                        : 'bg-[#FAF9F6] border-stone-200 text-[#1C181F] hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-sm font-semibold">
                      <span>{b.name}</span>
                      <span className="font-mono text-xs tabular-nums shrink-0">
                        {b.priceDelta === 0 ? 'Included' : `+$${b.priceDelta.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-1">{b.originNote}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-stone-200 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-[#1C181F]">03. Fresh Fruits</h2>
              <span className="text-xs text-stone-500 tabular-nums">{fruitIds.length} / 3 selected</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
              {fruits.map((item) => {
                const active = fruitIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(fruitIds, setFruitIds, item.id, 3)}
                    className={`min-h-[52px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#F4EFF6] border-[#3B1248] text-[#3B1248]'
                        : 'bg-[#FAF9F6] border-stone-200 text-[#1C181F] hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {item.flavorTag} · {item.kcal} kcal
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      +${item.price.toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-stone-200 p-5 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-[#1C181F]">04. Granola &amp; Crunch</h2>
                <span className="text-xs text-stone-500 tabular-nums">{crunchIds.length} / 2 selected</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                {crunches.map((item) => {
                  const active = crunchIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(crunchIds, setCrunchIds, item.id, 2)}
                      className={`min-h-[52px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#F4EFF6] border-[#3B1248] text-[#3B1248]'
                          : 'bg-[#FAF9F6] border-stone-200 text-[#1C181F] hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {item.flavorTag} · {item.kcal} kcal
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold tabular-nums">
                        +${item.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-stone-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-[#1C181F]">Artisanal Drizzles</h3>
                <span className="text-xs text-stone-500 tabular-nums">{drizzleIds.length} / 2 selected</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                {drizzles.map((item) => {
                  const active = drizzleIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(drizzleIds, setDrizzleIds, item.id, 2)}
                      className={`min-h-[52px] px-3.5 py-2.5 rounded-xl border flex flex-col justify-between text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#F4EFF6] border-[#3B1248] text-[#3B1248]'
                          : 'bg-[#FAF9F6] border-stone-200 text-[#1C181F] hover:border-stone-300'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.name}</div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                        <span>{item.flavorTag}</span>
                        <span className="font-mono tabular-nums">+${item.price.toFixed(2)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-stone-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-[#1C181F]">Functional Boosts</h3>
                <span className="text-xs text-stone-500 tabular-nums">{boostIds.length} / 2 selected</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                {boosts.map((item) => {
                  const active = boostIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(boostIds, setBoostIds, item.id, 2)}
                      className={`min-h-[52px] px-3.5 py-2.5 rounded-xl border flex flex-col justify-between text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#F4EFF6] border-[#3B1248] text-[#3B1248]'
                          : 'bg-[#FAF9F6] border-stone-200 text-[#1C181F] hover:border-stone-300'
                      }`}
                    >
                      <div className="text-xs font-semibold">{item.name}</div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                        <span>{item.flavorTag}</span>
                        <span className="font-mono tabular-nums">+${item.price.toFixed(2)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white rounded-2xl border border-stone-200 p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="inline-flex items-center gap-1 text-[#3B1248] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{archetype}</span>
              </span>
              <span className="font-mono tabular-nums">{totalKcal} kcal</span>
            </div>

            <label htmlFor="custom-bowl-name" className="block text-xs font-semibold text-stone-700 mt-4 mb-1.5">
              Name Your Signature Bowl
            </label>
            <input
              id="custom-bowl-name"
              type="text"
              value={bowlName}
              onChange={(e) => setBowlName(e.target.value)}
              maxLength={38}
              placeholder="e.g., Maya's Post-Run Blend"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 bg-[#FAF9F6] text-sm font-medium text-[#1C181F] focus:outline-none focus:border-[#3B1248]"
            />

            <p className="text-xs font-semibold text-stone-700 mt-4 mb-2">Ritual Occasion</p>
            <div className="grid grid-cols-2 gap-1.5">
              {MOOD_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMoodLabel(preset)}
                  className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    moodLabel === preset
                      ? 'bg-[#3B1248] text-white border-[#3B1248]'
                      : 'bg-[#FAF9F6] text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 space-y-2">
            <div className="text-xs font-semibold text-stone-800">Current Composition</div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedBase.name}
              {selectedNames.length > 0 ? ` · ${selectedNames.join(' · ')}` : ' · Pure base only'}
            </p>
          </div>

          <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={saveToProfile}
              onChange={(e) => setSaveToProfile(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#3B1248] rounded cursor-pointer"
            />
            <span className="text-xs text-stone-700 leading-snug">
              {isMember
                ? 'Save to Your Signature Identity for 1-tap pre-orders'
                : 'Save to my new Club account so I never lose this recipe (+ get 10% member price)'}
            </span>
          </label>

          <div className="border-t border-stone-200 pt-4">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-stone-600">
                {isMember ? 'Member Bowl Total' : 'Custom Bowl Total'}
              </span>
              <span className="font-mono text-xl font-semibold text-[#1C181F] tabular-nums">
                ${(isMember ? memberUnitPrice : unitPrice).toFixed(2)}
              </span>
            </div>
            {!isMember && (
              <p className="text-xs text-[#2F6B3B] font-medium mb-3 tabular-nums">
                Club member price: ${memberUnitPrice.toFixed(2)} (save ${(unitPrice - memberUnitPrice).toFixed(2)})
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className={`w-full min-h-[48px] px-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                justAdded
                  ? 'bg-[#2F6B3B] text-white'
                  : 'bg-[#3B1248] text-white hover:bg-[#260A30] active:scale-[0.99]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved &amp; Added to Bag</span>
                </>
              ) : saveToProfile ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>{isMember ? 'Save & Add to Bag' : 'Save Recipe & Join Free'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Bowl to Bag</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
