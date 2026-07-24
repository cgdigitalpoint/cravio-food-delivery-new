import {
  getMenuItems,
  type RestaurantMenuItem,
} from '@/data/restaurantData';
import { RESTAURANTS, type Restaurant } from '@/data/homeData';

export interface EngagementReview {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  verifiedPurchase: boolean;
  foodId?: string;
  foodName?: string;
  photoCount?: number;
}

const REVIEW_NAMES = ['Maya Chen', 'Jordan Ellis', 'Sam Rivera', 'Priya Shah', 'Noah Williams', 'Ava Patel'];
const REVIEW_COMMENTS = [
  'Fresh, flavorful, and arrived exactly when promised. Would order again.',
  'The portion was generous and every bite tasted carefully prepared.',
  'Really good value for the quality. The delivery was quick too.',
  'A lovely meal. The seasoning was balanced and the presentation was great.',
  'This has become one of my go-to orders in the neighborhood.',
  'Everything was delicious, warm, and packed thoughtfully.',
];

function reviewFor(index: number, restaurantId: string, food?: RestaurantMenuItem): EngagementReview {
  const rating = food ? [4.8, 4.6, 4.9, 4.4][index % 4] : [5, 4, 5, 4, 5][index % 5];
  return {
    id: `${restaurantId}-${food?.id ?? 'restaurant'}-review-${index}`,
    author: REVIEW_NAMES[index % REVIEW_NAMES.length],
    avatarUrl: `https://i.pravatar.cc/100?img=${(index % 12) + 1}`,
    rating,
    comment: food
      ? `${food.name} was ${REVIEW_COMMENTS[index % REVIEW_COMMENTS.length].toLowerCase()}`
      : REVIEW_COMMENTS[index % REVIEW_COMMENTS.length],
    createdAt: `2026-0${(index % 6) + 1}-${String((index % 20) + 4).padStart(2, '0')}`,
    helpfulCount: 8 + index * 7,
    verifiedPurchase: index !== 3,
    foodId: food?.id,
    foodName: food?.name,
    photoCount: index % 3 === 0 ? 1 : 0,
  };
}

export function getRestaurantReviews(restaurantId: string): EngagementReview[] {
  return Array.from({ length: 6 }, (_, index) => reviewFor(index, restaurantId));
}

export function getFoodReviews(restaurantId: string, foodId: string): EngagementReview[] {
  const food = getMenuItems(restaurantId).find((item) => item.id === foodId);
  return food ? Array.from({ length: 4 }, (_, index) => reviewFor(index, restaurantId, food)) : [];
}

export function getFoodReviewHighlights(restaurantId: string): EngagementReview[] {
  return getMenuItems(restaurantId)
    .filter((item) => item.isPopular || item.isBestSeller)
    .slice(0, 3)
    .flatMap((item) => getFoodReviews(restaurantId, item.id).slice(0, 1));
}

export function getRecommendedItems(restaurantId: string, favoriteFoodIds: Set<string>): RestaurantMenuItem[] {
  const items = getMenuItems(restaurantId);
  return [...items]
    .sort((first, second) => {
      const favoriteScore = Number(favoriteFoodIds.has(second.id)) - Number(favoriteFoodIds.has(first.id));
      return favoriteScore || Number(second.isPopular) - Number(first.isPopular) || second.rating - first.rating;
    })
    .slice(0, 6);
}

export function getSimilarRestaurants(restaurant: Restaurant): Restaurant[] {
  return RESTAURANTS
    .filter((candidate) => candidate.id !== restaurant.id)
    .map((candidate) => ({
      candidate,
      score:
        (candidate.category === restaurant.category ? 3 : 0) +
        (candidate.cuisine.split('·')[0].trim() === restaurant.cuisine.split('·')[0].trim() ? 2 : 0) +
        (candidate.rating >= restaurant.rating - 0.3 ? 1 : 0),
    }))
    .sort((first, second) => second.score - first.score || first.candidate.distance.localeCompare(second.candidate.distance))
    .map(({ candidate }) => candidate)
    .slice(0, 5);
}

export function getAverageRating(reviews: EngagementReview[], fallback: number): number {
  if (reviews.length === 0) return fallback;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}