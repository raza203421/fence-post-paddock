import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export interface StatItem {
  key: string;
  value: number;
  label: string;
  color: string;
  display?: string;
}

interface Props {
  value: number;
  label: string;
  valueColor: string;
  display?: string;
}

/**
 * No raster icon: an accent dot carries the semantics, the number carries the
 * weight. Identical on Menu and GameOver. `width: '100%'` inside a flex:1 slot.
 */
export function StatCard({ value, label, valueColor, display }: Props) {
  if (!value) return null;

  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.accentDot, { backgroundColor: valueColor }]} />
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {display ?? String(value)}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    backgroundColor: theme.colors.bg.primary,
    borderTopWidth: 3,
    borderTopColor: theme.colors.earth.wood,
  },
  accentDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 6 },
  value: { fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
});

export default StatCard;
