export type FulfillmentMode = 'dine-in' | 'collect' | 'delivery';

export type AppTab = 'order' | 'build' | 'club' | 'bag';

export type BowlSizeId = 'regular' | 'large';

export interface StoreLocation {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  prepMinutes: number;
  dineInSeatsAvailable: number;
  pickupSpot: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  sublabel: string;
  isUrgent?: boolean;
}

export interface BowlSize {
  id: BowlSizeId;
  label: string;
  weightGrams: number;
  priceDelta: number;
  kcalDelta: number;
}

export interface BaseOption {
  id: string;
  name: string;
  originNote: string;
  priceDelta: number;
  kcal: number;
  sugarNote: string;
}

export interface ToppingOption {
  id: string;
  name: string;
  category: 'fruit' | 'crunch' | 'drizzle' | 'boost';
  price: number;
  kcal: number;
  flavorTag: string;
}

export interface MenuItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'signature' | 'bundle';
  description: string;
  harvestOrigin: string;
  flavorNotes: string[];
  price: number;
  memberPrice: number;
  compareAtPrice?: number;
  calories: number;
  prepMinutes: number;
  image: string;
  defaultBaseId: string;
  includedItems?: string[];
  allergens: string[];
  limitedBatchLeft?: number;
}

export interface CustomBowl {
  id: string;
  name: string;
  moodLabel: string;
  sizeId: BowlSizeId;
  baseId: string;
  fruitIds: string[];
  crunchIds: string[];
  drizzleIds: string[];
  boostIds: string[];
  unitPrice: number;
  totalKcal: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  kind: 'menu' | 'custom';
  menuItemId?: string;
  customBowl?: CustomBowl;
  name: string;
  subtitle: string;
  sizeId: BowlSizeId;
  baseId: string;
  image?: string;
  unitPrice: number;
  memberUnitPrice?: number;
  quantity: number;
  notes?: string;
}

export interface MemberProfile {
  isSignedUp: boolean;
  name: string;
  email: string;
  phone: string;
  tasteArchetype: string;
  tier: 'Guest' | 'Seed' | 'Harvest' | 'Crown';
  memberSince: string;
  points: number;
  welcomeCredit: number;
  expiringPoints: number;
  expiringDaysLeft: number;
  streakWeeks: number;
  streakDaysLeft: number;
  stampCount: number;
  isRoxaPass: boolean;
  roxaPassFreeBowlAvailable: boolean;
  totalBowlsOrdered: number;
  favoriteStoreId: string;
  savedAddresses: string[];
}

export interface OrderRecord {
  id: string;
  orderCode: string;
  fulfillmentMode: FulfillmentMode;
  storeName: string;
  locationDetail: string;
  scheduledSlot: string;
  cupNote: string;
  baristaName: string;
  batchNumber: number;
  items: CartItem[];
  subtotal: number;
  bundleSavings: number;
  pointsDiscount: number;
  passDiscount: number;
  deliveryFee: number;
  total: number;
  pointsEarned: number;
  createdAt: string;
  statusStage: 0 | 1 | 2 | 3;
}
