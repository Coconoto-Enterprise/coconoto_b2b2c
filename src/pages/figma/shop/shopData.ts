/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  COCO-CONNECT SHOP — data for Desktop 41 / 49 / checkout / confirmation
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Hardcoded on purpose, exactly like `MARKET_PRODUCTS` on the home page: the
 *  live vendor marketplace (`/cococonnect`) reads Supabase, but these Figma
 *  frames are a fixed catalogue. Move them into `vendors`/`vendor_products`
 *  once the design is signed off.
 *
 *  Prices are stored as plain naira integers and formatted at render time, so
 *  the cart maths never has to parse a "₦30,000" string back into a number.
 */

export interface ShopProduct {
  id: string;
  /** URL segment for `/shop/product/:slug` */
  slug: string;
  name: string;
  category: string;
  /** Small muted line above the name — "₦ 30 per kg" in the frame. */
  unitPrice: number;
  unit: string;
  /** What the card and the cart actually charge. */
  price: number;
  rating: number;
  reviewCount: number;
  /** Key in `src/pages/figma/images.ts` — empty string renders a placeholder. */
  imageSlot: string;
  description: string;
  features: string[];
  inStock: boolean;
  warranty: string;
}

export interface ShopCategory {
  name: string;
  count: number;
}

/** Sidebar of Desktop 41, in frame order. */
export const SHOP_CATEGORIES: ShopCategory[] = [
  { name: 'Cash crops', count: 467 },
  { name: 'Seeds & Planting Materials', count: 1 },
  { name: 'Fertilizers & Soil Products', count: 403 },
  { name: 'Crop Protection', count: 490 },
  { name: 'Livestock', count: 877 },
  { name: 'Farm Equipment & Machinery', count: 387 },
  { name: 'Irrigation & Water Management', count: 297 },
  { name: 'Fresh Farm Produce', count: 987 },
];

