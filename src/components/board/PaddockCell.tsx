import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { TIMING } from '../../constants/config';
import theme from '../../constants/theme';
import { CellKind } from '../../game/board';
import TeamToken from '../TeamToken';

interface Props {
  kind: CellKind;
  owner: 0 | 1 | 2;
  left: number;
  top: number;
  size: number;
  ownerColor: string;
  tokenInitial?: string;
  showBadge: boolean;
}

function PaddockCellBase({
  kind,
  owner,
  left,
  top,
  size,
  ownerColor,
  tokenInitial,
  showBadge,
}: Props) {
  const flood = useRef(new Animated.Value(owner ? 1 : 0)).current;
  const drop = useRef(new Animated.Value(owner ? 1 : 0)).current;

  useEffect(() => {
    if (!owner) {
      flood.setValue(0);
      drop.setValue(0);
      return;
    }
    flood.setValue(0);
    drop.setValue(0);
    Animated.sequence([
      Animated.timing(flood, {
        toValue: 1,
        duration: TIMING.claimFlood,
        useNativeDriver: true,
      }),
      Animated.spring(drop, {
        toValue: 1,
        tension: theme.animation.bounce.tension,
        friction: theme.animation.bounce.friction,
        useNativeDriver: true,
      }),
    ]).start();
  }, [owner, flood, drop]);

  const base = { position: 'absolute' as const, left, top, width: size, height: size };

  if (kind === 'pond') {
    const ripple = Math.round(size * 0.52);
    return (
      <View pointerEvents="none" style={[base, styles.pond]}>
        <View style={[styles.ripple, { width: ripple, height: ripple, borderRadius: ripple / 2 }]} />
        <View
          style={[
            styles.ripple,
            {
              width: ripple * 0.6,
              height: ripple * 0.6,
              borderRadius: ripple * 0.3,
              position: 'absolute',
            },
          ]}
        />
      </View>
    );
  }

  const tokenSize = Math.max(14, size - 14);
  const dropOffset = drop.interpolate({
    inputRange: [0, 1],
    outputRange: [-size * 0.5, 0],
  });

  return (
    <View pointerEvents="none" style={[base, styles.cell]}>
      {kind === 'bonus' ? <View style={styles.bonusFill} /> : null}
      {owner ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.claimed,
            {
              backgroundColor: ownerColor,
              borderColor: ownerColor,
              opacity: flood.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }),
            },
          ]}
        />
      ) : null}
      {owner && tokenInitial ? (
        <Animated.View
          style={{
            opacity: drop,
            transform: [{ translateY: dropOffset }, { scale: drop }],
          }}>
          <TeamToken color={ownerColor} initial={tokenInitial} size={tokenSize} />
        </Animated.View>
      ) : null}
      {showBadge && kind === 'bonus' && !owner ? (
        <View style={styles.badge}>
          <Star size={12} color={theme.colors.earth.terracotta} strokeWidth={2.5} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { alignItems: 'center', justifyContent: 'center', zIndex: 1, borderRadius: 4 },
  bonusFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(216,201,155,0.45)',
    borderRadius: 4,
  },
  claimed: { borderRadius: 4, borderWidth: 2 },
  pond: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(157,206,219,0.55)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.earth.pondInk,
  },
  ripple: { borderWidth: 1, borderColor: 'rgba(0,85,139,0.35)' },
  badge: { position: 'absolute', right: 8, bottom: 8 },
});

export const PaddockCell = memo(PaddockCellBase);
export default PaddockCell;
