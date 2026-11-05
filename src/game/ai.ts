import {
  BoardState,
  EMPTY,
  GapRef,
  cellsOfGap,
  filledEdgeCount,
  legalGaps,
  parseGap,
  railValue,
} from './board';
import { cellValue } from './rules';

export type AiLevel = 'NOVICE' | 'STEADY' | 'SHARP';

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function touchedCells(state: BoardState, g: GapRef) {
  return cellsOfGap(state, g).filter(cell => state.kind[cell.r][cell.c] !== 'pond');
}

/** Gaps that close at least one paddock right now. */
export function claimingGaps(state: BoardState): string[] {
  return legalGaps(state).filter(id => {
    const g = parseGap(id);
    return touchedCells(state, g).some(
      cell => state.owner[cell.r][cell.c] === 0 && filledEdgeCount(state, cell.r, cell.c) === 3,
    );
  });
}

/** Gaps that hand nothing over: no neighbouring paddock would reach three rails. */
export function safeGaps(state: BoardState): string[] {
  return legalGaps(state).filter(id => {
    const g = parseGap(id);
    return touchedCells(state, g).every(
      cell => state.owner[cell.r][cell.c] !== 0 || filledEdgeCount(state, cell.r, cell.c) < 2,
    );
  });
}

/** Connected runs of open paddocks that already carry two rails. */
export function chainsOf(state: BoardState): Array<Array<{ r: number; c: number }>> {
  const n = state.size;
  const seen: boolean[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => false));
  const chains: Array<Array<{ r: number; c: number }>> = [];

  const openFor = (r: number, c: number) =>
    state.kind[r][c] !== 'pond' && state.owner[r][c] === 0 && filledEdgeCount(state, r, c) === 2;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (seen[r][c] || !openFor(r, c)) continue;
      const stack = [{ r, c }];
      const group: Array<{ r: number; c: number }> = [];
      seen[r][c] = true;
      while (stack.length) {
        const cur = stack.pop() as { r: number; c: number };
        group.push(cur);
        const neighbours = [
          { r: cur.r - 1, c: cur.c, edge: { o: 'h' as const, r: cur.r, c: cur.c } },
          { r: cur.r + 1, c: cur.c, edge: { o: 'h' as const, r: cur.r + 1, c: cur.c } },
          { r: cur.r, c: cur.c - 1, edge: { o: 'v' as const, r: cur.r, c: cur.c } },
          { r: cur.r, c: cur.c + 1, edge: { o: 'v' as const, r: cur.r, c: cur.c + 1 } },
        ];
        for (const nb of neighbours) {
          if (nb.r < 0 || nb.c < 0 || nb.r >= n || nb.c >= n) continue;
          if (seen[nb.r][nb.c] || !openFor(nb.r, nb.c)) continue;
          if (railValue(state, nb.edge) !== EMPTY) continue;
          seen[nb.r][nb.c] = true;
          stack.push({ r: nb.r, c: nb.c });
        }
      }
      chains.push(group);
    }
  }
  return chains;
}

/** How many paddocks the rival would collect if this gap opened a chain up. */
function giveawayCost(state: BoardState, id: string, chains: ReturnType<typeof chainsOf>): number {
  const g = parseGap(id);
  let cost = 0;
  for (const cell of touchedCells(state, g)) {
    if (state.owner[cell.r][cell.c] !== 0) continue;
    if (filledEdgeCount(state, cell.r, cell.c) !== 2) continue;
    const chain = chains.find(group => group.some(item => item.r === cell.r && item.c === cell.c));
    const members = chain ?? [cell];
    for (const item of members) cost += cellValue(state, item.r, item.c);
  }
  return cost;
}

function smallestGiveaway(state: BoardState, pool: string[]): string {
  const chains = chainsOf(state);
  let best = pool[0];
  let bestCost = Number.POSITIVE_INFINITY;
  for (const id of pool) {
    const cost = giveawayCost(state, id, chains);
    if (cost < bestCost) {
      bestCost = cost;
      best = id;
    }
  }
  return best;
}

/**
 * SHARP keeps parity by declining the last paddocks of a long chain — the
 * half-hearted handout. Returns a gap that leaves the chain closed, if any.
 */
function halfHeartedHandout(state: BoardState, claiming: string[]): string | null {
  const longChains = chainsOf(state).filter(group => group.length >= 3);
  if (longChains.length === 0) return null;
  const rest = legalGaps(state).filter(id => claiming.indexOf(id) === -1);
  if (rest.length === 0) return null;
  return smallestGiveaway(state, rest);
}

export function chooseMove(state: BoardState, level: AiLevel): string | null {
  const open = legalGaps(state);
  if (open.length === 0) return null;

  const claiming = claimingGaps(state);
  const safe = safeGaps(state);

  if (level === 'NOVICE') {
    if (claiming.length > 0 && Math.random() < 0.6) return pick(claiming);
    return safe.length > 0 ? pick(safe) : pick(open);
  }

  if (claiming.length > 0) {
    if (level === 'SHARP' && claiming.length >= 2 && open.length > claiming.length + 2) {
      const handout = halfHeartedHandout(state, claiming);
      if (handout && Math.random() < 0.5) return handout;
    }
    return pick(claiming);
  }

  if (safe.length > 0) {
    if (level === 'SHARP') {
      // Prefer gaps on emptier paddocks — they keep more options open later.
      let best = safe[0];
      let bestLoad = Number.POSITIVE_INFINITY;
      for (const id of safe) {
        const g = parseGap(id);
        const load = touchedCells(state, g).reduce(
          (sum, cell) => sum + filledEdgeCount(state, cell.r, cell.c),
          0,
        );
        if (load < bestLoad) {
          bestLoad = load;
          best = id;
        }
      }
      return best;
    }
    return pick(safe);
  }

  return smallestGiveaway(state, open);
}

/** Suggested gap for the idle hint: take a paddock, else play safe. */
export function hintGap(state: BoardState): string | null {
  const open = legalGaps(state);
  if (open.length === 0) return null;
  const claiming = claimingGaps(state);
  if (claiming.length > 0) return claiming[0];
  const safe = safeGaps(state);
  if (safe.length > 0) return safe[0];
  return smallestGiveaway(state, open);
}
