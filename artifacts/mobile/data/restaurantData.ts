// ─── Restaurant Menu Data — Phase 5 ──────────────────────────────────────────
// All dummy data. No backend, no Supabase.
// Items are compatible with the MenuItem type used by useCartStore.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RestaurantMenuItem {
  // Core — matches MenuItem from @/types for cart store compatibility
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;          // category id
  tags: string[];
  isAvailable: boolean;
  isPopular: boolean;
  // Display extras
  isVeg: boolean;
  isBestSeller?: boolean;
  isCustomizable?: boolean;
  discount?: number;         // percent off, e.g. 20 => "20% OFF"
  rating: number;
  calories?: number;
  preparationTime?: number;  // minutes
}

export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
}

// ─── All possible categories ──────────────────────────────────────────────────
export const ALL_MENU_CATEGORIES: MenuCategory[] = [
  { id: 'popular',  name: 'Popular',      emoji: '🔥' },
  { id: 'pizza',    name: 'Pizza',        emoji: '🍕' },
  { id: 'burger',   name: 'Burger',       emoji: '🍔' },
  { id: 'starter',  name: 'Starter',      emoji: '🥗' },
  { id: 'main',     name: 'Main Course',  emoji: '🍛' },
  { id: 'chinese',  name: 'Chinese',      emoji: '🍜' },
  { id: 'dessert',  name: 'Dessert',      emoji: '🧁' },
  { id: 'drinks',   name: 'Drinks',       emoji: '🥤' },
];

