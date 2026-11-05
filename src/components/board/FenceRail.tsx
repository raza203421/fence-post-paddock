import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TIMING } from '../../constants/config';
import theme from '../../constants/theme';
import { Orientation } from '../../game/board';

export type RailState = 'empty' | 'hint' | 'pending' | 'placed' | 'wall';

interface Props {
  orientation: Orientation;
  left: number;
  top: number;
  width: number;
  height: number;
  state: RailState;
  ownerColor?: string;
  lit?: boolean;
}

function FenceRailBase({
  orientation,
  left,
  top,
  width,
  height,
  state,
  ownerColor,
  lit = false,
}: Props) {
  const horizontal = orientation === 'h';
  const grow = useRef(new Animated.Value(state === 'placed' ? 0 : 1)).current;
  const pulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (state !== 'placed') return;
    grow.setValue(0.15);
    Animated.timing(grow, {
      toValue: 1,
      duration: TIMING.railSlide,
      useNativeDriver: true,
    }).start();
  }, [state, grow]);

  useEffect(() => {
    if (state !== 'hint') return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.3, duration: 450, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state, pulse]);

  const base = { position: 'absolute' as const, left, top, width, height, borderRadius: 3 };

  if (state === 'empty') {
    return <Animated.View pointerEvents="none" style={[base, styles.empty]} />;
  }

  if (state === 'wall') {
    return <Animated.View pointerEvents="none" style={[base, styles.wall]} />;
  }

  if (state === 'hint') {
    return (
      <Animated.View
        pointerEvents="none"
        style={[base, styles.hint, { opacity: pulse }]}
      />
    );
  }

  if (state === 'pending') {
    return <Animated.View pointerEvents="none" style={[base, styles.pending]} />;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        base,
        styles.placedWrap,
        {
          opacity: grow,
          transform: horizontal ? [{ scaleX: grow }] : [{ scaleY: grow }],
        },
      ]}>
      <LinearGradient
        colors={theme.gradients.plank}
        start={{ x: 0, y: 0 }}
        end={horizontal ? { x: 0, y: 1 } : { x: 1, y: 0 }}
        style={styles.plank}
      />
      <Animated.View
        style={[
          styles.edge,
          horizontal
            ? { left: 0, right: 0, top: 0, height: 1.5 }
            : { top: 0, bottom: 0, left: 0, width: 1.5 },
          { backgroundColor: ownerColor ?? theme.colors.earth.woodLight },
        ]}
      />
      {lit ? <Animated.View style={styles.lit} /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  empty: { backgroundColor: 'rgba(42,51,18,0.08)' },
  wall: { backgroundColor: 'rgba(0,85,139,0.22)' },
  hint: { backgroundColor: 'rgba(92,127,44,0.55)' },
  pending: {
    backgroundColor: 'rgba(138,106,63,0.45)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.earth.terracotta,
    opacity: 0.75,
  },
  placedWrap: { overflow: 'hidden', zIndex: 2 },
  plank: { flex: 1, borderRadius: 3 },
  edge: { position: 'absolute', opacity: 0.9 },
  lit: {
    position: 'absolute',
    left: -1,
    right: -1,
    top: -1,
    bottom: -1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#F3EFDE',
  },
});

export const FenceRail = memo(FenceRailBase);
export default FenceRail;
