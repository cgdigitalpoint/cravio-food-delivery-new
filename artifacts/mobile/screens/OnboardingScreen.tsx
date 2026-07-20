// ─── Onboarding Screen ────────────────────────────────────────────────────────
// Three premium onboarding slides with food illustrations.
// Swipe or use Next/Skip buttons to navigate.

import React, { useEffect, useRef, useState } from 'react';
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
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import { PP } from '@/theme/poppins';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDES = [
  {
    key: 'discover',
    gradient: ['#FF5E00', '#FF6B00', '#FF8C38'] as const,
    accentGradient: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.04)'] as const,
    title: 'Discover Amazing\nFood Near You',
    subtitle:
      'Browse hundreds of restaurants and find your perfect meal, anytime you crave it.',
  },
  {
    key: 'delivery',
    gradient: ['#0D1117', '#111827', '#1A2233'] as const,
    accentGradient: ['rgba(255,107,0,0.22)', 'rgba(255,107,0,0.04)'] as const,
    title: 'Lightning Fast\nDelivery',
    subtitle:
      'Get hot, fresh food delivered to your door in 30 minutes or less, guaranteed.',
  },
  {
    key: 'deals',
    gradient: ['#3730A3', '#4338CA', '#5B4FE8'] as const,
    accentGradient: ['rgba(255,255,255,0.14)', 'rgba(255,255,255,0.02)'] as const,
    title: 'Exclusive Deals\nEvery Day',
    subtitle:
      'Save more with personalized offers, cashback rewards, and daily specials just for you.',
  },
];

// ─── Illustrations ────────────────────────────────────────────────────────────

function Slide1Illustration() {
  return (
    <View style={illStyles.container}>
      {/* Background circles */}
      <View style={[illStyles.bgCircle, { width: 300, height: 300, opacity: 0.12, top: -60, right: -70 }]} />
      <View style={[illStyles.bgCircle, { width: 180, height: 180, opacity: 0.08, bottom: -30, left: -50 }]} />

      {/* Central food bowl */}
      <View style={illStyles.mainIconWrap}>
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.10)']}
          style={illStyles.mainIconBg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="restaurant" size={64} color="#FFFFFF" />
        </LinearGradient>
      </View>

      {/* Floating food items */}
      <View style={[illStyles.floatItem, { top: '15%', right: '12%' }]}>
        <LinearGradient colors={['#FF8C38', '#E05500']} style={illStyles.floatBg}>
          <Ionicons name="pizza-outline" size={22} color="#FFFFFF" />
        </LinearGradient>
        <Text style={illStyles.floatLabel}>Pizza</Text>
      </View>

      <View style={[illStyles.floatItem, { top: '12%', left: '10%' }]}>
        <LinearGradient colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.15)']} style={illStyles.floatBg}>
          <Ionicons name="cafe-outline" size={22} color="#FFFFFF" />
        </LinearGradient>
        <Text style={illStyles.floatLabel}>Coffee</Text>
      </View>

      <View style={[illStyles.floatItem, { bottom: '18%', right: '16%' }]}>
        <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.12)']} style={illStyles.floatBg}>
          <Ionicons name="ice-cream-outline" size={22} color="#FFFFFF" />
        </LinearGradient>
        <Text style={illStyles.floatLabel}>Dessert</Text>
      </View>

      <View style={[illStyles.floatItem, { bottom: '22%', left: '14%' }]}>
        <LinearGradient colors={['#FF6B00', '#E05500']} style={illStyles.floatBg}>
          <Ionicons name="fast-food-outline" size={22} color="#FFFFFF" />
        </LinearGradient>
        <Text style={illStyles.floatLabel}>Burger</Text>
      </View>

      {/* Star sparkles */}
      <Text style={[illStyles.star, { top: '22%', left: '28%', fontSize: 18, opacity: 0.8 }]}>✦</Text>
      <Text style={[illStyles.star, { top: '36%', right: '8%', fontSize: 12, opacity: 0.5 }]}>✦</Text>
      <Text style={[illStyles.star, { bottom: '30%', left: '36%', fontSize: 14, opacity: 0.6 }]}>✦</Text>
      <Text style={[illStyles.star, { top: '8%', right: '36%', fontSize: 10, opacity: 0.4 }]}>✦</Text>

      {/* Rating pill */}
      <View style={[illStyles.pill, { bottom: '36%', right: '10%', backgroundColor: 'rgba(255,255,255,0.18)' }]}>
        <Ionicons name="star" size={12} color="#FFD700" />
        <Text style={[PP.caption, { color: '#FFFFFF' }]}>4.9 Top Rated</Text>
      </View>
    </View>
  );
}

