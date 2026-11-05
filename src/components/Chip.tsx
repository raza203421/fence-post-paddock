import React from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import usePressScale from '../hooks/usePressScale';
import theme from '../constants/theme';

interface Props {
  label: string;
  active: boolean;
  accent?: string;
  onPress: () => void;
  style?: ViewStyle;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function Chip({ label, active, accent = theme.colors.earth.sage, onPress, style }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.chip,
          active
            ? { backgroundColor: theme.colors.bg.meadow, borderWidth: 2, borderColor: accent }
            : styles.inactive,
          { transform: [{ scale }] },
        ]}>
        <Text
          style={[styles.label, { color: active ? accent : theme.colors.text.secondary }]}
          numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { flex: 1, height: 44 },
  chip: {
    width: '100%',
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '800', letterSpacing: 1.2 },
});

export default Chip;
