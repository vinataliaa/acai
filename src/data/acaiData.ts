import {
  BaseOption,
  BowlSize,
  CustomBowl,
  MemberProfile,
  MenuItem,
  OrderRecord,
  StoreLocation,
  TimeSlot,
  ToppingOption,
} from '../types/acai';

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'hayes',
    name: 'Roxa Hayes Valley',
    neighborhood: 'Octavia & Linden',
    address: '418 Octavia St, San Francisco',
    prepMinutes: 8,
    dineInSeatsAvailable: 9,
    pickupSpot: 'Window Shelf B · Left of Espresso Bar',
  },
  {
    id: 'marina',
    name: 'Roxa Marina Green',
    neighborhood: 'Chestnut St',
    address: '2140 Chestnut St, San Francisco',
    prepMinutes: 10,
    dineInSeatsAvailable: 14,
    pickupSpot: 'Express Chilled Cubbies #1–#8',
  },
  {
    id: 'mission',
    name: 'Roxa Valencia Bar',
    neighborhood: 'Mission District',
    address: '892 Valencia St, San Francisco',
    prepMinutes: 9,
    dineInSeatsAvailable: 6,
    pickupSpot: 'Counter 2 · Skip-the-Line Pass',
  },
];

export const PREORDER_SLOTS: TimeSlot[] = [
  { id: 'asap', label: 'Ready in 12 min', sublabel: 'Express cold blend', isUrgent: true },
  { id: 'slot-1', label: 'In 30 min', sublabel: 'Chilled to order' },
  { id: 'slot-2', label: 'In 1 hour', sublabel: 'Fresh batch #16' },
  { id: 'slot-3', label: 'Tomorrow · 8:30 AM', sublabel: 'Morning ritual' },
  { id: 'slot-4', label: 'Tomorrow · 12:15 PM', sublabel: 'Midday break' },
];

export const BOWL_SIZES: BowlSize[] = [
  { id: 'regular', label: 'Regular (340g)', weightGrams: 340, priceDelta: 0, kcalDelta: 0 },
  { id: 'large', label: 'Generous (480g)', weightGrams: 480, priceDelta: 3.5, kcalDelta: 145 },
];

export const BASE_OPTIONS: BaseOption[] = [
  {
    id: 'para-velvet',
    name: 'Wild Pará Pure Açai',
    originNote: 'Single-estate Cametá pulp · stone-blended at -4°C',
    priceDelta: 0,
    kcal: 210,
    sugarNote: 'Low organic agave',
  },
  {
    id: 'unsweetened',
    name: 'Unsweetened Amazonian',
    originNote: '100% pure wild berry · zero added sugar',
    priceDelta: 0.75,
    kcal: 165,
    sugarNote: '0g added sugar',
  },
  {
    id: 'cacao-blend',
    name: 'Raw Cacao & Açai',
    originNote: 'Heirloom Criollo cacao · creamy dark finish',
    priceDelta: 1.0,
    kcal: 245,
    sugarNote: 'Lightly sweetened',
  },
  {
    id: 'pitaya-swirl',
    name: 'Açai & Pink Pitaya Swirl',
    originNote: 'Bright dragonfruit contrast · high vitamin C',
    priceDelta: 1.0,
    kcal: 195,
    sugarNote: 'Naturally bright',
  },
];