function Slide2Illustration() {
  return (
    <View style={illStyles.container}>
      {/* Orange glow accent */}
      <View style={[illStyles.bgCircle, { width: 240, height: 240, backgroundColor: 'rgba(255,107,0,0.18)', top: -40, right: -60 }]} />
      <View style={[illStyles.bgCircle, { width: 120, height: 120, backgroundColor: 'rgba(34,197,94,0.12)', bottom: 20, left: -30 }]} />

      {/* Central delivery icon */}
      <View style={illStyles.mainIconWrap}>
        <View style={[illStyles.mainIconBg, { backgroundColor: 'rgba(255,107,0,0.15)', borderWidth: 1.5, borderColor: 'rgba(255,107,0,0.35)' }]}>
          <Ionicons name="bicycle" size={64} color="#FF6B00" />
        </View>
      </View>

      {/* Motion speed lines */}
      <View style={illStyles.speedLines}>
        <View style={[illStyles.speedLine, { width: 56, opacity: 0.5 }]} />
        <View style={[illStyles.speedLine, { width: 80, opacity: 0.35 }]} />
        <View style={[illStyles.speedLine, { width: 44, opacity: 0.25 }]} />
      </View>

      {/* Location pin floating */}
      <View style={[illStyles.floatItem, { top: '14%', right: '14%' }]}>
        <View style={[illStyles.floatBg, { backgroundColor: '#FF6B00' }]}>
          <Ionicons name="location" size={22} color="#FFFFFF" />
        </View>
        <Text style={illStyles.floatLabel}>Your Door</Text>
      </View>

      {/* Timer badge */}
      <View style={[illStyles.pill, { top: '12%', left: '10%', backgroundColor: 'rgba(34,197,94,0.2)', borderColor: 'rgba(34,197,94,0.4)', borderWidth: 1 }]}>
        <Ionicons name="time-outline" size={14} color="#22C55E" />
        <Text style={[PP.caption, { color: '#22C55E', fontFamily: 'Poppins_600SemiBold' }]}>
          {'< 30 min'}
        </Text>
      </View>

      {/* Checkmark pill */}
      <View style={[illStyles.pill, { bottom: '24%', right: '10%', backgroundColor: 'rgba(255,107,0,0.18)', borderColor: 'rgba(255,107,0,0.35)', borderWidth: 1 }]}>
        <Ionicons name="checkmark-circle" size={14} color="#FF6B00" />
        <Text style={[PP.caption, { color: '#FF6B00', fontFamily: 'Poppins_600SemiBold' }]}>
          Real-time Tracking
        </Text>
      </View>

      {/* Stars */}
      <Text style={[illStyles.star, { top: '28%', left: '20%', fontSize: 16, opacity: 0.5, color: '#FF6B00' }]}>✦</Text>
      <Text style={[illStyles.star, { bottom: '36%', left: '10%', fontSize: 10, opacity: 0.3, color: '#FF6B00' }]}>✦</Text>
    </View>
  );
}

function Slide3Illustration() {
  return (
    <View style={illStyles.container}>
      {/* Background circles */}
      <View style={[illStyles.bgCircle, { width: 260, height: 260, opacity: 0.12, top: -50, left: -60 }]} />
      <View style={[illStyles.bgCircle, { width: 140, height: 140, opacity: 0.08, bottom: -20, right: -40 }]} />

      {/* Big watermark % */}
      <Text style={illStyles.percentWatermark}>%</Text>

      {/* Central tag icon */}
      <View style={illStyles.mainIconWrap}>
        <LinearGradient
          colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']}
          style={illStyles.mainIconBg}
        >
          <Ionicons name="pricetag" size={60} color="#FFFFFF" />
        </LinearGradient>
      </View>

      {/* Offer badges */}
      <View style={[illStyles.offerBadge, { top: '14%', right: '10%', backgroundColor: '#EF4444' }]}>
        <Text style={[PP.caption, { color: '#FFFFFF', fontFamily: 'Poppins_700Bold' }]}>30% OFF</Text>
      </View>

      <View style={[illStyles.offerBadge, { top: '16%', left: '8%', backgroundColor: '#FF6B00' }]}>
        <Text style={[PP.caption, { color: '#FFFFFF', fontFamily: 'Poppins_700Bold' }]}>FREE Delivery</Text>
      </View>

      <View style={[illStyles.offerBadge, { bottom: '22%', left: '12%', backgroundColor: '#22C55E' }]}>
        <Text style={[PP.caption, { color: '#FFFFFF', fontFamily: 'Poppins_700Bold' }]}>₹50 OFF</Text>
      </View>

      {/* Star ratings */}
      <View style={[illStyles.floatItem, { bottom: '24%', right: '12%' }]}>
        <View style={[illStyles.floatBg, { backgroundColor: 'rgba(255,215,0,0.25)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)' }]}>
          <Ionicons name="star" size={22} color="#FFD700" />
        </View>
        <Text style={illStyles.floatLabel}>Rewards</Text>
      </View>

      {/* Sparkles */}
      <Text style={[illStyles.star, { top: '30%', left: '30%', fontSize: 16, opacity: 0.6 }]}>✦</Text>
      <Text style={[illStyles.star, { bottom: '40%', right: '30%', fontSize: 10, opacity: 0.4 }]}>✦</Text>
      <Text style={[illStyles.star, { top: '10%', right: '40%', fontSize: 13, opacity: 0.5 }]}>✦</Text>
    </View>
  );
}

