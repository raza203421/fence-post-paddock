import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { TIMING } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  label: string;
  color: string;
  thinking: boolean;
}

export function TurnPill({ label, color, thinking }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    pulse.setValue(1);
    fade.setValue(0.45);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 110, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 110, useNativeDriver: true }),
      ]),
      Animated.timing(fade, {
        toValue: 1,
        duration: TIMING.turnSwap,
        useNativeDriver: true,
      }),
    ]).start();
  }, [label, color, pulse, fade]);

  return (
    <Animated.View
      style={[
        styles.pill,
        { backgroundColor: color + '2E', borderColor: color, opacity: fade, transform: [{ scale: pulse }] },
      ]}>
      <Animated.View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {thinking ? label + ' THINKING' : label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.bg.primary,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 12, lineHeight: 20, fontWeight: '800', letterSpacing: 1.2 },
});

export default TurnPill;
