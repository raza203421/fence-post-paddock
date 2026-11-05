import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ClipboardList, Play, Settings as SettingsIcon, Trophy } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import BrandMark from '../components/BrandMark';
import Chip from '../components/Chip';
import IconButton from '../components/IconButton';
import MiniBoardTip, { TIPS } from '../components/MiniBoardTip';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import SheetModal from '../components/SheetModal';
import StatRow from '../components/StatRow';
import TeamTile from '../components/TeamTile';
import TeamToken from '../components/TeamToken';
import ToggleRow from '../components/ToggleRow';
import {
  BOARD_SIZES,
  BoardSize,
  LEAGUE_TOTAL,
  OPPONENTS,
  OpponentId,
  TIMING,
} from '../constants/config';
import theme from '../constants/theme';
import { TEAMS, isUnlocked } from '../game/teams';
import { resetRecords, setSetting, setTeam } from '../game/storage';
import useStore from '../hooks/useStore';

type PanelId = 'teams' | 'records' | 'barn' | 'settings';

interface Props {
  size: BoardSize;
  opponent: OpponentId;
  onSizeChange: (size: BoardSize) => void;
  onOpponentChange: (opponent: OpponentId) => void;
  onStart: () => void;
}

const SIZE_LABEL: Record<number, string> = { 4: '4 x 4', 5: '5 x 5', 6: '6 x 6' };

