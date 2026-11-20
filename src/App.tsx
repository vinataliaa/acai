import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { BowlBuilderView } from './components/BowlBuilderView';
import { CartDrawer } from './components/CartDrawer';
import { ClubMembershipView } from './components/ClubMembershipView';
import { FulfillmentModal } from './components/FulfillmentModal';
import { HomeOrderView } from './components/HomeOrderView';
import { ItemDetailSheet } from './components/ItemDetailSheet';
import { MemberJoinSheet } from './components/MemberJoinSheet';
import { TopBar } from './components/TopBar';
import {
  BASE_OPTIONS,
  INITIAL_CUSTOM_BOWLS,
  INITIAL_MEMBER,
  INITIAL_ORDERS,
  PREORDER_SLOTS,
  STORE_LOCATIONS,
  computeTasteArchetype,
} from './data/acaiData';
import {
  AppTab,
  BowlSizeId,
  CartItem,
  CustomBowl,
  FulfillmentMode,
  MemberProfile,
  MenuItem,
  OrderRecord,
} from './types/acai';

const STORAGE_KEY = 'belly_belly_good_state_v1';

interface PersistedState {
  member: MemberProfile;
  customBowls: CustomBowl[];
  bag: CartItem[];
  orders: OrderRecord[];
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed.member && parsed.customBowls && parsed.bag && parsed.orders) {
        return {
          member: parsed.member,
          customBowls: parsed.customBowls,
          bag: parsed.bag,
          orders: parsed.orders,
        };
      }
    }
  } catch {
    // Fallback to new visitor state
  }
  return {
    member: INITIAL_MEMBER,
    customBowls: INITIAL_CUSTOM_BOWLS,
    bag: [],
    orders: INITIAL_ORDERS,
  };
}