// ─── Burger Republic (r1) ─────────────────────────────────────────────────────
const MENU_R1: RestaurantMenuItem[] = [
  // Popular
  { id: 'r1_p1', restaurantId: 'r1', category: 'popular', name: 'Classic Cheeseburger', description: 'Juicy beef patty, cheddar cheese, lettuce, tomato & secret sauce on a brioche bun', price: 10.99, imageUrl: 'https://picsum.photos/seed/r1p1/300/300', isVeg: false, isPopular: true, isBestSeller: true, isCustomizable: true, rating: 4.7, tags: ['beef', 'bestseller'], isAvailable: true, calories: 620, preparationTime: 12 },
  { id: 'r1_p2', restaurantId: 'r1', category: 'popular', name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce, crispy bacon, caramelised onions & pickles', price: 13.49, imageUrl: 'https://picsum.photos/seed/r1p2/300/300', isVeg: false, isPopular: true, isBestSeller: true, isCustomizable: true, rating: 4.8, tags: ['beef', 'bbq', 'bacon'], isAvailable: true, calories: 740, preparationTime: 14 },
  { id: 'r1_p3', restaurantId: 'r1', category: 'popular', name: 'Loaded Fries', description: 'Crispy fries with cheese sauce, jalapeños & sour cream', price: 6.99, imageUrl: 'https://picsum.photos/seed/r1p3/300/300', isVeg: true, isPopular: true, rating: 4.5, tags: ['fries', 'snack'], isAvailable: true, calories: 480, preparationTime: 8 },
  { id: 'r1_p4', restaurantId: 'r1', category: 'popular', name: 'Chicken Wings (6 pcs)', description: 'Choose from Buffalo, BBQ, Honey Garlic or Sweet Chilli', price: 8.99, imageUrl: 'https://picsum.photos/seed/r1p4/300/300', isVeg: false, isPopular: true, isCustomizable: true, rating: 4.6, tags: ['chicken', 'spicy'], isAvailable: true, calories: 410, preparationTime: 15 },
  // Burger
  { id: 'r1_b1', restaurantId: 'r1', category: 'burger', name: 'Double Smash Burger', description: 'Two smashed beef patties, American cheese, pickles, onion & mustard', price: 14.99, imageUrl: 'https://picsum.photos/seed/r1b1/300/300', isVeg: false, isPopular: true, isBestSeller: true, isCustomizable: true, rating: 4.9, tags: ['beef', 'double'], isAvailable: true, calories: 860, preparationTime: 15 },
  { id: 'r1_b2', restaurantId: 'r1', category: 'burger', name: 'Veggie Supreme', description: 'Black bean patty, avocado, roasted peppers & chipotle mayo', price: 11.49, imageUrl: 'https://picsum.photos/seed/r1b2/300/300', isVeg: true, isPopular: false, isCustomizable: true, discount: 10, rating: 4.3, tags: ['veg', 'healthy'], isAvailable: true, calories: 540, preparationTime: 12 },
  { id: 'r1_b3', restaurantId: 'r1', category: 'burger', name: 'Crispy Chicken Burger', description: 'Southern fried chicken, coleslaw & pickles on a brioche bun', price: 12.49, imageUrl: 'https://picsum.photos/seed/r1b3/300/300', isVeg: false, isPopular: false, isCustomizable: true, rating: 4.6, tags: ['chicken'], isAvailable: true, calories: 680, preparationTime: 13 },
  { id: 'r1_b4', restaurantId: 'r1', category: 'burger', name: 'Mushroom Swiss Melt', description: 'Sautéed mushrooms, Swiss cheese, garlic aioli on toasted bun', price: 12.99, imageUrl: 'https://picsum.photos/seed/r1b4/300/300', isVeg: true, isPopular: false, rating: 4.4, tags: ['veg', 'mushroom'], isAvailable: true, calories: 590, preparationTime: 12 },
  // Starter
  { id: 'r1_s1', restaurantId: 'r1', category: 'starter', name: 'Onion Rings', description: 'Beer-battered onion rings with sriracha dipping sauce', price: 5.49, imageUrl: 'https://picsum.photos/seed/r1s1/300/300', isVeg: true, isPopular: false, rating: 4.2, tags: ['veg', 'fried'], isAvailable: true, calories: 340, preparationTime: 8 },
  { id: 'r1_s2', restaurantId: 'r1', category: 'starter', name: 'Mozzarella Sticks (6 pcs)', description: 'Golden fried mozzarella with marinara sauce', price: 6.49, imageUrl: 'https://picsum.photos/seed/r1s2/300/300', isVeg: true, isPopular: false, rating: 4.4, tags: ['veg', 'cheese'], isAvailable: true, calories: 390, preparationTime: 10 },
  { id: 'r1_s3', restaurantId: 'r1', category: 'starter', name: 'Coleslaw', description: 'House-made creamy coleslaw with apple & carrot', price: 3.49, imageUrl: 'https://picsum.photos/seed/r1s3/300/300', isVeg: true, isPopular: false, rating: 4.1, tags: ['veg', 'side'], isAvailable: true, calories: 180, preparationTime: 5 },
  // Drinks
  { id: 'r1_d1', restaurantId: 'r1', category: 'drinks', name: 'Classic Milkshake', description: 'Thick & creamy — Chocolate, Vanilla, Strawberry or Oreo', price: 5.99, imageUrl: 'https://picsum.photos/seed/r1d1/300/300', isVeg: true, isPopular: false, isCustomizable: true, rating: 4.5, tags: ['cold', 'sweet'], isAvailable: true, calories: 430, preparationTime: 6 },
  { id: 'r1_d2', restaurantId: 'r1', category: 'drinks', name: 'Craft Lemonade', description: 'Fresh squeezed with mint & a hint of ginger', price: 3.99, imageUrl: 'https://picsum.photos/seed/r1d2/300/300', isVeg: true, isPopular: false, rating: 4.3, tags: ['cold', 'fresh'], isAvailable: true, calories: 120, preparationTime: 4 },
  { id: 'r1_d3', restaurantId: 'r1', category: 'drinks', name: 'Iced Americano', description: 'Double shot espresso over ice, your choice of syrup', price: 4.49, imageUrl: 'https://picsum.photos/seed/r1d3/300/300', isVeg: true, isPopular: false, isCustomizable: true, rating: 4.4, tags: ['coffee', 'cold'], isAvailable: true, calories: 15, preparationTime: 4 },
];

// ─── Pizza Palace (r2) ────────────────────────────────────────────────────────
const MENU_R2: RestaurantMenuItem[] = [
  // Popular
  { id: 'r2_p1', restaurantId: 'r2', category: 'popular', name: 'Margherita Pizza', description: 'San Marzano tomato, fresh mozzarella di bufala & basil', price: 12.99, imageUrl: 'https://picsum.photos/seed/r2p1/300/300', isVeg: true, isPopular: true, isBestSeller: true, rating: 4.8, tags: ['veg', 'classic'], isAvailable: true, calories: 720, preparationTime: 18 },
  { id: 'r2_p2', restaurantId: 'r2', category: 'popular', name: 'Pepperoni Feast', description: 'Double pepperoni, mozzarella, oregano on red sauce', price: 15.49, imageUrl: 'https://picsum.photos/seed/r2p2/300/300', isVeg: false, isPopular: true, isBestSeller: true, isCustomizable: true, rating: 4.7, tags: ['meaty'], isAvailable: true, calories: 860, preparationTime: 20 },
  { id: 'r2_p3', restaurantId: 'r2', category: 'popular', name: 'Garlic Bread with Cheese', description: 'Crispy baguette with garlic butter & melted mozzarella', price: 5.99, imageUrl: 'https://picsum.photos/seed/r2p3/300/300', isVeg: true, isPopular: true, rating: 4.5, tags: ['veg', 'starter'], isAvailable: true, calories: 380, preparationTime: 10 },
  { id: 'r2_p4', restaurantId: 'r2', category: 'popular', name: 'BBQ Chicken Pizza', description: 'Smoky BBQ base, grilled chicken, red onion & jalapeños', price: 16.99, imageUrl: 'https://picsum.photos/seed/r2p4/300/300', isVeg: false, isPopular: true, isBestSeller: true, isCustomizable: true, rating: 4.9, tags: ['chicken', 'spicy'], isAvailable: true, calories: 920, preparationTime: 20 },
  // Pizza
  { id: 'r2_z1', restaurantId: 'r2', category: 'pizza', name: 'Four Cheese Pizza', description: 'Mozzarella, gorgonzola, parmesan & gouda on white sauce', price: 17.49, imageUrl: 'https://picsum.photos/seed/r2z1/300/300', isVeg: true, isPopular: false, isCustomizable: true, rating: 4.6, tags: ['veg', 'cheese'], isAvailable: true, calories: 980, preparationTime: 22 },
  { id: 'r2_z2', restaurantId: 'r2', category: 'pizza', name: 'Veggie Garden', description: 'Bell peppers, olives, spinach, mushrooms & cherry tomatoes', price: 13.99, imageUrl: 'https://picsum.photos/seed/r2z2/300/300', isVeg: true, isPopular: false, discount: 15, rating: 4.4, tags: ['veg', 'healthy'], isAvailable: true, calories: 680, preparationTime: 18 },
  { id: 'r2_z3', restaurantId: 'r2', category: 'pizza', name: 'Meat Lovers', description: 'Pepperoni, sausage, bacon, ham & mozzarella', price: 18.99, imageUrl: 'https://picsum.photos/seed/r2z3/300/300', isVeg: false, isPopular: false, isCustomizable: true, rating: 4.8, tags: ['meaty', 'indulgent'], isAvailable: true, calories: 1100, preparationTime: 22 },
  { id: 'r2_z4', restaurantId: 'r2', category: 'pizza', name: 'Truffle Mushroom', description: 'Truffle oil base, wild mushrooms, parmesan & rocket', price: 19.99, imageUrl: 'https://picsum.photos/seed/r2z4/300/300', isVeg: true, isPopular: false, rating: 4.7, tags: ['veg', 'premium'], isAvailable: true, calories: 750, preparationTime: 20 },
  // Starter
  { id: 'r2_s1', restaurantId: 'r2', category: 'starter', name: 'Bruschetta', description: 'Toasted sourdough, diced tomato, garlic & fresh basil', price: 6.49, imageUrl: 'https://picsum.photos/seed/r2s1/300/300', isVeg: true, isPopular: false, rating: 4.3, tags: ['veg', 'light'], isAvailable: true, calories: 210, preparationTime: 8 },
  { id: 'r2_s2', restaurantId: 'r2', category: 'starter', name: 'Caesar Salad', description: 'Romaine, croutons, parmesan & house Caesar dressing', price: 8.99, imageUrl: 'https://picsum.photos/seed/r2s2/300/300', isVeg: true, isPopular: false, rating: 4.4, tags: ['veg', 'salad'], isAvailable: true, calories: 320, preparationTime: 7 },
  // Dessert
  { id: 'r2_dt1', restaurantId: 'r2', category: 'dessert', name: 'Tiramisu', description: 'Classic Italian tiramisu with espresso & mascarpone', price: 7.49, imageUrl: 'https://picsum.photos/seed/r2dt1/300/300', isVeg: true, isPopular: false, rating: 4.8, tags: ['italian', 'sweet'], isAvailable: true, calories: 420, preparationTime: 5 },
  { id: 'r2_dt2', restaurantId: 'r2', category: 'dessert', name: 'Nutella Calzone', description: 'Warm folded dough filled with Nutella & dusted icing sugar', price: 8.49, imageUrl: 'https://picsum.photos/seed/r2dt2/300/300', isVeg: true, isPopular: false, isBestSeller: true, rating: 4.9, tags: ['sweet', 'warm'], isAvailable: true, calories: 560, preparationTime: 12 },
  // Drinks
  { id: 'r2_d1', restaurantId: 'r2', category: 'drinks', name: 'San Pellegrino', description: 'Italian sparkling mineral water 330ml', price: 2.99, imageUrl: 'https://picsum.photos/seed/r2d1/300/300', isVeg: true, isPopular: false, rating: 4.2, tags: ['sparkling'], isAvailable: true, calories: 0, preparationTime: 2 },
  { id: 'r2_d2', restaurantId: 'r2', category: 'drinks', name: 'Freshly Squeezed OJ', description: 'Cold-pressed orange juice, no added sugar', price: 4.49, imageUrl: 'https://picsum.photos/seed/r2d2/300/300', isVeg: true, isPopular: false, rating: 4.5, tags: ['fresh', 'healthy'], isAvailable: true, calories: 110, preparationTime: 4 },
];

// ─── Spice Route (r4) ─────────────────────────────────────────────────────────
const MENU_R4: RestaurantMenuItem[] = [
  { id: 'r4_p1', restaurantId: 'r4', category: 'popular', name: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with spiced chicken & caramelised onions', price: 14.99, imageUrl: 'https://picsum.photos/seed/r4p1/300/300', isVeg: false, isPopular: true, isBestSeller: true, rating: 4.9, tags: ['rice', 'spicy'], isAvailable: true, calories: 680, preparationTime: 25 },
  { id: 'r4_p2', restaurantId: 'r4', category: 'popular', name: 'Butter Chicken', description: 'Tender chicken in rich tomato-cream sauce, best with naan', price: 13.99, imageUrl: 'https://picsum.photos/seed/r4p2/300/300', isVeg: false, isPopular: true, isBestSeller: true, isCustomizable: true, rating: 4.8, tags: ['curry', 'mild'], isAvailable: true, calories: 560, preparationTime: 20 },
  { id: 'r4_p3', restaurantId: 'r4', category: 'popular', name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese cubes in spiced masala gravy', price: 12.99, imageUrl: 'https://picsum.photos/seed/r4p3/300/300', isVeg: true, isPopular: true, rating: 4.7, tags: ['veg', 'curry'], isAvailable: true, calories: 490, preparationTime: 18 },
  { id: 'r4_p4', restaurantId: 'r4', category: 'popular', name: 'Garlic Naan (2 pcs)', description: 'Soft tandoor-baked bread with garlic & butter', price: 3.99, imageUrl: 'https://picsum.photos/seed/r4p4/300/300', isVeg: true, isPopular: true, rating: 4.6, tags: ['bread', 'veg'], isAvailable: true, calories: 240, preparationTime: 8 },
  { id: 'r4_m1', restaurantId: 'r4', category: 'main', name: 'Veg Biryani', description: 'Fragrant basmati with seasonal vegetables & saffron', price: 11.99, imageUrl: 'https://picsum.photos/seed/r4m1/300/300', isVeg: true, isPopular: false, discount: 20, rating: 4.5, tags: ['veg', 'rice'], isAvailable: true, calories: 520, preparationTime: 22 },
  { id: 'r4_m2', restaurantId: 'r4', category: 'main', name: 'Dal Makhani', description: 'Slow-cooked black lentils with cream & butter', price: 10.99, imageUrl: 'https://picsum.photos/seed/r4m2/300/300', isVeg: true, isPopular: false, rating: 4.7, tags: ['veg', 'dal'], isAvailable: true, calories: 380, preparationTime: 15 },
  { id: 'r4_m3', restaurantId: 'r4', category: 'main', name: 'Mutton Rogan Josh', description: 'Kashmiri-style slow-braised mutton in aromatic spices', price: 17.99, imageUrl: 'https://picsum.photos/seed/r4m3/300/300', isVeg: false, isPopular: false, rating: 4.8, tags: ['mutton', 'spicy'], isAvailable: true, calories: 640, preparationTime: 30 },
  { id: 'r4_s1', restaurantId: 'r4', category: 'starter', name: 'Samosa (2 pcs)', description: 'Crispy pastry with spiced potato & pea filling', price: 4.49, imageUrl: 'https://picsum.photos/seed/r4s1/300/300', isVeg: true, isPopular: false, isBestSeller: true, rating: 4.5, tags: ['veg', 'fried'], isAvailable: true, calories: 280, preparationTime: 8 },
  { id: 'r4_s2', restaurantId: 'r4', category: 'starter', name: 'Chicken Tikka (6 pcs)', description: 'Marinated chicken pieces grilled in tandoor', price: 9.99, imageUrl: 'https://picsum.photos/seed/r4s2/300/300', isVeg: false, isPopular: false, isCustomizable: true, rating: 4.7, tags: ['chicken', 'grilled'], isAvailable: true, calories: 360, preparationTime: 15 },
  { id: 'r4_d1', restaurantId: 'r4', category: 'drinks', name: 'Mango Lassi', description: 'Chilled yoghurt drink with Alphonso mango pulp', price: 4.49, imageUrl: 'https://picsum.photos/seed/r4d1/300/300', isVeg: true, isPopular: false, isBestSeller: true, rating: 4.8, tags: ['cold', 'sweet'], isAvailable: true, calories: 210, preparationTime: 4 },
  { id: 'r4_d2', restaurantId: 'r4', category: 'drinks', name: 'Masala Chai', description: 'Freshly brewed spiced tea with milk', price: 2.99, imageUrl: 'https://picsum.photos/seed/r4d2/300/300', isVeg: true, isPopular: false, rating: 4.6, tags: ['hot', 'tea'], isAvailable: true, calories: 90, preparationTime: 5 },
];

// ─── Sushi Garden (r3) ────────────────────────────────────────────────────────
const MENU_R3: RestaurantMenuItem[] = [
  { id: 'r3_p1', restaurantId: 'r3', category: 'popular', name: 'Salmon Nigiri (6 pcs)', description: 'Hand-pressed sushi rice topped with fresh Atlantic salmon', price: 14.99, imageUrl: 'https://picsum.photos/seed/r3p1/300/300', isVeg: false, isPopular: true, isBestSeller: true, rating: 4.9, tags: ['raw', 'fresh'], isAvailable: true, calories: 290, preparationTime: 12 },
  { id: 'r3_p2', restaurantId: 'r3', category: 'popular', name: 'Dragon Roll', description: 'Avocado over shrimp tempura & cucumber, topped with tobiko', price: 16.99, imageUrl: 'https://picsum.photos/seed/r3p2/300/300', isVeg: false, isPopular: true, isBestSeller: true, rating: 4.8, tags: ['roll', 'shrimp'], isAvailable: true, calories: 420, preparationTime: 18 },
  { id: 'r3_p3', restaurantId: 'r3', category: 'popular', name: 'Edamame', description: 'Steamed salted soybeans', price: 4.49, imageUrl: 'https://picsum.photos/seed/r3p3/300/300', isVeg: true, isPopular: true, rating: 4.4, tags: ['veg', 'light'], isAvailable: true, calories: 140, preparationTime: 5 },
  { id: 'r3_p4', restaurantId: 'r3', category: 'popular', name: 'Miso Ramen', description: 'Rich miso broth, chashu pork, soft egg, nori & bamboo', price: 15.99, imageUrl: 'https://picsum.photos/seed/r3p4/300/300', isVeg: false, isPopular: true, rating: 4.7, tags: ['ramen', 'warm'], isAvailable: true, calories: 620, preparationTime: 20 },
  { id: 'r3_m1', restaurantId: 'r3', category: 'main', name: 'Chicken Teriyaki Bento', description: 'Grilled teriyaki chicken with steamed rice, salad & miso', price: 17.49, imageUrl: 'https://picsum.photos/seed/r3m1/300/300', isVeg: false, isPopular: false, isBestSeller: true, rating: 4.8, tags: ['chicken', 'bento'], isAvailable: true, calories: 680, preparationTime: 22 },
  { id: 'r3_m2', restaurantId: 'r3', category: 'main', name: 'Veggie Udon', description: 'Thick wheat noodles in dashi broth with tofu & vegetables', price: 13.49, imageUrl: 'https://picsum.photos/seed/r3m2/300/300', isVeg: true, isPopular: false, discount: 15, rating: 4.5, tags: ['veg', 'noodle'], isAvailable: true, calories: 490, preparationTime: 18 },
  { id: 'r3_s1', restaurantId: 'r3', category: 'starter', name: 'Gyoza (6 pcs)', description: 'Pan-fried pork & cabbage dumplings with ponzu sauce', price: 7.99, imageUrl: 'https://picsum.photos/seed/r3s1/300/300', isVeg: false, isPopular: false, isBestSeller: true, rating: 4.7, tags: ['dumplings'], isAvailable: true, calories: 310, preparationTime: 12 },
  { id: 'r3_s2', restaurantId: 'r3', category: 'starter', name: 'Miso Soup', description: 'Traditional dashi miso with silken tofu & wakame', price: 3.49, imageUrl: 'https://picsum.photos/seed/r3s2/300/300', isVeg: true, isPopular: false, rating: 4.3, tags: ['veg', 'soup'], isAvailable: true, calories: 60, preparationTime: 5 },
  { id: 'r3_d1', restaurantId: 'r3', category: 'drinks', name: 'Matcha Latte', description: 'Ceremonial grade matcha with oat milk, hot or iced', price: 5.49, imageUrl: 'https://picsum.photos/seed/r3d1/300/300', isVeg: true, isPopular: false, isCustomizable: true, rating: 4.6, tags: ['tea', 'matcha'], isAvailable: true, calories: 130, preparationTime: 5 },
  { id: 'r3_d2', restaurantId: 'r3', category: 'drinks', name: 'Yuzu Lemonade', description: 'Refreshing yuzu citrus with sparkling water & mint', price: 4.49, imageUrl: 'https://picsum.photos/seed/r3d2/300/300', isVeg: true, isPopular: false, rating: 4.5, tags: ['cold', 'citrus'], isAvailable: true, calories: 80, preparationTime: 4 },
];

// ─── Generic fallback menu (for r5–r10) ──────────────────────────────────────
const buildGenericMenu = (restaurantId: string): RestaurantMenuItem[] => [
  { id: `${restaurantId}_p1`, restaurantId, category: 'popular', name: 'Chef\'s Special', description: 'House signature dish — chef\'s daily inspiration using seasonal ingredients', price: 13.99, imageUrl: `https://picsum.photos/seed/${restaurantId}p1/300/300`, isVeg: false, isPopular: true, isBestSeller: true, rating: 4.7, tags: ['special'], isAvailable: true },
  { id: `${restaurantId}_p2`, restaurantId, category: 'popular', name: 'House Salad', description: 'Fresh greens, cherry tomatoes, cucumber & vinaigrette', price: 7.49, imageUrl: `https://picsum.photos/seed/${restaurantId}p2/300/300`, isVeg: true, isPopular: true, rating: 4.4, tags: ['veg', 'light'], isAvailable: true },
  { id: `${restaurantId}_p3`, restaurantId, category: 'popular', name: 'Soup of the Day', description: 'Ask your server. Served with artisan bread.', price: 5.99, imageUrl: `https://picsum.photos/seed/${restaurantId}p3/300/300`, isVeg: true, isPopular: true, rating: 4.3, tags: ['veg', 'warm'], isAvailable: true },
  { id: `${restaurantId}_m1`, restaurantId, category: 'main', name: 'Grilled Protein Plate', description: 'Your choice of protein, seasonal veg & house sauce', price: 15.99, imageUrl: `https://picsum.photos/seed/${restaurantId}m1/300/300`, isVeg: false, isPopular: false, isCustomizable: true, isBestSeller: true, rating: 4.6, tags: ['grilled', 'healthy'], isAvailable: true },
  { id: `${restaurantId}_m2`, restaurantId, category: 'main', name: 'Pasta of the Day', description: 'House-made pasta with choice of sauce & toppings', price: 12.99, imageUrl: `https://picsum.photos/seed/${restaurantId}m2/300/300`, isVeg: true, isPopular: false, isCustomizable: true, discount: 10, rating: 4.5, tags: ['veg', 'pasta'], isAvailable: true },
  { id: `${restaurantId}_s1`, restaurantId, category: 'starter', name: 'Loaded Nachos', description: 'Tortilla chips with cheese, jalapeños, salsa & guacamole', price: 8.49, imageUrl: `https://picsum.photos/seed/${restaurantId}s1/300/300`, isVeg: true, isPopular: false, rating: 4.4, tags: ['veg', 'sharing'], isAvailable: true },
  { id: `${restaurantId}_dt1`, restaurantId, category: 'dessert', name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with molten centre & vanilla ice cream', price: 6.99, imageUrl: `https://picsum.photos/seed/${restaurantId}dt1/300/300`, isVeg: true, isPopular: false, isBestSeller: true, rating: 4.8, tags: ['chocolate', 'warm'], isAvailable: true },
  { id: `${restaurantId}_d1`, restaurantId, category: 'drinks', name: 'Still / Sparkling Water', description: '500ml bottle', price: 1.99, imageUrl: `https://picsum.photos/seed/${restaurantId}d1/300/300`, isVeg: true, isPopular: false, isCustomizable: true, rating: 4.0, tags: ['water'], isAvailable: true },
  { id: `${restaurantId}_d2`, restaurantId, category: 'drinks', name: 'Fresh Juice', description: 'Orange, Apple or Mixed Berries', price: 4.49, imageUrl: `https://picsum.photos/seed/${restaurantId}d2/300/300`, isVeg: true, isPopular: false, isCustomizable: true, rating: 4.5, tags: ['fresh', 'cold'], isAvailable: true },
];

// ─── Master item index ─────────────────────────────────────────────────────────
const ALL_ITEMS: Record<string, RestaurantMenuItem[]> = {
  r1: MENU_R1,
  r2: MENU_R2,
  r3: MENU_R3,
  r4: MENU_R4,
  r5: buildGenericMenu('r5'),
  r6: buildGenericMenu('r6'),
  r7: buildGenericMenu('r7'),
  r8: buildGenericMenu('r8'),
  r9: buildGenericMenu('r9'),
  r10: buildGenericMenu('r10'),
};

// ─── Category-to-restaurant mapping ──────────────────────────────────────────
const RESTAURANT_CAT_IDS: Record<string, string[]> = {
  r1: ['popular', 'burger', 'starter', 'drinks'],
  r2: ['popular', 'pizza', 'starter', 'dessert', 'drinks'],
  r3: ['popular', 'main', 'starter', 'drinks'],
  r4: ['popular', 'main', 'starter', 'drinks'],
  r5: ['popular', 'main', 'starter', 'dessert', 'drinks'],
  r6: ['popular', 'main', 'starter', 'dessert', 'drinks'],
  r7: ['popular', 'main', 'starter', 'dessert', 'drinks'],
  r8: ['popular', 'main', 'starter', 'dessert', 'drinks'],
  r9: ['popular', 'main', 'starter', 'dessert', 'drinks'],
  r10: ['popular', 'main', 'starter', 'dessert', 'drinks'],
};

// ─── Public helpers ────────────────────────────────────────────────────────────

/** Categories for a given restaurant (ordered). */
export function getRestaurantCategories(restaurantId: string): MenuCategory[] {
  const ids = RESTAURANT_CAT_IDS[restaurantId] ?? RESTAURANT_CAT_IDS.r5;
  return ids
    .map((id) => ALL_MENU_CATEGORIES.find((c) => c.id === id))
    .filter(Boolean) as MenuCategory[];
}

/** All menu items for a restaurant, optionally filtered by category id. */
export function getMenuItems(restaurantId: string, categoryId?: string): RestaurantMenuItem[] {
  const items = ALL_ITEMS[restaurantId] ?? buildGenericMenu(restaurantId);
  if (!categoryId) return items;
  return items.filter((i) => i.category === categoryId);
}

/** Menu items grouped by category for a given restaurant. */
export function getMenuByCategory(
  restaurantId: string,
): { category: MenuCategory; items: RestaurantMenuItem[] }[] {
  const categories = getRestaurantCategories(restaurantId);
  return categories.map((cat) => ({
    category: cat,
    items: getMenuItems(restaurantId, cat.id),
  }));
}

/** Quick promo codes for cart screen. */
export const PROMO_CODES: Record<string, number> = {
  FIRST50: 50,   // ₹/$50 off
  CRAVIO20: 20,
  FREEDEL: 40,   // covers delivery
  BOGO100: 100,
  WKND20: 20,
};
