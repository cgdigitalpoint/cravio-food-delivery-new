import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircle2, ChevronDown, Image as ImageIcon, ThumbsUp } from 'lucide-react-native';

import { Avatar, EmptyState } from '@/components/ui';
import type { EngagementReview } from '@/data/engagementData';
import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

export function RatingSummary({
  average,
  total,
  reviews,
}: {
  average: number;
  total: number;
  reviews: EngagementReview[];
}) {
  const colors = useColors();
  const distribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => Math.round(review.rating) === rating).length,
  }));

  return (
    <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.averageBlock}>
        <Text style={[PP.displaySM, { color: colors.foreground }]}>{average.toFixed(1)}</Text>
        <Text style={styles.stars}>★★★★★</Text>
        <Text style={[PP.caption, { color: colors.mutedForeground }]}>{total.toLocaleString()} reviews</Text>
      </View>
      <View style={styles.distribution}>
        {distribution.map(({ rating, count }) => (
          <View key={rating} style={styles.distributionRow}>
            <Text style={[PP.caption, { color: colors.mutedForeground, width: 12 }]}>{rating}</Text>
            <View style={[styles.barTrack, { backgroundColor: colors.muted }]}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.max(8, (count / Math.max(reviews.length, 1)) * 100)}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ReviewSection({
  title,
  reviews,
  emptyTitle = 'No reviews yet',
}: {
  title: string;
  reviews: EngagementReview[];
  emptyTitle?: string;
}) {
  const colors = useColors();
  const [sort, setSort] = useState<'recent' | 'helpful'>('recent');
  const [helpful, setHelpful] = useState<Set<string>>(new Set());
  const sortedReviews = useMemo(
    () =>
      [...reviews].sort((first, second) =>
        sort === 'helpful'
          ? second.helpfulCount - first.helpfulCount
          : second.createdAt.localeCompare(first.createdAt),
      ),
    [reviews, sort],
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Text style={[PP.h3, { color: colors.foreground }]}>{title}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Change review sort"
          onPress={() => setSort((value) => (value === 'recent' ? 'helpful' : 'recent'))}
          style={[styles.sortButton, { backgroundColor: colors.surfaceVariant }]}
        >
          <Text style={[PP.caption, { color: colors.foreground }]}>
            {sort === 'recent' ? 'Recent' : 'Helpful'}
          </Text>
          <ChevronDown size={14} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
      {sortedReviews.length === 0 ? (
        <EmptyState variant="custom" title={emptyTitle} subtitle="Be the first to share your experience." />
      ) : (
        sortedReviews.map((review) => {
          const isHelpful = helpful.has(review.id);
          return (
            <View key={review.id} style={[styles.review, { borderBottomColor: colors.border }]}>
              <Avatar name={review.author} imageUri={review.avatarUrl} size="sm" />
              <View style={styles.reviewBody}>
                <View style={styles.reviewTopLine}>
                  <Text style={[PP.label, { color: colors.foreground }]}>{review.author}</Text>
                  {review.verifiedPurchase ? (
                    <View style={styles.verified}>
                      <CheckCircle2 size={13} color="#16A34A" />
                      <Text style={[PP.caption, { color: '#16A34A', marginLeft: 3 }]}>Verified</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewStars}>{'★'.repeat(Math.round(review.rating))}</Text>
                  <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 6 }]}>
                    {review.createdAt}
                  </Text>
                </View>
                {review.foodName ? (
                  <Text style={[PP.caption, { color: colors.primary, marginTop: 4 }]}>
                    {review.foodName}
                  </Text>
                ) : null}
                <Text style={[PP.bodySM, { color: colors.foreground, marginTop: 5 }]}>
                  {review.comment}
                </Text>
                {review.photoCount ? (
                  <View style={styles.photoPlaceholder}>
                    <ImageIcon size={14} color={colors.mutedForeground} />
                    <Text style={[PP.caption, { color: colors.mutedForeground, marginLeft: 4 }]}>
                      Customer photo
                    </Text>
                  </View>
                ) : null}
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={isHelpful ? 'Remove helpful vote' : 'Mark review helpful'}
                  onPress={() =>
                    setHelpful((current) => {
                      const next = new Set(current);
                      if (next.has(review.id)) next.delete(review.id);
                      else next.add(review.id);
                      return next;
                    })
                  }
                  style={styles.helpfulButton}
                >
                  <ThumbsUp size={14} color={isHelpful ? colors.primary : colors.mutedForeground} fill={isHelpful ? colors.primary : 'transparent'} />
                  <Text style={[PP.caption, { color: isHelpful ? colors.primary : colors.mutedForeground, marginLeft: 5 }]}>
                    Helpful {review.helpfulCount + (isHelpful ? 1 : 0)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sortButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12 },
  summary: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 12 },
  averageBlock: { alignItems: 'center', width: 105 },
  distribution: { flex: 1, gap: 5, paddingLeft: 10 },
  distributionRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  barTrack: { height: 6, flex: 1, overflow: 'hidden', borderRadius: 4 },
  barFill: { height: '100%', borderRadius: 4 },
  stars: { color: '#F59E0B', letterSpacing: 1, fontSize: 14, marginTop: 1 },
  review: { flexDirection: 'row', paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth },
  reviewBody: { flex: 1, marginLeft: 11 },
  reviewTopLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  verified: { flexDirection: 'row', alignItems: 'center' },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  reviewStars: { color: '#F59E0B', fontSize: 12, letterSpacing: 1 },
  photoPlaceholder: { flexDirection: 'row', alignItems: 'center', marginTop: 9 },
  helpfulButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 10 },
});