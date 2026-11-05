import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

export interface Tip {
  id: string;
  title: string;
  body: string;
  /** Which of the four rails around a 2x2 sketch are already hammered in. */
  rails: Array<'top' | 'bottom' | 'left' | 'right'>;
  claimed: boolean;
}

export const TIPS: Tip[] = [
  {
    id: 'third',
    title: 'NEVER PLACE THE THIRD RAIL',
    body: 'Two rails on a paddock is safe. A third hands it straight to the other farmer.',
    rails: ['top', 'left'],
    claimed: false,
  },
  {
    id: 'count',
    title: 'COUNT THE CHAIN',
    body: 'Paddocks with two rails link into chains. Whoever opens one gives away all of it.',
    rails: ['top', 'left', 'bottom'],
    claimed: false,
  },
  {
    id: 'short',
    title: 'GIVE AWAY THE SHORT CHAIN',
    body: 'When every move opens something, open the smallest chain on the meadow.',
    rails: ['top', 'bottom'],
    claimed: false,
  },
  {
    id: 'double',
    title: 'THE DOUBLE CROSS',
    body: 'Leave the last two paddocks of a long chain and the turn comes back to you.',
    rails: ['top', 'left', 'bottom', 'right'],
    claimed: true,
  },
];

const SIZE = 46;
const THICK = 6;
const POST = 10;

/** A 2x2 instructional sketch built from the same post and rail primitives. */
export function MiniBoardTip({ tip }: { tip: Tip }) {
  const has = (side: Tip['rails'][number]) => tip.rails.indexOf(side) !== -1;

  return (
    <View style={styles.row}>
      <View style={styles.board}>
        <View
          style={[
            styles.cell,
            tip.claimed ? { backgroundColor: 'rgba(92,127,44,0.3)' } : null,
          ]}
        />
        <View style={[styles.hRail, { top: 0 }, has('top') ? styles.on : styles.off]} />
        <View style={[styles.hRail, { bottom: 0 }, has('bottom') ? styles.on : styles.off]} />
        <View style={[styles.vRail, { left: 0 }, has('left') ? styles.on : styles.off]} />
        <View style={[styles.vRail, { right: 0 }, has('right') ? styles.on : styles.off]} />
        <View style={[styles.post, { left: -POST / 2, top: -POST / 2 }]} />
        <View style={[styles.post, { right: -POST / 2, top: -POST / 2 }]} />
        <View style={[styles.post, { left: -POST / 2, bottom: -POST / 2 }]} />
        <View style={[styles.post, { right: -POST / 2, bottom: -POST / 2 }]} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{tip.title}</Text>
        <Text style={styles.body}>{tip.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  board: { width: SIZE, height: SIZE, backgroundColor: theme.colors.bg.felt, borderRadius: 4 },
  cell: { ...StyleSheet.absoluteFillObject, borderRadius: 4 },
  hRail: { position: 'absolute', left: THICK, right: THICK, height: THICK, borderRadius: 2 },
  vRail: { position: 'absolute', top: THICK, bottom: THICK, width: THICK, borderRadius: 2 },
  on: { backgroundColor: theme.colors.earth.wood },
  off: { backgroundColor: 'rgba(42,51,18,0.12)' },
  post: {
    position: 'absolute',
    width: POST,
    height: POST,
    borderRadius: POST / 2,
    backgroundColor: theme.colors.earth.woodDark,
  },
  text: { flex: 1 },
  title: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.earth.sage,
    marginBottom: 4,
  },
  body: { fontSize: 12, lineHeight: 17, fontWeight: '400', color: theme.colors.text.secondary },
});

export default MiniBoardTip;