export const TOPPING_OPTIONS: ToppingOption[] = [
  // Fruits
  { id: 'strawberry', name: 'Organic Strawberries', category: 'fruit', price: 1.25, kcal: 24, flavorTag: 'Bright' },
  { id: 'banana', name: 'Caramelized Banana Coins', category: 'fruit', price: 0.95, kcal: 55, flavorTag: 'Silky' },
  { id: 'blueberry', name: 'Wild Blueberries', category: 'fruit', price: 1.5, kcal: 28, flavorTag: 'Tart' },
  { id: 'mango', name: 'Ataulfo Mango Cubes', category: 'fruit', price: 1.5, kcal: 42, flavorTag: 'Lush' },
  { id: 'fig', name: 'Black Mission Figs', category: 'fruit', price: 1.95, kcal: 38, flavorTag: 'Honeyed' },
  { id: 'passionfruit', name: 'Fresh Passionfruit Pulp', category: 'fruit', price: 1.65, kcal: 30, flavorTag: 'Zesty' },
  // Crunch
  { id: 'oat-granola', name: 'Maple Hemp Oat Granola', category: 'crunch', price: 1.25, kcal: 95, flavorTag: 'Toasty' },
  { id: 'cacao-nibs', name: 'Roasted Cacao Nibs', category: 'crunch', price: 1.4, kcal: 60, flavorTag: 'Bitter-Rich' },
  { id: 'coconut-ribbon', name: 'Toasted Coconut Ribbons', category: 'crunch', price: 1.1, kcal: 68, flavorTag: 'Crisp' },
  { id: 'hazelnut', name: 'Crushed Piedmont Hazelnuts', category: 'crunch', price: 1.75, kcal: 88, flavorTag: 'Nutty' },
  // Drizzles
  { id: 'almond-butter', name: 'Stone-Ground Almond Butter', category: 'drizzle', price: 1.75, kcal: 98, flavorTag: 'Velvety' },
  { id: 'raw-honey', name: 'Wildflower Raw Honey', category: 'drizzle', price: 1.0, kcal: 45, flavorTag: 'Floral' },
  { id: 'cupuacu-cream', name: 'Small-Batch Cupuaçu Cream', category: 'drizzle', price: 1.95, kcal: 72, flavorTag: 'Rare Citrus' },
  // Boosts
  { id: 'chia', name: 'Black Chia Seeds', category: 'boost', price: 0.85, kcal: 35, flavorTag: 'Omega-3' },
  { id: 'bee-pollen', name: 'Golden Bee Pollen', category: 'boost', price: 1.45, kcal: 22, flavorTag: 'Immunity' },
  { id: 'whey-isolate', name: 'Grass-Fed Vanilla Protein', category: 'boost', price: 2.5, kcal: 110, flavorTag: '24g Protein' },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'para-signature',
    name: 'The Pará Velvet',
    subtitle: 'Signature Bowl · 385 kcal · Wild Cametá Harvest',
    category: 'signature',
    description:
      'Our benchmark bowl. Wild-harvested Grade-A Pará açai spun cold to a thick, spoon-standing sorbet, layered with wild blueberries, sliced banana, toasted coconut ribbons, cacao nibs, and warm wildflower honey.',
    harvestOrigin: 'Cametá River Basin, Pará, Brazil · Fair-Wild Certified',
    flavorNotes: ['Velvety Berry', 'Crisp Coconut', 'Dark Cacao'],
    price: 13.5,
    memberPrice: 12.15,
    calories: 385,
    prepMinutes: 6,
    image: '/src/assets/images/acai_hero_signature_1795158013303.jpg',
    defaultBaseId: 'para-velvet',
    allergens: ['Tree Nuts (Coconut)'],
    limitedBatchLeft: 5,
  },
  {
    id: 'rio-classic',
    name: 'Ipanema Morning Classic',
    subtitle: 'Signature Bowl · 360 kcal · Crowd Favorite',
    category: 'signature',
    description:
      'Pure Rio street-stand soul elevated with local organic strawberries, sweet banana coins, house-baked maple hemp granola, and soaked black chia seeds.',
    harvestOrigin: 'Marajó Island Wild Pulp · Cold-Pressed Morning Batch',
    flavorNotes: ['Fresh Berry', 'Toasted Oat', 'Clean Finish'],
    price: 12.75,
    memberPrice: 11.45,
    calories: 360,
    prepMinutes: 6,
    image: '/src/assets/images/acai_bowl_classic_1795158013424.jpg',
    defaultBaseId: 'para-velvet',
    allergens: ['Oats'],
  },
  {
    id: 'cacao-almond',
    name: 'Noir Cacao & Fig',
    subtitle: 'Signature Bowl · 440 kcal · High-Antioxidant',
    category: 'signature',
    description:
      'Heirloom Criollo cacao blended directly into wild açai, crowned with halved Black Mission figs, crushed roasted Piedmont hazelnuts, cacao nibs, and warm almond butter drizzle.',
    harvestOrigin: 'Single-Origin Bahia Cacao + Wild Pará Açai',
    flavorNotes: ['Roasted Hazelnut', 'Dark Fig', 'Satin Nut Butter'],
    price: 14.9,
    memberPrice: 13.4,
    calories: 440,
    prepMinutes: 7,
    image: '/src/assets/images/acai_bowl_cacao_1795158013668.jpg',
    defaultBaseId: 'cacao-blend',
    allergens: ['Tree Nuts (Almond, Hazelnut)'],
    limitedBatchLeft: 3,
  },
  {
    id: 'tropical-passion',
    name: 'Sol & Maracujá Swirl',
    subtitle: 'Signature Bowl · 345 kcal · Bright & Tart',
    category: 'signature',
    description:
      'A sunlit ribbon of fresh passionfruit curd swirled through cold-spun açai, topped with Ataulfo mango cubes, sliced kiwi, and crisp toasted coconut chips.',
    harvestOrigin: 'Pará Açai + Costa Rican Passionfruit',
    flavorNotes: ['Zesty Maracujá', 'Ripe Mango', 'Crisp Coconut'],
    price: 13.9,
    memberPrice: 12.5,
    calories: 345,
    prepMinutes: 6,
    image: '/src/assets/images/acai_bowl_tropical_1795158013093.jpg',
    defaultBaseId: 'pitaya-swirl',
    allergens: ['Tree Nuts (Coconut)'],
  },
  {
    id: 'bundle-morning-duo',
    name: 'Morning Ritual Duo',
    subtitle: 'Bundle · 2 Regular Bowls + 2 Cold-Pressed Greens',
    category: 'bundle',
    description:
      'Designed for two or an active morning share. Pick up or dine in together with two full signature bowls paired with two 250ml bottles of kale, apple, and ginger cold-pressed juice.',
    harvestOrigin: 'Packed in insulated craft carrier · Stays frozen 45 min',
    flavorNotes: ['Save $5.50 vs. Solo', 'Zero Wait Prep'],
    price: 33.5,
    memberPrice: 29.5,
    compareAtPrice: 39.0,
    calories: 460,
    prepMinutes: 9,
    image: '/src/assets/images/acai_bundle_duo_1795158013248.jpg',
    defaultBaseId: 'para-velvet',
    includedItems: [
      '1× The Pará Velvet Bowl',
      '1× Ipanema Morning Classic Bowl',
      '2× Cold-Pressed Green Juice (250ml)',
    ],
    allergens: ['Tree Nuts (Coconut)', 'Oats'],
  },
  {
    id: 'bundle-team-box',
    name: 'Studio Four-Bowl Pack',
    subtitle: 'Bundle · 4 Signature Bowls · Ideal for Office & Training',
    category: 'bundle',
    description:
      'Four handcrafted bowls packed side-by-side in our thermal-lined bamboo crate with wooden spoons and separate crunch cups so every topping stays crisp until the first bite.',
    harvestOrigin: 'Separate crunch jars · Thermal insulated 60 min',
    flavorNotes: ['Save $8.20 vs. Solo', 'Crispy Granola Pack'],
    price: 46.0,
    memberPrice: 40.5,
    compareAtPrice: 54.2,
    calories: 390,
    prepMinutes: 12,
    image: '/src/assets/images/acai_bundle_duo_1795158013248.jpg',
    defaultBaseId: 'para-velvet',
    includedItems: [
      '2× The Pará Velvet Bowl',
      '1× Noir Cacao & Fig Bowl',
      '1× Sol & Maracujá Swirl Bowl',
      '4× Separate Crunch & Drizzle Jars',
    ],
    allergens: ['Tree Nuts', 'Oats'],
  },
];