const FEATURES_DEFAULT = [
  'Each Features include:',
  'Freshly harvested and carefully packed',
  'Rich in vitamins, minerals and dietary fibre',
  'Sourced directly from partner farms',
  'No artificial preservatives',
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'broccoli',
    slug: 'broccoli-for-your-stew',
    name: 'Broccoli for your Stew',
    category: 'Cash crops',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.8,
    reviewCount: 10,
    imageSlot: 'shop-product-broccoli',
    description:
      'Fresh, crisp broccoli heads picked at the right moment and packed the same day. Ideal for stews, stir-fries and soups — holds its shape when cooked and keeps its deep green colour.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'red-onions',
    slug: 'red-onions-from-portugal',
    name: 'Red Onions from Portugal',
    category: 'Cash crops',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.6,
    reviewCount: 24,
    imageSlot: 'shop-product-red-onions',
    description:
      'Firm, deep-red bulbs with a clean, sharp finish. Long storage life and consistent sizing make them a dependable kitchen staple for restaurants and homes alike.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'coconut-oil',
    slug: 'coconut-oil-with-herbs',
    name: 'Coconut oil with herbs',
    category: 'Cash crops',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.9,
    reviewCount: 18,
    imageSlot: 'shop-product-coconut-oil',
    description:
      'Cold-pressed coconut oil infused with a hand-picked herb blend. Use it for cooking, for skin, or straight off the spoon — no refining, no additives.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'oat-meal',
    slug: 'oat-meal-for-calm',
    name: 'Oat meal for calm',
    category: 'Cash crops',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.4,
    reviewCount: 7,
    imageSlot: 'shop-product-oat-meal',
    description:
      'Stone-milled wholegrain oats with a soft, creamy finish. A slow-release breakfast that keeps you full through the morning.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'coconut-threads',
    slug: 'threads-from-coconut',
    name: 'Threads from coconut',
    category: 'Cash crops',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.5,
    reviewCount: 12,
    imageSlot: 'shop-product-coconut-threads',
    description:
      'Natural coir fibre, combed and bundled. Strong, biodegradable and ready for rope, matting, geotextiles or craft work.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'charcoal',
    slug: 'charcoal-from-bristle',
    name: 'Charcoal from bristle',
    category: 'Cash crops',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.7,
    reviewCount: 31,
    imageSlot: 'shop-product-charcoal',
    description:
      'Dense, slow-burning charcoal made from coconut shell. Low smoke, high heat and no chemical binders.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'cocopeat',
    slug: 'cocopeat-growing-medium',
    name: 'Cocopeat growing medium',
    category: 'Fertilizers & Soil Products',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.8,
    reviewCount: 44,
    imageSlot: 'shop-product-cocopeat',
    description:
      'Washed, buffered cocopeat that holds up to ten times its weight in water. pH neutral, disease resistant and a straight swap for peat moss.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'palm-oil',
    slug: 'palm-oil-cold-pressed',
    name: 'Palm oil cold pressed',
    category: 'Cash crops',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.6,
    reviewCount: 16,
    imageSlot: 'shop-product-palm-oil',
    description:
      'Unrefined red palm oil, pressed in small batches. Deep colour, full aroma and nothing added.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'tomatoes',
    slug: 'fresh-tomatoes',
    name: 'Fresh tomatoes',
    category: 'Fresh Farm Produce',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.3,
    reviewCount: 9,
    imageSlot: 'shop-product-tomatoes',
    description:
      'Vine-ripened tomatoes graded for size and firmness, packed in ventilated crates so they arrive without bruising.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'pepper',
    slug: 'scotch-bonnet-pepper',
    name: 'Scotch bonnet pepper',
    category: 'Fresh Farm Produce',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.9,
    reviewCount: 21,
    imageSlot: 'shop-product-pepper',
    description:
      'Bright, fruity heat — the backbone of a proper stew. Hand-sorted and packed fresh.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'honey',
    slug: 'raw-honey',
    name: 'Raw honey',
    category: 'Fresh Farm Produce',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.8,
    reviewCount: 14,
    imageSlot: 'shop-product-honey',
    description:
      'Unfiltered, unheated honey straight from the hives. Crystallises naturally — that is how you know it is raw.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
  {
    id: 'briquettes',
    slug: 'coconut-shell-briquettes',
    name: 'Coconut shell briquettes',
    category: 'Fertilizers & Soil Products',
    unitPrice: 30,
    unit: 'kg',
    price: 30000,
    rating: 4.5,
    reviewCount: 6,
    imageSlot: 'shop-product-briquettes',
    description:
      'Compressed coconut-shell briquettes for clean, long-burning heat. A drop-in replacement for firewood.',
    features: FEATURES_DEFAULT,
    inStock: true,
    warranty: '1 Month Warranty',
  },
];

/** Two reviews, matching the pair drawn in Desktop 49. */
export const SHOP_REVIEWS = [
  {
    name: 'Larry Lawson',
    avatarSlot: 'shop-review-avatar-1',
    rating: 5,
    text: 'I wish I had known these sooner. Really good quality produce, and it arrived earlier than the estimate. Will order again.',
  },
  {
    name: 'Larry Lawson',
    avatarSlot: 'shop-review-avatar-2',
    rating: 5,
    text: 'I wish I had known these sooner. Really good quality produce, and it arrived earlier than the estimate. Will order again.',
  },
];

/** ₦30,000 — always with thousands separators, never a decimal. */
export const naira = (amount: number) => `₦ ${amount.toLocaleString('en-NG')}`;

/** Flat delivery fee used by both the order panel and the checkout summary. */
export const DELIVERY_FEE = 3000;

export const findProduct = (slug: string) =>
  SHOP_PRODUCTS.find((p) => p.slug === slug) ?? SHOP_PRODUCTS[0];

export const similarProducts = (product: ShopProduct, count = 3) =>
  SHOP_PRODUCTS.filter((p) => p.id !== product.id).slice(0, count);
