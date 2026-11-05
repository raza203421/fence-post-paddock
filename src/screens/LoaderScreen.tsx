import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppShell from '../components/AppShell';
import BrandMark from '../components/BrandMark';
import { LOADER_DURATION_MS, SCREEN_H, SCREEN_W, TIMING } from '../constants/config';
import theme from '../constants/theme';

const BAR_W = 212;
const FIREFLIES = 14;

interface Props {
  onDone: () => void;
}

/** Dusk version of the meadow — deliberately far darker than the Menu. */
export function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const fireflies = useMemo(
    () =>
      Array.from({ length: FIREFLIES }, (_, i) => ({
        key: 'f' + i,
        left: ((i * 97) % 90) * (SCREEN_W / 100) + 10,
        top: ((i * 53) % 55) * (SCREEN_H / 100) + 40,
        size: 3 + (i % 3),
      })),
    [],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 520, useNativeDriver: true }),
      Animated.spring(rise, {
        toValue: 1,
        tension: 52,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // width cannot run on the native driver
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(exit, {
        toValue: 0,
        duration: TIMING.screenFade,
        useNativeDriver: true,
      }).start(() => doneRef.current());
    }, LOADER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [fade, rise, progress, exit]);

  const logoScale = rise.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] });
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <AppShell overlay={theme.gradients.loaderOverlay}>
      <View style={styles.decor} pointerEvents="none">
        {fireflies.map(f => (
          <View
            key={f.key}
            style={[
              styles.firefly,
              { left: f.left, top: f.top, width: f.size, height: f.size, borderRadius: f.size / 2 },
            ]}
          />
        ))}
        <View style={styles.horizon} />
      </View>

      <Animated.View style={[styles.content, { opacity: exit }]} pointerEvents="none">
        <Animated.View style={{ opacity: fade, transform: [{ scale: logoScale }] }}>
          <View style={styles.logo}>
            <BrandMark size={148} />
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fade }}>
          <Text style={styles.brandTop}>FENCE POST</Text>
          <Text style={styles.brandBottom}>PADDOCK</Text>
          <Text style={styles.subtitle}>COUNTY FENCING LEAGUE</Text>
        </Animated.View>

        <View style={styles.barBlock}>
          <View style={styles.track}>
            <Animated.View style={[styles.fillWrap, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.loaderBar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.fill}
              />
            </Animated.View>
            <View style={[styles.miniPost, { left: 28 }]} />
            <View style={[styles.miniPost, { left: 102 }]} />
            <View style={[styles.miniPost, { left: 176 }]} />
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  decor: { ...StyleSheet.absoluteFillObject },
  firefly: { position: 'absolute', backgroundColor: 'rgba(216,201,155,0.22)' },
  horizon: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: SCREEN_H * 0.62,
    height: 2,
    backgroundColor: 'rgba(92,127,44,0.35)',
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logo: { alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  brandTop: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    color: '#F3EFDE',
  },
  brandBottom: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 10,
    textAlign: 'center',
    color: theme.colors.earth.terracotta,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    textAlign: 'center',
    color: 'rgba(243,239,222,0.62)',
  },
  barBlock: { marginTop: 44, alignItems: 'center' },
  track: {
    width: BAR_W,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(243,239,222,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(243,239,222,0.18)',
    overflow: 'visible',
  },
  fillWrap: { height: '100%', borderRadius: 4, overflow: 'hidden' },
  fill: { flex: 1 },
  miniPost: {
    position: 'absolute',
    bottom: 7,
    width: 6,
    height: 18,
    borderRadius: 3,
    backgroundColor: '#8A6A3F',
  },
  loading: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 4,
    color: 'rgba(243,239,222,0.5)',
  },
});

export default LoaderScreen;
