import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BOARD_BORDER, BOARD_PAD } from '../../constants/config';
import theme from '../../constants/theme';
import { BoardState, EMPTY, WALL, gapId } from '../../game/board';
import FencePost from './FencePost';
import FenceRail, { RailState } from './FenceRail';
import PaddockCell from './PaddockCell';
import RailTouchTarget from './RailTouchTarget';

interface Props {
  state: BoardState;
  cell: number;
  interactive: boolean;
  playerToken: { color: string; initial: string };
  rivalToken: { color: string; initial: string };
  onTapGap?: (gapId: string) => void;
  pendingGap?: string | null;
  hintGapId?: string | null;
  litGaps?: string[];
  animatePosts?: boolean;
  style?: ViewStyle;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.round(value)));

/**
 * Owns the whole board geometry. The outer View carries the 3px wooden border;
 * the inner View is the content box every absolute child is measured against,
 * so a rail can never stick out past the frame.
 */
export function PaddockBoard({
  state,
  cell,
  interactive,
  playerToken,
  rivalToken,
  onTapGap,
  pendingGap,
  hintGapId,
  litGaps,
  animatePosts = false,
  style,
}: Props) {
  const n = state.size;
  const post = clamp(cell * 0.24, 8, 14);
  const thick = clamp(cell * 0.18, 5, 10);
  const inner = cell * n + 2 * BOARD_PAD;
  const outer = inner + 2 * BOARD_BORDER;

  const colors = useMemo(
    () => [theme.colors.earth.sage, theme.colors.earth.terracotta],
    [],
  );

  const posts = [];
  for (let r = 0; r <= n; r++) {
    for (let c = 0; c <= n; c++) {
      posts.push(
        <FencePost
          key={'p' + r + '-' + c}
          left={BOARD_PAD + c * cell - post / 2}
          top={BOARD_PAD + r * cell - post / 2}
          size={post}
          delay={(r + c) * 18}
          animate={animatePosts}
        />,
      );
    }
  }

  const cells = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const owner = state.owner[r][c];
      cells.push(
        <PaddockCell
          key={'c' + r + '-' + c}
          kind={state.kind[r][c]}
          owner={owner}
          left={BOARD_PAD + c * cell + 1}
          top={BOARD_PAD + r * cell + 1}
          size={cell - 2}
          ownerColor={owner === 2 ? colors[1] : colors[0]}
          tokenInitial={(owner === 2 ? rivalToken : playerToken).initial}
          showBadge={cell >= 34}
        />,
      );
    }
  }

  const rails = [];
  const targets = [];

  const railStateFor = (id: string, value: number): RailState => {
    if (value === WALL) return 'wall';
    if (value !== EMPTY) return 'placed';
    if (pendingGap === id) return 'pending';
    if (hintGapId === id) return 'hint';
    return 'empty';
  };

  for (let r = 0; r <= n; r++) {
    for (let c = 0; c < n; c++) {
      const id = gapId('h', r, c);
      const value = state.h[r][c];
      const kind = railStateFor(id, value);
      const left = BOARD_PAD + c * cell + thick / 2;
      const top = BOARD_PAD + r * cell - thick / 2;
      const width = cell - thick;
      rails.push(
        <FenceRail
          key={id}
          orientation="h"
          left={left}
          top={top}
          width={width}
          height={thick}
          state={kind}
          ownerColor={value === 1 ? colors[0] : value === 2 ? colors[1] : undefined}
          lit={litGaps ? litGaps.indexOf(id) !== -1 : false}
        />,
      );
      if (interactive && value === EMPTY && onTapGap) {
        targets.push(
          <RailTouchTarget
            key={'t' + id}
            gapId={id}
            left={left}
            top={top}
            width={width}
            height={thick}
            onPress={onTapGap}
          />,
        );
      }
    }
  }

  for (let r = 0; r < n; r++) {
    for (let c = 0; c <= n; c++) {
      const id = gapId('v', r, c);
      const value = state.v[r][c];
      const kind = railStateFor(id, value);
      const left = BOARD_PAD + c * cell - thick / 2;
      const top = BOARD_PAD + r * cell + thick / 2;
      const height = cell - thick;
      rails.push(
        <FenceRail
          key={id}
          orientation="v"
          left={left}
          top={top}
          width={thick}
          height={height}
          state={kind}
          ownerColor={value === 1 ? colors[0] : value === 2 ? colors[1] : undefined}
          lit={litGaps ? litGaps.indexOf(id) !== -1 : false}
        />,
      );
      if (interactive && value === EMPTY && onTapGap) {
        targets.push(
          <RailTouchTarget
            key={'t' + id}
            gapId={id}
            left={left}
            top={top}
            width={thick}
            height={height}
            onPress={onTapGap}
          />,
        );
      }
    }
  }

  return (
    <View style={[styles.frame, { width: outer, height: outer }, style]}>
      <View style={styles.topHighlight} />
      <View style={styles.inner}>
        {cells}
        {rails}
        {posts}
        {targets}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 14,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.earth.wood,
    backgroundColor: theme.colors.bg.felt,
    shadowColor: '#2A3312',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    overflow: 'hidden',
  },
  topHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 5,
  },
  inner: { flex: 1 },
});

export default PaddockBoard;
