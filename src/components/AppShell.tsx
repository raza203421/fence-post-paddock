import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  overlay: string[];
  children: React.ReactNode;
}

/**
 * The base meadow gradient is drawn in code; each screen stacks its own
 * gradient overlay on top so Loader / Menu / Game / GameOver read apart.
 */
export function AppShell({ overlay, children }: Props) {
  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.bg}>
        <LinearGradient
          colors={BASE}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.horizon} />
        <LinearGradient colors={overlay} style={StyleSheet.absoluteFill} />
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const BASE = ['#2E4418', '#44611F', '#6E9636', '#8FB24E'];

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A2610' },
  bg: { flex: 1, width: '100%', height: '100%', overflow: 'hidden' },
  horizon: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '46%',
    height: 2,
    backgroundColor: 'rgba(250,245,236,0.14)',
  },
  content: { flex: 1 },
});

export default AppShell;