export const INITIAL_CUSTOM_BOWLS: CustomBowl[] = [];

export const INITIAL_MEMBER: MemberProfile = {
  isSignedUp: false,
  name: '',
  email: '',
  phone: '',
  tasteArchetype: 'Discovering Your Blend',
  tier: 'Guest',
  memberSince: 'Today',
  points: 0,
  welcomeCredit: 3.0,
  expiringPoints: 0,
  expiringDaysLeft: 7,
  streakWeeks: 0,
  streakDaysLeft: 6,
  stampCount: 0,
  isRoxaPass: false,
  roxaPassFreeBowlAvailable: true,
  totalBowlsOrdered: 0,
  favoriteStoreId: 'hayes',
  savedAddresses: ['742 Fell St, Apt 4B, San Francisco', '525 Market St, Floor 12'],
};

export const INITIAL_ORDERS: OrderRecord[] = [];

export function computeTasteArchetype(bowl: Pick<CustomBowl, 'baseId' | 'crunchIds' | 'drizzleIds' | 'boostIds' | 'fruitIds'>): string {
  if (bowl.baseId === 'cacao-blend' || bowl.crunchIds.includes('cacao-nibs')) {
    return 'Cacao Devotee';
  }
  if (bowl.crunchIds.length >= 2) {
    return 'Crunch Architect';
  }
  if (bowl.baseId === 'unsweetened') {
    return 'Amazonian Purist';
  }
  if (bowl.boostIds.length >= 1) {
    return 'Ritual Athlete';
  }
  return 'Tropical Explorer';
}
