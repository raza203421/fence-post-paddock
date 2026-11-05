import { LEAGUE_TOTAL, OpponentId } from '../constants/config';

export interface OpponentRecord {
  wins: number;
  losses: number;
  bestPaddocks: number;
}

export interface Records {
  wins: number;
  losses: number;
  draws: number;
  paddocks: number;
  streak: number;
  bestStreak: number;
  leagueIndex: number;
  teamId: number;
  perOpponent: Record<OpponentId, OpponentRecord>;
}

export interface Settings {
  sound: boolean;
  hints: boolean;
  railConfirm: boolean;
}

const emptyOpponent = (): OpponentRecord => ({ wins: 0, losses: 0, bestPaddocks: 0 });

/** Device-local module singleton — no extra native dependency. */
let records: Records = {
  wins: 0,
  losses: 0,
  draws: 0,
  paddocks: 0,
  streak: 0,
  bestStreak: 0,
  leagueIndex: 1,
  teamId: 0,
  perOpponent: {
    NOVICE: emptyOpponent(),
    STEADY: emptyOpponent(),
    SHARP: emptyOpponent(),
    FRIEND: emptyOpponent(),
  },
};

let settings: Settings = { sound: true, hints: true, railConfirm: false };

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(fn => fn());
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getRecords(): Records {
  return records;
}

export function getSettings(): Settings {
  return settings;
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  settings = { ...settings, [key]: value };
  emit();
}

export function setTeam(teamId: number): void {
  records = { ...records, teamId };
  emit();
}

export interface MatchOutcome {
  opponent: OpponentId;
  playerScore: number;
  rivalScore: number;
  result: 'win' | 'loss' | 'draw';
}

export function recordMatch(outcome: MatchOutcome): { winsBefore: number; winsAfter: number } {
  const winsBefore = records.wins;
  const prev = records.perOpponent[outcome.opponent];
  const streak = outcome.result === 'win' ? records.streak + 1 : 0;

  records = {
    ...records,
    wins: records.wins + (outcome.result === 'win' ? 1 : 0),
    losses: records.losses + (outcome.result === 'loss' ? 1 : 0),
    draws: records.draws + (outcome.result === 'draw' ? 1 : 0),
    paddocks: records.paddocks + outcome.playerScore,
    streak,
    bestStreak: Math.max(records.bestStreak, streak),
    leagueIndex:
      outcome.result === 'win' && outcome.opponent !== 'FRIEND'
        ? Math.min(LEAGUE_TOTAL, records.leagueIndex + 1)
        : records.leagueIndex,
    perOpponent: {
      ...records.perOpponent,
      [outcome.opponent]: {
        wins: prev.wins + (outcome.result === 'win' ? 1 : 0),
        losses: prev.losses + (outcome.result === 'loss' ? 1 : 0),
        bestPaddocks: Math.max(prev.bestPaddocks, outcome.playerScore),
      },
    },
  };
  emit();
  return { winsBefore, winsAfter: records.wins };
}

export function resetRecords(): void {
  records = {
    ...records,
    wins: 0,
    losses: 0,
    draws: 0,
    paddocks: 0,
    streak: 0,
    bestStreak: 0,
    leagueIndex: 1,
    perOpponent: {
      NOVICE: emptyOpponent(),
      STEADY: emptyOpponent(),
      SHARP: emptyOpponent(),
      FRIEND: emptyOpponent(),
    },
  };
  emit();
}
