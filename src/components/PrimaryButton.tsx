import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import usePressScale from '../hooks/usePressScale';
import theme from '../constants/theme';

/** Any lucide icon component: they take size / color / strokeWidth. */
export type ButtonIcon = React.ComponentType<any>;

interface Props {
  label: string;
  onPress: () => void;
  Icon?: ButtonIcon;
  disabled?: boolean;
  style?: ViewStyle;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/** Hand-cut plank CTA. Icon is a fixed 24x24 box, label lineHeight matches it. */
export function PrimaryButton({ label, onPress, Icon, disabled = false, style }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, disabled ? styles.disabled : null, style]}>
      <Animated.View pointerEvents="box-none" style={[styles.wrap, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.grad}>
          <View style={styles.row}>
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={ICON} color={theme.colors.text.onDark} strokeWidth={2.4} />
              </View>
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 62 },
  wrap: {
    width: '100%',
    height: 62,
    borderRadius: theme.radius.lg,
    shadowColor: '#44611F',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  grad: {
    flex: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: '#3C5417',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  iconBox: { width: ICON, height: ICON, alignItems: 'center', justifyContent: 'center' },
  label: {
    lineHeight: ICON,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.onDark,
  },
  disabled: { opacity: 0.45 },
});

export default PrimaryButton;