const ILLUSTRATIONS = [Slide1Illustration, Slide2Illustration, Slide3Illustration];

// ─── Dot indicator ────────────────────────────────────────────────────────────

function DotIndicator({ current, total }: { current: number; total: number }) {
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            {
              width: i === current ? 26 : 8,
              backgroundColor: i === current ? '#FF6B00' : 'rgba(255,107,0,0.25)',
            },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const contentY = useSharedValue(0);

  const slideStripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const goTo = (index: number) => {
    // Animate content out
    contentOpacity.value = withTiming(0, { duration: 140 });
    contentY.value = withTiming(8, { duration: 140 }, () => {
      runOnJS(setCurrentIndex)(index);
      // Slide illustrations
      translateX.value = withSpring(-index * SCREEN_W, {
        damping: 24,
        stiffness: 200,
      });
      // Animate content back in
      contentY.value = -8;
      contentOpacity.value = withDelay(80, withTiming(1, { duration: 220 }));
      contentY.value = withDelay(80, withTiming(0, { duration: 220 }));
    });
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      goTo(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const isLast = currentIndex === SLIDES.length - 1;
  const paddingBottom = Platform.OS === 'web' ? 34 : insets.bottom;
  const paddingTop = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={styles.screen}>
      {/* ── Slide strip (illustrations) ── */}
      <View style={styles.illustrationArea}>
        <Animated.View
          style={[
            styles.slideStrip,
            { width: SCREEN_W * SLIDES.length },
            slideStripStyle,
          ]}
        >
          {SLIDES.map((slide, i) => {
            const Ill = ILLUSTRATIONS[i]!;
            return (
              <View key={slide.key} style={[styles.slide, { width: SCREEN_W }]}>
                <LinearGradient
                  colors={slide.gradient}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Ill />
              </View>
            );
          })}
        </Animated.View>
      </View>

      {/* ── Skip button (floating) ── */}
      {!isLast && (
        <TouchableOpacity
          onPress={onComplete}
          style={[styles.skipBtn, { top: paddingTop + 16 }]}
        >
          <Text style={[PP.label, styles.skipText]}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* ── Bottom card ── */}
      <View style={[styles.bottomCard, { paddingBottom: paddingBottom + 16 }]}>
        <Animated.View style={[styles.cardContent, contentStyle]}>
          <DotIndicator current={currentIndex} total={SLIDES.length} />

          <Text style={[PP.h1, styles.slideTitle]}>
            {SLIDES[currentIndex]!.title}
          </Text>
          <Text style={[PP.body, styles.slideSubtitle]}>
            {SLIDES[currentIndex]!.subtitle}
          </Text>
        </Animated.View>

        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.88}
          style={styles.nextBtn}
        >
          <LinearGradient
            colors={['#FF8530', '#FF6B00', '#E85E00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextBtnGradient}
          >
            <Text style={[PP.button, { color: '#FFFFFF' }]}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
            <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Shared illustration styles ────────────────────────────────────────────────
const illStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bgCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
  },
  mainIconWrap: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  mainIconBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatItem: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  floatBg: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  floatLabel: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  star: {
    position: 'absolute',
    color: 'rgba(255,255,255,0.7)',
  },
  pill: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  speedLines: {
    position: 'absolute',
    left: '10%',
    top: '48%',
    gap: 5,
  },
  speedLine: {
    height: 3,
    backgroundColor: 'rgba(255,107,0,0.4)',
    borderRadius: 2,
  },
  percentWatermark: {
    position: 'absolute',
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 200,
    color: 'rgba(255,255,255,0.06)',
    lineHeight: 220,
  },
  offerBadge: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});

const dotStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  illustrationArea: {
    height: SCREEN_H * 0.60,
    overflow: 'hidden',
  },
  slideStrip: {
    flexDirection: 'row',
    height: '100%',
  },
  slide: {
    height: '100%',
    overflow: 'hidden',
  },
  skipBtn: {
    position: 'absolute',
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
  },
  skipText: { color: '#FFFFFF' },
  bottomCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingTop: 28,
    justifyContent: 'space-between',
    gap: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
  },
  cardContent: { gap: 14 },
  slideTitle: {
    color: '#111827',
  },
  slideSubtitle: {
    color: '#6B7280',
    lineHeight: 22,
  },
  nextBtn: {
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextBtnGradient: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
  },
});
