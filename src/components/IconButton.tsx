import React from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, ViewStyle } from 'react-native';
import usePressScale from '../hooks/usePressScale';
import theme from '../constants/theme';

interface Props {
  onPress: () => void;
  label: string;
  size?: number;
  source?: ImageSourcePropType;
  children?: React.ReactNode;
  tone?: 'parchment' | 'oat';
  style?: ViewStyle;
  disabled?: boolean;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Round 44x44 control. Explicit width AND height — never intrinsic sizing. */
export function IconButton({
  onPress,
  label,
  size = 44,
  source,
  children,
  tone = 'parchment',
  style,
  disabled = false,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);
  const bg = tone === 'oat' ? theme.colors.bg.accent : 'rgba(250,245,236,0.90)';

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[{ width: size, height: size }, disabled ? styles.disabled : null, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.inner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bg,
            transform: [{ scale }],
          },
        ]}>
        {source ? (
          <Image source={source} style={styles.glyph} resizeMode="contain" />
        ) : (
          children
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(42,51,18,0.18)',
    shadowColor: '#2A3312',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  glyph: { width: 24, height: 24 },
  disabled: { opacity: 0.4 },
});

export default IconButton;
