import { BONUS_RATIO, POND_RATIO } from '../constants/config';

export type Player = 1 | 2;
export type RailValue = 0 | 1 | 2 | 3;

export const EMPTY: RailValue = 0;
export const PLAYER: Player = 1;
export const RIVAL: Player = 2;
/** Pond bank: pre-placed, never tappable, still closes the neighbouring paddock. */
export const WALL: RailValue = 3;

export type CellKind = 'normal' | 'pond' | 'bonus';
export type Orientation = 'h' | 'v';

export interface GapRef {
  o: Orientation;
  r: number;
  c: number;
}

export interface BoardState {
  size: number;
  /** horizontal rails: (size + 1) rows x size cols */
  h: RailValue[][];
  /** vertical rails: size rows x (size + 1) cols */
  v: RailValue[][];
  kind: CellKind[][];
  owner: (0 | Player)[][];
}

export const gapId = (o: Orientation, r: number, c: number) => `${o}:${r}:${c}`;

export function parseGap(id: string): GapRef {
  const [o, r, c] = id.split(':');
  return { o: o as Orientation, r: Number(r), c: Number(c) };
}

export function railValue(state: BoardState, g: GapRef): RailValue {
  return g.o === 'h' ? state.h[g.r][g.c] : state.v[g.r][g.c];
}

export function setRail(state: BoardState, g: GapRef, value: RailValue): void {
  if (g.o === 'h') {
    state.h[g.r][g.c] = value;
  } else {
    state.v[g.r][g.c] = value;
  }
}

/** The four rail gaps that fence paddock (r, c). */
export function edgesOfCell(r: number, c: number): GapRef[] {
  return [
    { o: 'h', r, c },
    { o: 'h', r: r + 1, c },
    { o: 'v', r, c },
    { o: 'v', r, c: c + 1 },
  ];
}

/** The one or two paddocks a gap borders. */
export function cellsOfGap(state: BoardState, g: GapRef): Array<{ r: number; c: number }> {
  const n = state.size;
  const out: Array<{ r: number; c: number }> = [];
  if (g.o === 'h') {
    if (g.r - 1 >= 0) out.push({ r: g.r - 1, c: g.c });
    if (g.r < n) out.push({ r: g.r, c: g.c });
  } else {
    if (g.c - 1 >= 0) out.push({ r: g.r, c: g.c - 1 });
    if (g.c < n) out.push({ r: g.r, c: g.c });
  }
  return out;
}

export function filledEdgeCount(state: BoardState, r: number, c: number): number {
  let n = 0;
  for (const e of edgesOfCell(r, c)) {
    if (railValue(state, e) !== EMPTY) n++;
  }
  return n;
}

export function legalGaps(state: BoardState): string[] {
  const out: string[] = [];
  const n = state.size;
  for (let r = 0; r <= n; r++) {
    for (let c = 0; c < n; c++) {
      if (state.h[r][c] === EMPTY) out.push(gapId('h', r, c));
    }
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c <= n; c++) {
      if (state.v[r][c] === EMPTY) out.push(gapId('v', r, c));
    }
  }
  return out;
}

export function allGaps(size: number): GapRef[] {
  const out: GapRef[] = [];
  for (let r = 0; r <= size; r++) {
    for (let c = 0; c < size; c++) out.push({ o: 'h', r, c });
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size; c++) out.push({ o: 'v', r, c });
  }
  return out;
}

export function cloneBoard(state: BoardState): BoardState {
  return {
    size: state.size,
    h: state.h.map(row => row.slice()) as RailValue[][],
    v: state.v.map(row => row.slice()) as RailValue[][],
    kind: state.kind.map(row => row.slice()),
    owner: state.owner.map(row => row.slice()) as (0 | Player)[][],
  };
}

function shuffled(count: number): number[] {
  const idx = Array.from({ length: count }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = idx[i];
    idx[i] = idx[j];
    idx[j] = t;
  }
  return idx;
}

export function createBoard(size: number): BoardState {
  const h: RailValue[][] = Array.from({ length: size + 1 }, () =>
    Array.from({ length: size }, () => EMPTY),
  );
  const v: RailValue[][] = Array.from({ length: size }, () =>
    Array.from({ length: size + 1 }, () => EMPTY),
  );
  const kind: CellKind[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 'normal' as CellKind),
  );
  const owner: (0 | Player)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0 as 0 | Player),
  );

  const state: BoardState = { size, h, v, kind, owner };

  const total = size * size;
  const pondCount = Math.floor(total * POND_RATIO);
  const bonusCount = Math.floor(total * BONUS_RATIO);
  const order = shuffled(total);

  let taken = 0;
  for (let i = 0; i < pondCount && taken < order.length; i++, taken++) {
    const r = Math.floor(order[taken] / size);
    const c = order[taken] % size;
    kind[r][c] = 'pond';
    // The pond's banks are already fenced: never tappable, but they still
    // let the neighbouring paddock be closed.
    for (const e of edgesOfCell(r, c)) setRail(state, e, WALL);
  }
  for (let i = 0; i < bonusCount && taken < order.length; i++, taken++) {
    const r = Math.floor(order[taken] / size);
    const c = order[taken] % size;
    if (kind[r][c] === 'normal') kind[r][c] = 'bonus';
  }

  return state;
}