export function MenuScreen({ size, opponent, onSizeChange, onOpponentChange, onStart }: Props) {
  const { records, settings } = useStore();
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const slide = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 1,
      duration: TIMING.sheetSlide,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1300, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [slide, float]);

  const closePanel = useCallback(() => {
    setPanel(null);
    setConfirmReset(false);
  }, []);

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetRecords();
    setConfirmReset(false);
  }, [confirmReset]);

  const sheetY = slide.interpolate({ inputRange: [0, 1], outputRange: [70, 0] });
  const floatY = float.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] });

  return (
    <AppShell overlay={theme.gradients.menuOverlay}>
      <ScreenHeader
        leftSlot={
          <IconButton onPress={() => setPanel('records')} label="Records" tone="oat">
            <ClipboardList size={24} color={theme.colors.text.primary} strokeWidth={2.2} />
          </IconButton>
        }
        rightSlot={
          <View style={styles.leaguePill}>
            <Trophy size={18} color={theme.colors.earth.sage} strokeWidth={2.4} />
            <Text style={styles.leagueText}>
              {'LEAGUE ' + records.leagueIndex + ' / ' + LEAGUE_TOTAL}
            </Text>
          </View>
        }
      />

      <View style={styles.art}>
        <Animated.View style={{ transform: [{ translateY: floatY }] }}>
          <BrandMark size={104} />
        </Animated.View>
        <View style={styles.teamStrip}>
          {TEAMS.map(team => (
            <View key={team.id} style={styles.teamSlot}>
              <TeamToken color={team.color} initial={team.initial} size={32} />
            </View>
          ))}
        </View>
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, { opacity: slide, transform: [{ translateY: sheetY }] }]}>
        <View style={styles.settingsSlot}>
          <IconButton onPress={() => setPanel('settings')} label="Settings" size={44} tone="oat">
            <SettingsIcon size={20} color={theme.colors.text.primary} strokeWidth={2.2} />
          </IconButton>
        </View>

        <Text style={styles.title}>FENCE POST PADDOCK</Text>
        <Text style={styles.tagline}>CLOSE A SQUARE, CLAIM THE FIELD</Text>

        <StatRow
          style={styles.stats}
          items={[
            { key: 'won', value: records.wins, label: 'WON', color: theme.colors.earth.sage },
            {
              key: 'paddocks',
              value: records.paddocks,
              label: 'PADDOCKS',
              color: theme.colors.earth.terracotta,
            },
            {
              key: 'streak',
              value: records.streak,
              label: 'STREAK',
              color: theme.colors.earth.wood,
            },
          ]}
        />

        <Text style={styles.groupLabel}>MEADOW SIZE</Text>
        <View style={styles.chipRow}>
          {BOARD_SIZES.map(option => (
            <Chip
              key={option}
              label={SIZE_LABEL[option]}
              active={size === option}
              accent={theme.colors.earth.sage}
              onPress={() => onSizeChange(option)}
            />
          ))}
        </View>

        <Text style={styles.groupLabel}>OPPONENT</Text>
        <View style={styles.chipRow}>
          {OPPONENTS.map(option => (
            <Chip
              key={option}
              label={option}
              active={opponent === option}
              accent={theme.colors.earth.terracotta}
              onPress={() => onOpponentChange(option)}
            />
          ))}
        </View>

        <Text style={styles.hint}>TAP A GAP · CLOSE A SQUARE · TAKE ANOTHER TURN</Text>

        <PrimaryButton label="START MATCH" Icon={Play} onPress={onStart} style={styles.cta} />

        <View style={styles.secondaryRow}>
          <View style={styles.secondarySlot}>
            <SecondaryButton label="TEAMS" onPress={() => setPanel('teams')} />
          </View>
          <View style={styles.secondarySlot}>
            <SecondaryButton label="RECORDS" onPress={() => setPanel('records')} />
          </View>
          <View style={styles.secondarySlot}>
            <SecondaryButton label="BARN" onPress={() => setPanel('barn')} />
          </View>
        </View>
      </Animated.View>

      <SheetModal title="ANIMAL TEAMS" visible={panel === 'teams'} onClose={closePanel}>
        <View style={styles.teamGrid}>
          {TEAMS.map(team => (
            <TeamTile
              key={team.id}
              color={team.color}
              initial={team.initial}
              name={team.name}
              locked={!isUnlocked(team, records.wins)}
              unlockText={team.unlockText}
              selected={records.teamId === team.id}
              onPress={() => setTeam(team.id)}
            />
          ))}
        </View>
      </SheetModal>

      <SheetModal title="COUNTY RECORDS" visible={panel === 'records'} onClose={closePanel}>
        {OPPONENTS.map(id => {
          const row = records.perOpponent[id];
          return (
            <View key={id} style={styles.recordRow}>
              <Text style={styles.recordName}>{id}</Text>
              <Text style={styles.recordScore}>{row.wins + ' - ' + row.losses}</Text>
              <Text style={styles.recordBest}>{'BEST ' + row.bestPaddocks}</Text>
            </View>
          );
        })}
        <Text style={styles.recordNote}>Stored on this device only.</Text>
      </SheetModal>

      <SheetModal title="STRATEGY BARN" visible={panel === 'barn'} onClose={closePanel}>
        {TIPS.map(tip => (
          <MiniBoardTip key={tip.id} tip={tip} />
        ))}
      </SheetModal>

      <SheetModal title="SETTINGS" visible={panel === 'settings'} onClose={closePanel}>
        <ToggleRow
          label="SOUND"
          value={settings.sound}
          onToggle={() => setSetting('sound', !settings.sound)}
        />
        <ToggleRow
          label="HINTS"
          value={settings.hints}
          onToggle={() => setSetting('hints', !settings.hints)}
        />
        <ToggleRow
          label="RAIL CONFIRMATION"
          value={settings.railConfirm}
          onToggle={() => setSetting('railConfirm', !settings.railConfirm)}
        />
        <SecondaryButton
          label={confirmReset ? 'TAP AGAIN TO RESET' : 'RESET RECORDS'}
          onPress={handleReset}
          style={confirmReset ? styles.resetArmed : styles.reset}
        />
      </SheetModal>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  leaguePill: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(250,245,236,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(92,127,44,0.35)',
  },
  leagueText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  art: {
    flex: 1,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  teamStrip: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(250,245,236,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(92,127,44,0.3)',
  },
  teamSlot: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  sheet: {
    backgroundColor: theme.colors.bg.primary,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderTopWidth: 3,
    borderTopColor: theme.colors.earth.wood,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 26,
    shadowColor: '#2A3312',
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -8 },
    elevation: 16,
  },
  settingsSlot: { position: 'absolute', right: 16, top: 14, zIndex: 5 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    color: theme.colors.text.primary,
    paddingHorizontal: 52,
  },
  tagline: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.2,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  stats: { marginTop: 14 },
  groupLabel: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  chipRow: { flexDirection: 'row', gap: 8 },
  hint: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  cta: { marginBottom: 10 },
  secondaryRow: { flexDirection: 'row', gap: 10 },
  secondarySlot: { flex: 1 },
  teamGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  recordName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
  },
  recordScore: {
    width: 64,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.earth.sage,
  },
  recordBest: {
    width: 76,
    textAlign: 'right',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.1,
    color: theme.colors.text.secondary,
  },
  recordNote: {
    marginTop: 6,
    fontSize: 11,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  reset: { marginTop: 6 },
  resetArmed: { marginTop: 6, opacity: 0.95 },
});

export default MenuScreen;
