import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import usePressScale from '../hooks/usePressScale';
import theme from '../constants/theme';
import type { ButtonIcon } from './PrimaryButton';

interface Props {
  label: string;
  onPress: () => void;
  Icon?: ButtonIcon;
  tone?: 'oat' | 'onDark';
  style?: ViewStyle;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/** Same icon box and lineHeight as PrimaryButton — sizes never drift. */
export function SecondaryButton({ label, onPress, Icon, tone = 'oat', style }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);
  const onDark = tone === 'onDark';
  const textColor = onDark ? theme.colors.text.onDark : theme.colors.text.primary;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.wrap,
          onDark ? styles.wrapDark : styles.wrapOat,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON} color={textColor} strokeWidth={2.2} />
            </View>
          ) : null}
          <Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 48 },
  wrap: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  wrapOat: {
    backgroundColor: theme.colors.bg.tertiary,
    borderColor: theme.colors.ui.border,
  },
  wrapDark: {
    backgroundColor: 'rgba(250,245,236,0.16)',
    borderColor: 'rgba(243,239,222,0.35)',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  iconBox: { width: ICON, height: ICON, alignItems: 'center', justifyContent: 'center' },
  label: { lineHeight: ICON, fontSize: 13, fontWeight: '800', letterSpacing: 1.4 },
});

export default SecondaryButton;
