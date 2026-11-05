import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';

interface Props {
  size?: number;
}

/** Vector brand emblem — a fenced paddock drawn from Views, no raster asset. */
export function BrandMark({ size = 148 }: Props) {
  const rail = Math.max(4, Math.round(size * 0.055));
  const post = Math.max(6, Math.round(size * 0.075));
  const postH = Math.round(size * 0.46);

  return (
    <View style={[styles.root, { width: size, height: size, borderRadius: size / 2 }]}>
      <LinearGradient
        colors={theme.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
      />
      <View style={[styles.fence, { width: size * 0.62, height: postH }]}>
        <View style={[styles.rail, { height: rail, top: postH * 0.22 }]} />
        <View style={[styles.rail, { height: rail, top: postH * 0.62 }]} />
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[
              styles.post,
              { width: post, height: postH, left: i * ((size * 0.62 - post) / 2) },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(250,245,236,0.55)',
    shadowColor: '#2A3312',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  fence: { justifyContent: 'center' },
  rail: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 3,
    backgroundColor: theme.colors.earth.cream,
  },
  post: {
    position: 'absolute',
    top: 0,
    borderRadius: 3,
    backgroundColor: theme.colors.earth.woodLight,
    borderWidth: 1,
    borderColor: theme.colors.earth.woodDark,
  },
});

export default BrandMark;
