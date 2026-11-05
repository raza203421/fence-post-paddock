import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import StatCard, { StatItem } from './StatCard';

interface Props {
  items: StatItem[];
  style?: ViewStyle;
}

/** A lone pill looks orphaned — the whole row is dropped below two visible items. */
export function StatRow({ items, style }: Props) {
  const visible = items.filter(item => item.value > 0);
  if (visible.length < 2) return null;

  return (
    <View style={[styles.row, style]}>
      {visible.map(item => (
        <View key={item.key} style={styles.slot}>
          <StatCard
            value={item.value}
            label={item.label}
            valueColor={item.color}
            display={item.display}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  slot: { flex: 1 },
});

export default StatRow;
