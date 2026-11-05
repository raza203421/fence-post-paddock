export interface Team {
  id: number;
  name: string;
  color: string;
  initial: string;
  unlockWins: number;
  unlockText: string;
}

/** Each team is identified by a color token and an ASCII initial, not a sprite. */
export const TEAMS: Team[] = [
  { id: 0, name: 'WOOLY FLOCK', color: '#5C7F2C', initial: 'W', unlockWins: 0, unlockText: 'STARTER TEAM' },
  { id: 1, name: 'MEADOW HERD', color: '#D9B36C', initial: 'M', unlockWins: 1, unlockText: 'WIN 1 MATCH' },
  { id: 2, name: 'MUDDY TROOP', color: '#8A6A3F', initial: 'T', unlockWins: 5, unlockText: 'WIN 5 MATCHES' },
  { id: 3, name: 'HEN PATROL', color: '#C9402F', initial: 'H', unlockWins: 12, unlockText: 'WIN 12 MATCHES' },
  { id: 4, name: 'HIGHLAND COWS', color: '#00558B', initial: 'C', unlockWins: 22, unlockText: 'WIN 22 MATCHES' },
];

export function isUnlocked(team: Team, wins: number): boolean {
  return wins >= team.unlockWins;
}

export function teamById(id: number): Team {
  return TEAMS[Math.max(0, Math.min(TEAMS.length - 1, id))];
}

/** The rival always fields a different team, so ownership is never ambiguous. */
export function rivalTeamFor(playerTeamId: number): Team {
  return TEAMS[(playerTeamId + 2) % TEAMS.length];
}

export function newlyUnlocked(winsBefore: number, winsAfter: number): Team | null {
  for (const team of TEAMS) {
    if (team.unlockWins > 0 && winsBefore < team.unlockWins && winsAfter >= team.unlockWins) {
      return team;
    }
  }
  return null;
}
