import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import TeamToken from './TeamToken';
import usePressScale from '../hooks/usePressScale';
import theme from '../constants/theme';

interface Props {
  color: string;
  initial: string;
  name: string;
  locked: boolean;
  unlockText: string;
  selected: boolean;
  onPress: () => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function TeamTile({ color, initial, name, locked, unlockText, selected, onPress }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          selected ? styles.selected : null,
          locked ? styles.locked : null,
          { transform: [{ scale }] },
        ]}>
        <TeamToken color={color} initial={initial} size={54} style={styles.token} />
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {locked ? unlockText : selected ? 'IN THE FIELD' : 'READY'}
        </Text>
        {locked ? (
          <View style={styles.lockBadge}>
            <Lock size={14} color={theme.colors.text.onDark} strokeWidth={2.6} />
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '48%', height: 132 },
  tile: {
    width: '100%',
    height: 132,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1.5,
    borderColor: theme.colors.ui.border,
    borderTopWidth: 3,
    borderTopColor: theme.colors.earth.wood,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  selected: { borderColor: theme.colors.earth.sage, backgroundColor: theme.colors.bg.meadow },
  locked: { opacity: 0.55 },
  token: { marginBottom: 6 },
  name: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: theme.colors.text.primary },
  sub: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.1,
    color: theme.colors.text.secondary,
  },
  lockBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.earth.woodDark,
  },
});

export default TeamTile;
