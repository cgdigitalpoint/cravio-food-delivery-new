// ─── Welcome Screen ───────────────────────────────────────────────────────────
// Premium hero landing with dark gradient hero + floating food elements +
// white bottom card with Get Started / Log In CTAs.

import React, { useEffect } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame } from 'lucide-react-native';
import { PP } from '@/theme/poppins';
import { PremiumButton } from '@/components/ui';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const FOOD_CATEGORIES = ['🍕 Pizza', '🍔 Burger', '🍣 Sushi', '🍜 Ramen', '☕ Coffee', '🍦 Dessert'];

const FLOATING_CARDS = [
  { name: 'Burger Republic', category: 'American', rating: '4.7', time: '25 min', icon: 'fast-food', color: '#FF6B00', angle: '-5deg', left: 16, top: SCREEN_H * 0.12 },
  { name: 'Pizza Palace', category: 'Italian', rating: '4.5', time: '30 min', icon: 'pizza', color: '#16A34A', angle: '4deg', right: 12, top: SCREEN_H * 0.22 },
  { name: 'Sushi Garden', category: 'Japanese', rating: '4.9', time: '40 min', icon: 'fish', color: '#2563EB', angle: '-3deg', left: 40, top: SCREEN_H * 0.34 },
];

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogIn: () => void;
}

