import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { TIMING } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  team: string;
  score: number;
  color: string;
  active: boolean;
}

/** Wooden score plate. Pulses when its own number changes. */
export function ScorePlate({ team, score, color, active }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const previous = useRef(score);

  useEffect(() => {
    if (previous.current === score) return;
    previous.current = score;
    pulse.setValue(1);
    Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.18,
        duration: TIMING.scorePulse / 2,
        useNativeDriver: true,
      }),
      Animated.spring(pulse, {
        toValue: 1,
        tension: theme.animation.bounce.tension,
        friction: theme.animation.bounce.friction,
        useNativeDriver: true,
      }),
    ]).start();
  }, [score, pulse]);

  return (
    <Animated.View
      style={[
        styles.plate,
        { borderLeftColor: color, borderColor: active ? color : theme.colors.ui.border },
      ]}>
      <Text style={styles.team} numberOfLines={1}>
        {team}
      </Text>
      <Animated.Text style={[styles.score, { color, transform: [{ scale: pulse }] }]}>
        {String(score)}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  plate: {
    width: '100%',
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.primary,
    borderLeftWidth: 4,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#2A3312',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  team: {
    flex: 1,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  score: { fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
});

export default ScorePlate;
