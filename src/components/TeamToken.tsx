import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface Props {
  color: string;
  initial: string;
  size?: number;
  style?: ViewStyle;
}

/** Team marker — a colored disc with an ASCII initial. Replaces the sprite PNGs. */
export function TeamToken({ color, initial, size = 54, style }: Props) {
  return (
    <View
      style={[
        styles.disc,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: Math.max(1.5, size * 0.055),
        },
        style,
      ]}>
      <Text style={[styles.letter, { fontSize: Math.round(size * 0.46), lineHeight: Math.round(size * 0.56) }]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(250,245,236,0.78)',
  },
  letter: {
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FAF5EC',
    textAlign: 'center',
  },
});

export default TeamToken;
