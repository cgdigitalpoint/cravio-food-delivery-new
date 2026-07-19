// ─── UI Components Barrel ─────────────────────────────────────────────────────

// ── Buttons ────────────────────────────────────────────────────────────────────
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
export { IconButton } from './IconButton';
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './IconButton';
export { FloatingActionButton } from './FloatingActionButton';
export type { FABProps, FABSize } from './FloatingActionButton';

// ── Inputs ─────────────────────────────────────────────────────────────────────
export { InputField } from './TextInput';
export type { InputFieldProps } from './TextInput';
export { SearchBar } from './SearchBar';
export type { SearchBarProps } from './SearchBar';
export { OTPInput } from './OTPInput';
export type { OTPInputProps } from './OTPInput';
export { PasswordInput } from './PasswordField';
export type { PasswordInputProps } from './PasswordField';

// ── Cards ──────────────────────────────────────────────────────────────────────
export { RestaurantCard } from './RestaurantCard';
export type { RestaurantCardProps } from './RestaurantCard';
export { FoodCard } from './FoodCard';
export type { FoodCardProps } from './FoodCard';
export { OfferCard } from './OfferCard';
export type { OfferCardProps } from './OfferCard';
export { CategoryCard } from './CategoryCard';
export type { CategoryCardProps } from './CategoryCard';
export { BannerCard } from './BannerCard';
export type { BannerCardProps } from './BannerCard';

// ── Chips & Badges ─────────────────────────────────────────────────────────────
export { Chip } from './Chip';
export type { ChipProps, ChipVariant } from './Chip';
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';

// ── Navigation ─────────────────────────────────────────────────────────────────
export { BottomNavigation } from './BottomNavigation';
export type { BottomNavigationProps, BottomNavItem } from './BottomNavigation';
export { TopAppBar } from './TopAppBar';
export type { TopAppBarProps } from './TopAppBar';
export { SectionHeader } from './SectionHeader';
export type { SectionHeaderProps } from './SectionHeader';

// ── Other Components ───────────────────────────────────────────────────────────
export { Avatar } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';
export { Divider } from './Divider';
export type { DividerProps } from './Divider';
export { Tag } from './Tag';
export type { TagProps } from './Tag';
export { QuantitySelector } from './QuantitySelector';
export type { QuantitySelectorProps, QuantitySelectorSize } from './QuantitySelector';
export { FavoriteButton } from './FavoriteButton';
export type { FavoriteButtonProps, FavoriteButtonSize } from './FavoriteButton';
export { NotificationBadge } from './NotificationBadge';
export type { NotificationBadgeProps } from './NotificationBadge';

// ── Loading States ─────────────────────────────────────────────────────────────
export { Skeleton, RestaurantCardSkeleton, FoodCardSkeleton, ListItemSkeleton } from './SkeletonLoader';
export type { SkeletonProps } from './SkeletonLoader';
export { CircularLoader } from './CircularLoader';
export type { CircularLoaderProps } from './CircularLoader';

// ── Empty States ───────────────────────────────────────────────────────────────
export { EmptyState } from './EmptyState';
export type { EmptyStateProps, EmptyStateVariant } from './EmptyState';

// ── Dialogs ────────────────────────────────────────────────────────────────────
export { Dialog } from './Dialog';
export type { DialogProps, DialogVariant } from './Dialog';

// ── Snackbars & Toasts ─────────────────────────────────────────────────────────
export { Snackbar } from './Snackbar';
export type { SnackbarProps, SnackbarType } from './Snackbar';
export { Toast } from './Toast';
export type { ToastProps, ToastType } from './Toast';

// ── Typography & Layout helpers ────────────────────────────────────────────────
export { Typography } from './Typography';
export type { TypographyProps } from './Typography';
export { Spacer } from './Spacer';
export type { SpacerProps } from './Spacer';
