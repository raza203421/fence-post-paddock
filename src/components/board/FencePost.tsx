import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import theme from '../../constants/theme';

interface Props {
  left: number;
  top: number;
  size: number;
  delay: number;
  animate: boolean;
}

/** A stubby wooden peg with a dark ring and a highlight dot. */
function FencePostBase({ left, top, size, delay, animate }: Props) {
  const pop = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (!animate) return;
    Animated.spring(pop, {
      toValue: 1,
      delay,
      tension: theme.animation.pop.tension,
      friction: theme.animation.pop.friction,
      useNativeDriver: true,
    }).start();
  }, [animate, delay, pop]);

  const dot = Math.max(3, Math.round(size * 0.28));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.post,
        {
          left,
          top,
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale: pop }],
        },
      ]}>
      <Animated.View
        style={[
          styles.highlight,
          { width: dot, height: dot, borderRadius: dot / 2, left: size * 0.18, top: size * 0.16 },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  post: {
    position: 'absolute',
    backgroundColor: theme.colors.earth.wood,
    borderWidth: 2,
    borderColor: theme.colors.earth.woodDark,
    zIndex: 3,
  },
  highlight: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.45)' },
});

export const FencePost = memo(FencePostBase);
export default FencePost;
