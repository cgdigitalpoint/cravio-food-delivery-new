// ─── Home Screen Dummy Data ────────────────────────────────────────────────────
// All data is static. No backend, no API, no auth.

// ─── Categories ───────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all',        name: 'All',         emoji: '🍽️', color: '#FF6B00' },
  { id: 'pizza',      name: 'Pizza',       emoji: '🍕', color: '#EF4444' },
  { id: 'burger',     name: 'Burger',      emoji: '🍔', color: '#F59E0B' },
  { id: 'biryani',    name: 'Biryani',     emoji: '🍛', color: '#8B5CF6' },
  { id: 'chinese',    name: 'Chinese',     emoji: '🍜', color: '#EC4899' },
  { id: 'south',      name: 'South Indian',emoji: '🥘', color: '#10B981' },
  { id: 'desserts',   name: 'Desserts',    emoji: '🧁', color: '#F97316' },
  { id: 'drinks',     name: 'Drinks',      emoji: '☕', color: '#6366F1' },
  { id: 'healthy',    name: 'Healthy',     emoji: '🥗', color: '#22C55E' },
];

// ─── Offer Banners ────────────────────────────────────────────────────────────
export interface OfferBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  code: string;
  emoji: string;
  gradient: [string, string, string];
}

export const BANNERS: OfferBanner[] = [
  {
    id: 'b1',
    title: '50% OFF',
    subtitle: 'On your first order',
    cta: 'Order Now',
    code: 'FIRST50',
    emoji: '🎉',
    gradient: ['#FF5E00', '#FF6B00', '#FF8C38'],
  },
  {
    id: 'b2',
    title: 'Free Delivery',
    subtitle: 'On all orders today only',
    cta: 'Explore',
    code: 'FREEDEL',
    emoji: '🚀',
    gradient: ['#15803D', '#16A34A', '#22C55E'],
  },
  {
    id: 'b3',
    title: 'Buy 1 Get 1',
    subtitle: 'On 50+ restaurants',
    cta: 'Claim Now',
    code: 'BOGO100',
    emoji: '🎁',
    gradient: ['#3730A3', '#4338CA', '#6366F1'],
  },
];

// ─── Restaurants ──────────────────────────────────────────────────────────────
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  imageUri?: string;
  offerText?: string;
  isNew?: boolean;
  isFavorite?: boolean;
  isOpen: boolean;
  distance: string;
  category: string;
}

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Burger Republic',
    cuisine: 'American · Burgers · Fries',
    rating: 4.7,
    deliveryTime: 25,
    deliveryFee: 0,
    imageUri: 'https://picsum.photos/seed/burger-republic/400/220',
    offerText: '20% OFF',
    isOpen: true,
    distance: '1.2 km',
    category: 'burger',
  },
  {
    id: 'r2',
    name: 'Pizza Palace',
    cuisine: 'Italian · Pizza · Pasta',
    rating: 4.5,
    deliveryTime: 30,
    deliveryFee: 0,
    imageUri: 'https://picsum.photos/seed/pizza-palace/400/220',
    offerText: 'BOGO',
    isOpen: true,
    distance: '2.0 km',
    category: 'pizza',
  },
  {
    id: 'r3',
    name: 'Sushi Garden',
    cuisine: 'Japanese · Sushi · Ramen',
    rating: 4.9,
    deliveryTime: 40,
    deliveryFee: 2,
    imageUri: 'https://picsum.photos/seed/sushi-garden/400/220',
    isOpen: true,
    distance: '3.1 km',
    category: 'chinese',
  },
  {
    id: 'r4',
    name: 'Spice Route',
    cuisine: 'Indian · Biryani · Curry',
    rating: 4.3,
    deliveryTime: 20,
    deliveryFee: 0,
    imageUri: 'https://picsum.photos/seed/spice-route/400/220',
    offerText: '30% OFF',
    isOpen: true,
    distance: '0.8 km',
    category: 'biryani',
  },
  {
    id: 'r5',
    name: 'Noodle House',
    cuisine: 'Chinese · Noodles · Dim Sum',
    rating: 4.6,
    deliveryTime: 25,
    deliveryFee: 1,
    imageUri: 'https://picsum.photos/seed/noodle-house/400/220',
    isNew: true,
    isOpen: true,
    distance: '1.5 km',
    category: 'chinese',
  },
  {
    id: 'r6',
    name: 'Green Bowl',
    cuisine: 'Healthy · Salads · Bowls',
    rating: 4.8,
    deliveryTime: 20,
    deliveryFee: 0,
    imageUri: 'https://picsum.photos/seed/green-bowl/400/220',
    isNew: true,
    isOpen: true,
    distance: '1.8 km',
    category: 'healthy',
  },
  {
    id: 'r7',
    name: 'Sweet Spot',
    cuisine: 'Desserts · Cakes · Ice Cream',
    rating: 4.4,
    deliveryTime: 15,
    deliveryFee: 0,
    imageUri: 'https://picsum.photos/seed/sweet-spot/400/220',
    isOpen: true,
    distance: '0.5 km',
    category: 'desserts',
  },
  {
    id: 'r8',
    name: 'Brew & Bites',
    cuisine: 'Café · Coffee · Snacks',
    rating: 4.2,
    deliveryTime: 20,
    deliveryFee: 0,
    imageUri: 'https://picsum.photos/seed/brew-bites/400/220',
    isOpen: false,
    distance: '2.3 km',
    category: 'drinks',
  },
];

