import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Hand, Lightbulb } from 'lucide-react-native';
import { CONTROL_BAR_BOTTOM, CONTROL_BAR_HEIGHT } from '../constants/config';
import theme from '../constants/theme';
import IconButton from './IconButton';

interface Props {
  railsPlaced: number;
  railsTotal: number;
  statusText: string;
  onHint: () => void;
  hintEnabled: boolean;
}

/** G2 floating controls — never overlaps the board, which reserves its height. */
export function FloatingControlBar({
  railsPlaced,
  railsTotal,
  statusText,
  onHint,
  hintEnabled,
}: Props) {
  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        <Text style={styles.caption}>RAILS</Text>
        <Text style={styles.count}>{railsPlaced + ' / ' + railsTotal}</Text>
      </View>

      <View style={styles.center}>
        <Hand size={22} color={theme.colors.earth.sage} strokeWidth={2.2} />
        <Text style={styles.status} numberOfLines={1}>
          {statusText}
        </Text>
      </View>

      <IconButton onPress={onHint} label="Show a hint" size={48} disabled={!hintEnabled} tone="oat">
        <Lightbulb size={22} color={theme.colors.earth.terracotta} strokeWidth={2.2} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: CONTROL_BAR_BOTTOM,
    height: CONTROL_BAR_HEIGHT,
    borderRadius: 18,
    backgroundColor: 'rgba(250,245,236,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(42,51,18,0.16)',
    borderTopWidth: 2,
    borderTopColor: theme.colors.earth.wood,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: '#2A3312',
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  left: { width: 62 },
  caption: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
  },
  count: { fontSize: 16, fontWeight: '800', color: theme.colors.text.primary, marginTop: 2 },
  center: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  status: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: theme.colors.text.primary,
  },
});

export default FloatingControlBar;
