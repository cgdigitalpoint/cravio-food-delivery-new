import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui';
import { useColors } from '@/hooks/useColors';

export function RestaurantSkeleton() {
  const colors = useColors();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Skeleton width="100%" height={250} radius={0} />
      <View style={styles.content}>
        <View className="flex-row items-center">
          <Skeleton width={76} height={76} radius={38} />
          <View style={styles.titleSkeleton}>
            <Skeleton width="72%" height={20} radius={8} />
            <Skeleton width="45%" height={13} radius={6} style={styles.gap} />
          </View>
        </View>
        <Skeleton width="58%" height={16} radius={7} style={styles.infoGap} />
        <View className="flex-row" style={styles.pills}>
          <Skeleton width={92} height={30} radius={15} />
          <Skeleton width={92} height={30} radius={15} />
          <Skeleton width={84} height={30} radius={15} />
        </View>
        <Skeleton width="100%" height={52} radius={0} style={styles.tabs} />
        {[1, 2, 3].map((item) => (
          <View className="flex-row" key={item} style={styles.item}>
            <View className="flex-1">
              <Skeleton width="70%" height={16} radius={7} />
              <Skeleton width="95%" height={12} radius={6} style={styles.gap} />
              <Skeleton width="30%" height={17} radius={7} style={styles.gap} />
            </View>
            <Skeleton width={100} height={100} radius={12} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 20 },
  titleSkeleton: { flex: 1, marginLeft: 16 },
  gap: { marginTop: 8 },
  infoGap: { marginHorizontal: 20, marginTop: 18 },
  pills: { gap: 8, marginHorizontal: 20, marginTop: 16 },
  tabs: { marginTop: 20 },
  item: { gap: 12, marginHorizontal: 16, marginTop: 18 },
});