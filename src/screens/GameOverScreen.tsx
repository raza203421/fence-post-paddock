import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Home, Map as MapIcon, RotateCcw, Unlock } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import IconButton from '../components/IconButton';
import PaddockBoard from '../components/board/PaddockBoard';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatRow from '../components/StatRow';
import { TIMING, miniCellSizeFor } from '../constants/config';
import theme from '../constants/theme';
import { Team, rivalTeamFor, teamById } from '../game/teams';
import { MatchSummary } from '../hooks/useGameState';
import useStore from '../hooks/useStore';

interface Props {
  summary: MatchSummary;
  unlocked: Team | null;
  onPlayAgain: () => void;
  onMenu: () => void;
}

const HEADLINE: Record<MatchSummary['result'], string> = {
  win: 'PADDOCK WON',
  loss: 'COUNTY LOST',
  draw: 'DEAD HEAT',
};

export function GameOverScreen({ summary, unlocked, onPlayAgain, onMenu }: Props) {
  const { records } = useStore();
  const playerTeam = useMemo(() => teamById(records.teamId), [records.teamId]);
  const rivalTeam = useMemo(() => rivalTeamFor(records.teamId), [records.teamId]);

  const overlay =
    summary.result === 'win'
      ? theme.gradients.overWin
      : summary.result === 'loss'
      ? theme.gradients.overLoss
      : theme.gradients.overDraw;

  const pop = useRef(new Animated.Value(0)).current;
  const statsIn = useRef(new Animated.Value(0)).current;
  const ctaIn = useRef(new Animated.Value(0)).current;
  const [litCount, setLitCount] = useState(0);

  const chain = summary.winningChain;
  const miniCell = useMemo(() => miniCellSizeFor(summary.board.size), [summary.board.size]);

  useEffect(() => {
    Animated.sequence([
      Animated.spring(pop, { toValue: 1, tension: 48, friction: 7, useNativeDriver: true }),
      Animated.stagger(90, [
        Animated.timing(statsIn, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(ctaIn, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]),
    ]).start();
  }, [pop, statsIn, ctaIn]);

  /** The deciding chain lights rail by rail, then rests and loops. */
  useEffect(() => {
    if (chain.length === 0) return undefined;
    let step = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      step = step >= chain.length ? 0 : step + 1;
      setLitCount(step);
      timer = setTimeout(tick, step >= chain.length ? TIMING.replayPause : TIMING.replayStep);
    };

    timer = setTimeout(tick, TIMING.replayStep);
    return () => clearTimeout(timer);
  }, [chain]);

  const litGaps = useMemo(() => chain.slice(0, litCount), [chain, litCount]);
  const cardScale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });

  return (
    <AppShell overlay={overlay}>
      <ScreenHeader
        leftSlot={
          <IconButton onPress={onMenu} label="Back to menu" tone="oat">
            <Home size={22} color={theme.colors.text.primary} strokeWidth={2.4} />
          </IconButton>
        }
        title="MATCH RESULT"
      />

      <View style={styles.body}>
        <Text style={styles.headline}>{HEADLINE[summary.result]}</Text>
        <View style={styles.signPlank} />

        <Animated.View
          pointerEvents="none"
          style={[styles.replayCard, { opacity: pop, transform: [{ scale: cardScale }] }]}>
          <PaddockBoard
            state={summary.board}
            cell={miniCell}
            interactive={false}
            playerToken={playerTeam}
            rivalToken={rivalTeam}
            litGaps={litGaps}
          />
        </Animated.View>

        <Animated.View style={[styles.statsWrap, { opacity: statsIn }]} pointerEvents="box-none">
          <StatRow
            items={[
              {
                key: 'you',
                value: summary.playerScore,
                label: 'YOUR PADDOCKS',
                color: theme.colors.earth.sage,
              },
              {
                key: 'rival',
                value: summary.rivalScore,
                label: 'RIVAL',
                color: theme.colors.earth.terracotta,
              },
              {
                key: 'chain',
                value: summary.longestChain,
                label: 'LONGEST CHAIN',
                color: theme.colors.earth.wood,
              },
            ]}
          />
        </Animated.View>

        {unlocked ? (
          <View style={styles.unlockBanner}>
            <Unlock size={20} color={theme.colors.text.primary} strokeWidth={2.4} />
            <Text style={styles.unlockText} numberOfLines={1}>
              {'NEW TEAM: ' + unlocked.name}
            </Text>
          </View>
        ) : null}

        <Animated.View style={[styles.actions, { opacity: ctaIn }]} pointerEvents="box-none">
          <PrimaryButton label="PLAY AGAIN" Icon={RotateCcw} onPress={onPlayAgain} />
          <SecondaryButton
            label="COUNTY MAP"
            Icon={MapIcon}
            tone="onDark"
            onPress={onMenu}
            style={styles.secondary}
          />
        </Animated.View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24, alignItems: 'center' },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    color: theme.colors.text.onDark,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },
  signPlank: {
    marginTop: 12,
    width: 128,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.earth.wood,
  },
  replayCard: {
    marginTop: 16,
    padding: 12,
    borderRadius: 18,
    backgroundColor: theme.colors.bg.primary,
    borderTopWidth: 3,
    borderTopColor: theme.colors.earth.wood,
    shadowColor: '#2A3312',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  statsWrap: { width: '100%', marginTop: 16 },
  unlockBanner: {
    width: '100%',
    height: 56,
    marginTop: 12,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  unlockText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.text.primary,
  },
  actions: { width: '100%', marginTop: 'auto', paddingTop: 16 },
  secondary: { marginTop: 10 },
});

export default GameOverScreen;
