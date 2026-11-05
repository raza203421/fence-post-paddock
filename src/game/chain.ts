import { Player } from './board';

export interface MoveRecord {
  gap: string;
  player: Player;
  claims: number;
}

/**
 * The deciding run: the longest unbroken streak of rails by one farmer in
 * which every rail closed at least one paddock. Used by the GameOver replay.
 */
export function longestChain(history: MoveRecord[], winner: Player | 0): string[] {
  if (history.length === 0) return [];

  let best: string[] = [];
  let current: string[] = [];
  let currentPlayer: Player | 0 = 0;

  for (const move of history) {
    if (move.claims > 0 && move.player === currentPlayer) {
      current.push(move.gap);
    } else if (move.claims > 0) {
      currentPlayer = move.player;
      current = [move.gap];
    } else {
      currentPlayer = 0;
      current = [];
      continue;
    }
    const matchesWinner = winner === 0 || currentPlayer === winner;
    if (matchesWinner && current.length > best.length) best = current.slice();
  }

  if (best.length === 0) {
    const fallback = history.filter(move => move.claims > 0).map(move => move.gap);
    return fallback.slice(-4);
  }
  return best;
}

export function longestChainLength(history: MoveRecord[], winner: Player | 0): number {
  return longestChain(history, winner).length;
}