// ─── Food Items ───────────────────────────────────────────────────────────────
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUri?: string;
  isVeg: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  restaurantName: string;
}

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f1',
    name: 'Margherita Pizza',
    description: 'Classic tomato, mozzarella & fresh basil',
    price: 12.99,
    imageUri: 'https://picsum.photos/seed/margherita/200/200',
    isVeg: true,
    isPopular: true,
    restaurantName: 'Pizza Palace',
  },
  {
    id: 'f2',
    name: 'Classic Cheeseburger',
    description: 'Beef patty, cheddar, lettuce & secret sauce',
    price: 10.99,
    imageUri: 'https://picsum.photos/seed/cheeseburger/200/200',
    isVeg: false,
    isPopular: true,
    restaurantName: 'Burger Republic',
  },
  {
    id: 'f3',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with spiced chicken',
    price: 14.99,
    imageUri: 'https://picsum.photos/seed/biryani/200/200',
    isVeg: false,
    isPopular: true,
    restaurantName: 'Spice Route',
  },
  {
    id: 'f4',
    name: 'Veg Fried Rice',
    description: 'Wok-tossed rice with seasonal vegetables',
    price: 9.99,
    imageUri: 'https://picsum.photos/seed/friedrice/200/200',
    isVeg: true,
    restaurantName: 'Noodle House',
  },
  {
    id: 'f5',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten centre',
    price: 6.99,
    imageUri: 'https://picsum.photos/seed/lavacake/200/200',
    isVeg: true,
    isPopular: true,
    restaurantName: 'Sweet Spot',
  },
  {
    id: 'f6',
    name: 'Green Power Bowl',
    description: 'Quinoa, avocado, greens & tahini dressing',
    price: 11.99,
    imageUri: 'https://picsum.photos/seed/greenbowl/200/200',
    isVeg: true,
    isNew: true,
    restaurantName: 'Green Bowl',
  },
];

// ─── Curated Subsets ──────────────────────────────────────────────────────────
export const FEATURED_RESTAURANTS = RESTAURANTS.filter(r =>
  ['r1', 'r2', 'r4', 'r6'].includes(r.id) && r.isOpen,
);

export const FAST_DELIVERY_RESTAURANTS = RESTAURANTS.filter(
  r => r.deliveryTime <= 25 && r.isOpen,
);

export const TOP_RATED_RESTAURANTS = RESTAURANTS.filter(
  r => r.rating >= 4.5 && r.isOpen,
);

export const POPULAR_RESTAURANTS = RESTAURANTS.filter(r => r.isOpen).slice(0, 4);
