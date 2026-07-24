import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { useColors } from '@/hooks/useColors';
import { PP } from '@/theme/poppins';

interface RestaurantLogoProps {
  name: string;
  imageUri?: string;
  size?: number;
}

export function RestaurantLogo({ name, imageUri, size = 76 }: RestaurantLogoProps) {
  const colors = useColors();
  const initial = name.trim().charAt(0).toUpperCase() || 'C';

  return (
    <View
      className="items-center justify-center overflow-hidden"
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.card,
          borderColor: colors.card,
        },
      ]}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          contentFit="cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <Text style={[PP.h2, { color: colors.primary }]}>{initial}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
});