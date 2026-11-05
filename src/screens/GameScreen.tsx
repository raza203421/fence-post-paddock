import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ChevronLeft, Pause } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import FloatingControlBar from '../components/FloatingControlBar';
import IconButton from '../components/IconButton';
import PaddockBoard from '../components/board/PaddockBoard';
import ScorePlate from '../components/ScorePlate';
import ScreenHeader from '../components/ScreenHeader';
import TurnPill from '../components/TurnPill';
import {
  BoardSize,
  CONTROL_BAR_BOTTOM,
  CONTROL_BAR_HEIGHT,
  OpponentId,
  SCORE_STRIP_HEIGHT,
  cellSizeFor,
} from '../constants/config';
import theme from '../constants/theme';
import { PLAYER } from '../game/board';
import { teamById, rivalTeamFor } from '../game/teams';
import useGameState, { MatchSummary } from '../hooks/useGameState';
import useStore from '../hooks/useStore';

interface Props {
  size: BoardSize;
  opponent: OpponentId;
  onGameOver: (summary: MatchSummary) => void;
  onExit: () => void;
}

export function GameScreen({ size, opponent, onGameOver, onExit }: Props) {
  const { records, settings } = useStore();
  const playerTeam = useMemo(() => teamById(records.teamId), [records.teamId]);
  const rivalTeam = useMemo(() => rivalTeamFor(records.teamId), [records.teamId]);

  const game = useGameState({
    size,
    opponent,
    railConfirm: settings.railConfirm,
    hintsEnabled: settings.hints,
    onGameOver,
  });

  const entry = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entry, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [entry]);

  const cell = useMemo(() => cellSizeFor(size), [size]);

  const passAndPlay = opponent === 'FRIEND';
  const playerTurn = game.turn === PLAYER;
  const thinking = game.phase === 'aiThinking';

  const turnLabel = passAndPlay
    ? playerTurn
      ? 'FARMER GREEN'
      : 'FARMER RED'
    : playerTurn
    ? 'YOUR TURN'
    : 'FARMER RED';
  const turnColor = playerTurn ? theme.colors.earth.sage : theme.colors.earth.terracotta;

  const statusText = game.pendingGap
    ? 'TAP AGAIN TO CONFIRM'
    : thinking
    ? 'FARMER RED IS PICKING'
    : 'TAP A GAP';

  const boardScale = entry.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });

  return (
    <AppShell overlay={theme.gradients.gameOverlay}>
      <ScreenHeader
        leftSlot={
          <IconButton onPress={onExit} label="Back to menu" size={44}>
            <ChevronLeft size={20} color={theme.colors.text.primary} strokeWidth={2.6} />
          </IconButton>
        }
        centerSlot={<TurnPill label={turnLabel} color={turnColor} thinking={thinking} />}
        rightSlot={
          <IconButton onPress={onExit} label="Pause" size={44}>
            <Pause size={22} color={theme.colors.text.primary} strokeWidth={2.4} />
          </IconButton>
        }
      />

      <View style={styles.scoreStrip}>
        <View style={styles.scoreSlot}>
          <ScorePlate
            team={passAndPlay ? 'FARMER GREEN' : 'YOUR PADDOCKS'}
            score={game.playerScore}
            color={theme.colors.earth.sage}
            active={playerTurn}
          />
        </View>
        <View style={styles.scoreSlot}>
          <ScorePlate
            team="FARMER RED"
            score={game.rivalScore}
            color={theme.colors.earth.terracotta}
            active={!playerTurn}
          />
        </View>
      </View>

      <View style={styles.boardArea}>
        <Animated.View
          pointerEvents={game.boardLocked ? 'none' : 'box-none'}
          style={{ opacity: entry, transform: [{ scale: boardScale }] }}>
          <PaddockBoard
            state={game.board}
            cell={cell}
            interactive={!game.boardLocked}
            playerToken={playerTeam}
            rivalToken={rivalTeam}
            onTapGap={game.tapGap}
            pendingGap={game.pendingGap}
            hintGapId={game.hint}
            animatePosts
          />
        </Animated.View>
      </View>

      <FloatingControlBar
        railsPlaced={game.railsPlaced}
        railsTotal={game.railsTotal}
        statusText={statusText}
        onHint={game.requestHint}
        hintEnabled={settings.hints && !game.boardLocked}
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  scoreStrip: {
    height: SCORE_STRIP_HEIGHT,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  scoreSlot: { flex: 1 },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: CONTROL_BAR_HEIGHT + CONTROL_BAR_BOTTOM + 16,
  },
});

export default GameScreen;
