import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

interface Props {
  label: string;
  value: boolean;
  onToggle: () => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function ToggleRow({ label, value, onToggle }: Props) {
  const knob = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(knob, {
      toValue: value ? 1 : 0,
      tension: theme.animation.spring.tension,
      friction: theme.animation.spring.friction,
      useNativeDriver: true,
    }).start();
  }, [value, knob]);

  const translateX = knob.interpolate({ inputRange: [0, 1], outputRange: [0, 22] });

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={styles.row}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={[styles.track, value ? styles.trackOn : styles.trackOff]}>
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.primary,
  },
  track: { width: 52, height: 30, borderRadius: 15, padding: 3, justifyContent: 'center' },
  trackOn: { backgroundColor: theme.colors.earth.sage },
  trackOff: { backgroundColor: theme.colors.bg.accent },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.bg.primary,
    shadowColor: '#2A3312',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});

export default ToggleRow;
