import { BONUS_VALUE } from '../constants/config';
import {
  BoardState,
  EMPTY,
  Player,
  cellsOfGap,
  cloneBoard,
  edgesOfCell,
  legalGaps,
  parseGap,
  railValue,
  setRail,
} from './board';

export interface Claim {
  r: number;
  c: number;
  value: number;
}

export interface PlaceResult {
  state: BoardState;
  claims: Claim[];
}

export function cellValue(state: BoardState, r: number, c: number): number {
  return state.kind[r][c] === 'bonus' ? BONUS_VALUE : 1;
}

export function isClosed(state: BoardState, r: number, c: number): boolean {
  for (const e of edgesOfCell(r, c)) {
    if (railValue(state, e) === EMPTY) return false;
  }
  return true;
}

/** Place one rail and claim every paddock it closes for the mover. */
export function placeRail(state: BoardState, id: string, player: Player): PlaceResult {
  const g = parseGap(id);
  if (railValue(state, g) !== EMPTY) return { state, claims: [] };

  const next = cloneBoard(state);
  setRail(next, g, player);

  const claims: Claim[] = [];
  for (const cell of cellsOfGap(next, g)) {
    if (next.kind[cell.r][cell.c] === 'pond') continue;
    if (next.owner[cell.r][cell.c] !== 0) continue;
    if (!isClosed(next, cell.r, cell.c)) continue;
    next.owner[cell.r][cell.c] = player;
    claims.push({ r: cell.r, c: cell.c, value: cellValue(next, cell.r, cell.c) });
  }

  return { state: next, claims };
}

export function isFinished(state: BoardState): boolean {
  return legalGaps(state).length === 0;
}

export function score(state: BoardState, player: Player): number {
  let total = 0;
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (state.owner[r][c] === player) total += cellValue(state, r, c);
    }
  }
  return total;
}

export function railsPlaced(state: BoardState): number {
  let n = 0;
  for (const row of state.h) for (const value of row) if (value === 1 || value === 2) n++;
  for (const row of state.v) for (const value of row) if (value === 1 || value === 2) n++;
  return n;
}

export function railsTotal(state: BoardState): number {
  return railsPlaced(state) + legalGaps(state).length;
}