export default function App() {
  const [initial] = useState<PersistedState>(() => loadInitialState());

  const [activeTab, setActiveTab] = useState<AppTab>('order');
  const [menuFilter, setMenuFilter] = useState<'all' | 'signature' | 'bundle'>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('collect');
  const [storeId, setStoreId] = useState<string>(initial.member.favoriteStoreId || 'hayes');
  const [slotId, setSlotId] = useState<string>('asap');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    initial.member.savedAddresses[0] || '742 Fell St, Apt 4B, San Francisco'
  );
  const [dineInPreference, setDineInPreference] = useState<string>('Window Counter');

  const [member, setMember] = useState<MemberProfile>(initial.member);
  const [customBowls, setCustomBowls] = useState<CustomBowl[]>(initial.customBowls);
  const [bag, setBag] = useState<CartItem[]>(initial.bag);
  const [orders, setOrders] = useState<OrderRecord[]>(initial.orders);

  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const [joinSheetState, setJoinSheetState] = useState<{
    isOpen: boolean;
    reason?: string;
    potentialSavings?: number;
    initialPlan?: 'free' | 'pass';
  }>({ isOpen: false });

  const [applyCredits, setApplyCredits] = useState(true);
  const [applyRoxaPassPerk, setApplyRoxaPassPerk] = useState(true);
  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    try {
      const payload: PersistedState = { member, customBowls, bag, orders };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [member, customBowls, bag, orders]);

  const selectedStore =
    STORE_LOCATIONS.find((s) => s.id === storeId) ?? STORE_LOCATIONS[0];
  const selectedSlot =
    PREORDER_SLOTS.find((s) => s.id === slotId) ?? PREORDER_SLOTS[0];

  const bagCount = bag.reduce((sum, item) => sum + item.quantity, 0);
  const bagTotal = bag.reduce(
    (sum, item) =>
      sum + (member.isSignedUp ? item.memberUnitPrice ?? item.unitPrice : item.unitPrice) * item.quantity,
    0
  );

  const flashAdded = (id: string) => {
    setRecentlyAddedId(id);
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === id ? null : curr));
    }, 1500);
  };

  const openJoinSheet = (
    reason?: string,
    potentialSavings = 0,
    initialPlan: 'free' | 'pass' = 'free'
  ) => {
    setJoinSheetState({ isOpen: true, reason, potentialSavings, initialPlan });
  };

  const handleCompleteSignup = (payload: {
    name: string;
    email: string;
    phone: string;
    joinRoxaPass: boolean;
    favoriteStoreId?: string;
  }) => {
    const claimedGuestOrderPoints = activeOrder ? activeOrder.pointsEarned : 0;
    const claimedStamp = activeOrder ? 1 : 0;
    const claimedBowls = activeOrder
      ? activeOrder.items.reduce((sum, i) => sum + i.quantity, 0)
      : 0;

    if (payload.favoriteStoreId) {
      setStoreId(payload.favoriteStoreId);
    }

    setMember((prev) => ({
      ...prev,
      isSignedUp: true,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      tier: 'Seed',
      memberSince: 'Today',
      tasteArchetype:
        customBowls.length > 0
          ? computeTasteArchetype(customBowls[0])
          : 'New Ritual Member',
      points: prev.points + claimedGuestOrderPoints,
      welcomeCredit: 3.0,
      streakWeeks: Math.max(prev.streakWeeks, claimedStamp > 0 ? 1 : 0),
      stampCount: Math.min(5, prev.stampCount + claimedStamp),
      totalBowlsOrdered: prev.totalBowlsOrdered + claimedBowls,
      isRoxaPass: payload.joinRoxaPass || prev.isRoxaPass,
      roxaPassFreeBowlAvailable: true,
      favoriteStoreId: payload.favoriteStoreId || prev.favoriteStoreId,
    }));
    setApplyCredits(true);
  };

  const addCartItem = (newItem: Omit<CartItem, 'id'> & { id?: string }) => {
    setActiveOrder(null);
    setBag((prev) => {
      const matchIndex = prev.findIndex(
        (existing) =>
          existing.kind === newItem.kind &&
          existing.name === newItem.name &&
          existing.sizeId === newItem.sizeId &&
          existing.baseId === newItem.baseId &&
          (existing.notes ?? '') === (newItem.notes ?? '')
      );
      if (matchIndex >= 0) {
        return prev.map((item, idx) =>
          idx === matchIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [
        ...prev,
        {
          ...newItem,
          id: newItem.id || `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        },
      ];
    });
  };

  const handleQuickAddMenuItem = (item: MenuItem) => {
    const baseName =
      BASE_OPTIONS.find((b) => b.id === item.defaultBaseId)?.name ?? 'Wild Pará Pure Açai';
    addCartItem({
      kind: 'menu',
      menuItemId: item.id,
      name: item.name,
      subtitle: item.category === 'bundle' ? item.subtitle : `Regular · ${baseName}`,
      sizeId: 'regular',
      baseId: item.defaultBaseId,
      image: item.image,
      unitPrice: item.price,
      memberUnitPrice: item.memberPrice,
      quantity: 1,
    });
    flashAdded(item.id);
  };

  const handleAddDetailedMenuItem = (payload: {
    item: MenuItem;
    sizeId: BowlSizeId;
    baseId: string;
    quantity: number;
    unitPrice: number;
    memberUnitPrice: number;
    notes: string;
  }) => {
    const baseName =
      BASE_OPTIONS.find((b) => b.id === payload.baseId)?.name ?? 'Wild Pará Pure Açai';
    const sizeLabel = payload.sizeId === 'large' ? 'Generous' : 'Regular';
    addCartItem({
      kind: 'menu',
      menuItemId: payload.item.id,
      name: payload.item.name,
      subtitle:
        payload.item.category === 'bundle'
          ? payload.item.subtitle
          : `${sizeLabel} · ${baseName}`,
      sizeId: payload.sizeId,
      baseId: payload.baseId,
      image: payload.item.image,
      unitPrice: payload.unitPrice,
      memberUnitPrice: payload.memberUnitPrice,
      quantity: payload.quantity,
      notes: payload.notes || undefined,
    });
    flashAdded(payload.item.id);
    setIsCartOpen(true);
  };

  const handleQuickAddCustomBowl = (bowl: CustomBowl) => {
    const baseName = BASE_OPTIONS.find((b) => b.id === bowl.baseId)?.name ?? 'Custom Açai';
    const sizeLabel = bowl.sizeId === 'large' ? 'Generous' : 'Regular';
    addCartItem({
      kind: 'custom',
      customBowl: bowl,
      name: bowl.name,
      subtitle: `${sizeLabel} · ${baseName} · ${bowl.moodLabel}`,
      sizeId: bowl.sizeId,
      baseId: bowl.baseId,
      image: '/src/assets/images/acai_hero_signature_1795158013303.jpg',
      unitPrice: bowl.unitPrice,
      memberUnitPrice: Number((bowl.unitPrice * 0.9).toFixed(2)),
      quantity: 1,
    });
    flashAdded(bowl.id);
  };

  const handleSaveAndAddCustomBowl = (bowl: CustomBowl, shouldSaveIdentity: boolean) => {
    if (shouldSaveIdentity) {
      setCustomBowls((prev) => [bowl, ...prev.slice(0, 5)]);
      const nextArchetype = computeTasteArchetype(bowl);
      setMember((prev) => ({ ...prev, tasteArchetype: nextArchetype }));
    }
    handleQuickAddCustomBowl(bowl);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setBag((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setBag((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddGreenJuiceAddon = () => {
    addCartItem({
      id: 'addon-green-juice',
      kind: 'menu',
      name: 'Cold-Pressed Green Juice (250ml)',
      subtitle: 'Bundle Pairing · Kale, Fuji Apple & Ginger',
      sizeId: 'regular',
      baseId: 'para-velvet',
      image: '/src/assets/images/acai_bundle_duo_1795158013248.jpg',
      unitPrice: 4.5,
      memberUnitPrice: 4.5,
      quantity: 1,
    });
  };

  const handlePlaceOrder = (payload: {
    cupNote: string;
    paymentMethod: string;
    subtotal: number;
    pointsDiscount: number;
    passDiscount: number;
    deliveryFee: number;
    total: number;
  }): OrderRecord => {
    const orderNumber = Math.floor(4000 + Math.random() * 5900);
    const baristas = ['Lucas', 'Sofia', 'Mateo', 'Camila'];
    const chosenBarista = baristas[orderNumber % baristas.length];
    const pointsEarned = Math.max(10, Math.round(payload.total * 2.5));
    const bowlUnits = bag.reduce((s, i) => s + i.quantity, 0);

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderCode: `RX-${orderNumber}`,
      fulfillmentMode,
      storeName: fulfillmentMode === 'delivery' ? 'Insulated Courier' : selectedStore.name,
      locationDetail:
        fulfillmentMode === 'delivery'
          ? deliveryAddress
          : fulfillmentMode === 'dine-in'
            ? dineInPreference
            : selectedStore.pickupSpot,
      scheduledSlot: selectedSlot.label,
      cupNote: payload.cupNote,
      baristaName: chosenBarista,
      batchNumber: 14,
      items: [...bag],
      subtotal: payload.subtotal,
      bundleSavings: 0,
      pointsDiscount: payload.pointsDiscount,
      passDiscount: payload.passDiscount,
      deliveryFee: payload.deliveryFee,
      total: payload.total,
      pointsEarned,
      createdAt: 'Just now',
      statusStage: 1,
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (member.isSignedUp) {
      setMember((prev) => {
        const welcomeUsed = Math.min(prev.welcomeCredit, payload.pointsDiscount);
        const remainingDiscountForPoints = Math.max(0, payload.pointsDiscount - welcomeUsed);
        const pointsSpent = Math.round(remainingDiscountForPoints * 20);
        const nextPoints = Math.max(0, prev.points - pointsSpent) + pointsEarned;
        const nextStamps = prev.stampCount + 1 > 5 ? 1 : prev.stampCount + 1;
        const nextBowlsTotal = prev.totalBowlsOrdered + bowlUnits;
        const nextTier =
          nextBowlsTotal >= 20 ? 'Crown' : nextBowlsTotal >= 10 ? 'Harvest' : 'Seed';
        return {
          ...prev,
          welcomeCredit: Number(Math.max(0, prev.welcomeCredit - welcomeUsed).toFixed(2)),
          points: nextPoints,
          streakWeeks: Math.max(1, prev.streakWeeks),
          stampCount: nextStamps,
          totalBowlsOrdered: nextBowlsTotal,
          tier: nextTier,
          roxaPassFreeBowlAvailable:
            payload.passDiscount > 0 ? false : prev.roxaPassFreeBowlAvailable,
        };
      });
    }

    setBag([]);
    setActiveOrder(newOrder);
    return newOrder;
  };

  const handleAdvanceOrderStage = () => {
    setActiveOrder((prev) => {
      if (!prev || prev.statusStage >= 3) return prev;
      const nextStage = (prev.statusStage + 1) as 0 | 1 | 2 | 3;
      return { ...prev, statusStage: nextStage };
    });
  };

  const handleJumpToBundles = () => {
    setIsCartOpen(false);
    setMenuFilter('bundle');
    setActiveTab('order');
    setTimeout(() => {
      document.getElementById('menu-catalog')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const handleReorderPastOrder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      addCartItem({
        kind: item.kind,
        menuItemId: item.menuItemId,
        customBowl: item.customBowl,
        name: item.name,
        subtitle: item.subtitle,
        sizeId: item.sizeId,
        baseId: item.baseId,
        image: item.image,
        unitPrice: item.unitPrice,
        memberUnitPrice: item.memberUnitPrice,
        quantity: item.quantity,
      });
    });
    setIsCartOpen(true);
  };

  const handleResetGuestDemo = () => {
    setMember(INITIAL_MEMBER);
    setCustomBowls(INITIAL_CUSTOM_BOWLS);
    setOrders(INITIAL_ORDERS);
    setActiveOrder(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1C181F]">
      <TopBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setIsCartOpen(false);
          setActiveTab(tab);
        }}
        onJumpToBundles={handleJumpToBundles}
        onOpenCart={() => setIsCartOpen(true)}
        bagCount={bagCount}
        bagTotal={bagTotal}
        fulfillmentMode={fulfillmentMode}
        selectedSlotLabel={selectedSlot.label}
        onOpenFulfillment={() => setIsFulfillmentOpen(true)}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-24 lg:pb-12">
        {activeTab === 'order' && (
          <HomeOrderView
            member={member}
            bag={bag}
            activeOrder={activeOrder}
            fulfillmentMode={fulfillmentMode}
            selectedStore={selectedStore}
            selectedSlot={selectedSlot}
            deliveryAddress={deliveryAddress}
            dineInPreference={dineInPreference}
            menuFilter={menuFilter}
            onChangeFilter={setMenuFilter}
            onChangeModeQuick={(nextMode) => setFulfillmentMode(nextMode)}
            onOpenFulfillment={() => setIsFulfillmentOpen(true)}
            onSelectMenuItem={(item) => setSelectedMenuItem(item)}
            onQuickAddMenuItem={handleQuickAddMenuItem}
            onUpdateQty={handleUpdateQty}
            onOpenCart={() => setIsCartOpen(true)}
            customBowls={customBowls}
            onQuickAddCustomBowl={handleQuickAddCustomBowl}
            onOpenBuilder={() => setActiveTab('build')}
            onOpenClub={() => setActiveTab('club')}
            onOpenJoinSheet={(reason) => openJoinSheet(reason, 3.0, 'free')}
            recentlyAddedId={recentlyAddedId}
          />
        )}

        {activeTab === 'build' && (
          <BowlBuilderView
            memberName={member.name}
            isMember={member.isSignedUp}
            onSaveAndAdd={handleSaveAndAddCustomBowl}
            onPromptJoinToSave={(bowlName) =>
              openJoinSheet(
                `Save "${bowlName}" to your personal profile & claim $3.00 welcome credit`,
                3.0,
                'free'
              )
            }
          />
        )}

        {activeTab === 'club' && (
          <ClubMembershipView
            member={member}
            orders={orders}
            onCompleteSignup={handleCompleteSignup}
            onUpdateName={(name) => setMember((prev) => ({ ...prev, name }))}
            onToggleRoxaPass={() =>
              setMember((prev) => ({ ...prev, isRoxaPass: !prev.isRoxaPass }))
            }
            onGoToCheckoutWithRedeem={() => {
              setApplyCredits(true);
              setIsCartOpen(true);
            }}
            onReorderOrder={handleReorderPastOrder}
            onResetGuestDemo={handleResetGuestDemo}
          />
        )}
      </main>

      <footer className="hidden lg:block border-t border-stone-200/80 bg-white/60 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-stone-500">
          <span>Belly Belly Good · Wild-harvested Cametá Grade-A Açai</span>
          <span>Dine In · Collect in Store · Insulated Delivery</span>
        </div>
      </footer>

      <BottomNav
        activeTab={activeTab}
        isCartOpen={isCartOpen}
        onSelectTab={(tab) => {
          setIsCartOpen(false);
          setActiveTab(tab);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        bagCount={bagCount}
      />

      {isFulfillmentOpen && (
        <FulfillmentModal
          isOpen={isFulfillmentOpen}
          onClose={() => setIsFulfillmentOpen(false)}
          mode={fulfillmentMode}
          storeId={storeId}
          slotId={slotId}
          deliveryAddress={deliveryAddress}
          dineInPreference={dineInPreference}
          savedAddresses={member.savedAddresses}
          isRoxaPass={member.isRoxaPass}
          onSave={(next) => {
            setFulfillmentMode(next.mode);
            setStoreId(next.storeId);
            setSlotId(next.slotId);
            setDeliveryAddress(next.deliveryAddress);
            setDineInPreference(next.dineInPreference);
          }}
        />
      )}

      <ItemDetailSheet
        key={selectedMenuItem?.id ?? 'closed'}
        item={selectedMenuItem}
        isMember={member.isSignedUp}
        onClose={() => setSelectedMenuItem(null)}
        onOpenJoinSheet={(reason) => openJoinSheet(reason, 3.0, 'free')}
        onAddToBag={handleAddDetailedMenuItem}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        bag={bag}
        member={member}
        fulfillmentMode={fulfillmentMode}
        selectedStore={selectedStore}
        selectedSlot={selectedSlot}
        deliveryAddress={deliveryAddress}
        dineInPreference={dineInPreference}
        applyCredits={applyCredits}
        onToggleApplyCredits={setApplyCredits}
        applyRoxaPassPerk={applyRoxaPassPerk}
        onToggleRoxaPassPerk={setApplyRoxaPassPerk}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onAddGreenJuiceAddon={handleAddGreenJuiceAddon}
        onOpenFulfillment={() => setIsFulfillmentOpen(true)}
        onOpenJoinSheet={openJoinSheet}
        onPlaceOrder={handlePlaceOrder}
        activeOrder={activeOrder}
        onAdvanceOrderStage={handleAdvanceOrderStage}
        onBrowseMenu={() => setActiveTab('order')}
        onOpenBuilder={() => setActiveTab('build')}
      />

      {joinSheetState.isOpen && (
        <MemberJoinSheet
          isOpen={joinSheetState.isOpen}
          onClose={() => setJoinSheetState({ isOpen: false })}
          contextReason={joinSheetState.reason}
          potentialSavings={joinSheetState.potentialSavings}
          initialPlan={joinSheetState.initialPlan}
          onCompleteSignup={handleCompleteSignup}
        />
      )}
    </div>
  );
}
