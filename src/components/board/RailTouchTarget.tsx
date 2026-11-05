import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MIN_TOUCH } from '../../constants/config';

interface Props {
  gapId: string;
  left: number;
  top: number;
  width: number;
  height: number;
  onPress: (gapId: string) => void;
}

const slopFor = (side: number) => Math.max(8, Math.ceil((MIN_TOUCH - side) / 2));

/**
 * Invisible tap zone over a rail gap. The visible plank stays slim while
 * hitSlop guarantees at least a 48x48 touch box.
 */
function RailTouchTargetBase({ gapId, left, top, width, height, onPress }: Props) {
  const handlePress = useCallback(() => onPress(gapId), [gapId, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{
        top: slopFor(height),
        bottom: slopFor(height),
        left: slopFor(width),
        right: slopFor(width),
      }}
      accessibilityRole="button"
      accessibilityLabel={'Place rail ' + gapId}
      style={[styles.target, { left, top, width, height }]}
    />
  );
}

const styles = StyleSheet.create({
  target: { position: 'absolute', backgroundColor: 'transparent', zIndex: 4 },
});

export const RailTouchTarget = memo(RailTouchTargetBase);
export default RailTouchTarget;