export function WelcomeScreen({ onGetStarted, onLogIn }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  // Mount animations
  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(20);
  const card1Opacity = useSharedValue(0);
  const card1X = useSharedValue(-20);
  const card2Opacity = useSharedValue(0);
  const card2X = useSharedValue(20);
  const card3Opacity = useSharedValue(0);
  const card3X = useSharedValue(-20);
  const bottomOpacity = useSharedValue(0);
  const bottomY = useSharedValue(30);

  useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 700 });
    heroY.value = withSpring(0, { damping: 18, stiffness: 90 });

    card1Opacity.value = withDelay(250, withTiming(1, { duration: 500 }));
    card1X.value = withDelay(250, withSpring(0, { damping: 16, stiffness: 100 }));

    card2Opacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    card2X.value = withDelay(400, withSpring(0, { damping: 16, stiffness: 100 }));

    card3Opacity.value = withDelay(550, withTiming(1, { duration: 500 }));
    card3X.value = withDelay(550, withSpring(0, { damping: 16, stiffness: 100 }));

    bottomOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    bottomY.value = withDelay(600, withSpring(0, { damping: 18, stiffness: 100 }));
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroY.value }],
  }));
  const c1Style = useAnimatedStyle(() => ({
    opacity: card1Opacity.value,
    transform: [{ translateX: card1X.value }],
  }));
  const c2Style = useAnimatedStyle(() => ({
    opacity: card2Opacity.value,
    transform: [{ translateX: card2X.value }],
  }));
  const c3Style = useAnimatedStyle(() => ({
    opacity: card3Opacity.value,
    transform: [{ translateX: card3X.value }],
  }));
  const cardStyles = [c1Style, c2Style, c3Style];
  const bottomStyle = useAnimatedStyle(() => ({
    opacity: bottomOpacity.value,
    transform: [{ translateY: bottomY.value }],
  }));

  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={styles.screen}>
      {/* ═══ HERO AREA ════════════════════════════════════════════════════════ */}
      <View style={styles.hero}>
        {/* Background gradient */}
        <LinearGradient
          colors={['#0A0A0A', '#111827', '#0D1117']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Decorative orange glow (bottom-right) */}
        <View style={styles.orangeGlow} pointerEvents="none">
          <LinearGradient
            colors={['rgba(255,107,0,0.28)', 'rgba(255,107,0,0.06)', 'transparent']}
            style={{ width: 320, height: 320, borderRadius: 160 }}
          />
        </View>

        {/* Decorative green glow (top-left) */}
        <View style={styles.greenGlow} pointerEvents="none">
          <LinearGradient
            colors={['rgba(34,197,94,0.15)', 'transparent']}
            style={{ width: 180, height: 180, borderRadius: 90 }}
          />
        </View>

        {/* Logo at top */}
        <View style={[styles.logoRow, { marginTop: paddingTop + 12 }]}>
          <View style={styles.logoBadge}>
            <LinearGradient
              colors={['#FF8530', '#FF6B00']}
              style={styles.logoBadgeGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Flame size={16} color="#FFFFFF" strokeWidth={2.5} />
            </LinearGradient>
          </View>
          <Text style={[PP.title, styles.logoText]}>cravio</Text>
        </View>

        {/* Main headline */}
        <Animated.View style={[styles.headline, heroStyle]}>
          <Text style={[PP.displayXL, styles.headlineText]}>
            Order Food
          </Text>
          <Text style={[PP.displayXL, styles.headlineAccent]}>
            You Love.
          </Text>
          <Text style={[PP.body, styles.headlineSubtitle]}>
            Hundreds of restaurants, one app.{'\n'}
            Delivered fast, delivered fresh.
          </Text>
        </Animated.View>

        {/* Floating glassmorphism restaurant cards */}
        {FLOATING_CARDS.map((card, i) => {
          const posStyle: Record<string, any> = {};
          if (card.left !== undefined) posStyle.left = card.left;
          if ('right' in card) posStyle.right = (card as any).right;
          posStyle.top = card.top;

          return (
            <Animated.View
              key={card.name}
              style={[
                styles.floatingCard,
                posStyle,
                { transform: [{ rotate: card.angle }] },
                cardStyles[i],
              ]}
            >
              <View style={[styles.floatingCardIcon, { backgroundColor: `${card.color}20` }]}>
                <Ionicons name={card.icon as any} size={18} color={card.color} />
              </View>
              <View style={styles.floatingCardText}>
                <Text style={[PP.bodySM, { color: '#FFFFFF', fontFamily: 'Poppins_600SemiBold' }]}>
                  {card.name}
                </Text>
                <View style={styles.floatingCardMeta}>
                  <Ionicons name="star" size={10} color="#FFD700" />
                  <Text style={[PP.caption, { color: 'rgba(255,255,255,0.7)' }]}>
                    {' '}{card.rating} · {card.time}
                  </Text>
                </View>
              </View>
            </Animated.View>
          );
        })}

        {/* Food category pills scroll */}
        <View style={styles.categoriesRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {FOOD_CATEGORIES.map((cat) => (
              <View key={cat} style={styles.categoryPill}>
                <Text style={[PP.caption, { color: 'rgba(255,255,255,0.9)' }]}>{cat}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* ═══ BOTTOM CARD ══════════════════════════════════════════════════════ */}
      <Animated.View style={[styles.bottomCard, bottomStyle]}>
        {/* Handle */}
        <View style={styles.handle} />

        <View style={styles.bottomContent}>
          {/* Tagline */}
          <View style={styles.tagRow}>
            <View style={styles.tagDot} />
            <Text style={[PP.caption, styles.tagText]}>Join 2M+ food lovers</Text>
          </View>

          <Text style={[PP.subtitle, styles.bottomSubtitle]}>
            The fastest way to get your favourite food delivered.
          </Text>

          <View style={styles.ctaStack}>
            <PremiumButton
              label="Get Started"
              onPress={onGetStarted}
              variant="primary"
              fullWidth
            />
            <PremiumButton
              label="Log In"
              onPress={onLogIn}
              variant="outline"
              fullWidth
            />
          </View>

          <Text style={[PP.caption, styles.termsText]}>
            By continuing you agree to our{' '}
            <Text style={{ color: '#FF6B00' }}>Terms</Text> &{' '}
            <Text style={{ color: '#FF6B00' }}>Privacy Policy</Text>
          </Text>
        </View>

        <View style={{ height: paddingBottom }} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A' },

  // Hero
  hero: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  orangeGlow: {
    position: 'absolute',
    bottom: -60,
    right: -60,
  },
  greenGlow: {
    position: 'absolute',
    top: -30,
    left: -30,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  logoBadge: {
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 0,
  },
  logoBadgeGrad: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: 'rgba(255,255,255,0.90)', letterSpacing: 1.5 },
  headline: {
    paddingHorizontal: 24,
    marginTop: 24,
    gap: 2,
  },
  headlineText: { color: '#FFFFFF', lineHeight: 56 },
  headlineAccent: { color: '#FF6B00', lineHeight: 56 },
  headlineSubtitle: {
    color: 'rgba(255,255,255,0.52)',
    marginTop: 12,
    lineHeight: 22,
  },

  // Floating cards
  floatingCard: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  floatingCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCardText: { gap: 2 },
  floatingCardMeta: { flexDirection: 'row', alignItems: 'center' },

  // Categories scroll
  categoriesRow: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  categoriesList: { paddingHorizontal: 24, gap: 8 },
  categoryPill: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  // Bottom card
  bottomCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tagDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  tagText: { color: '#6B7280' },
  bottomSubtitle: { color: '#111827' },
  ctaStack: { gap: 12 },
  termsText: {
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});
