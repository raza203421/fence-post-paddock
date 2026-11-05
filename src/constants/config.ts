import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Branded splash. 8000ms exactly — shorter races the screenshot capture window. */
export const LOADER_DURATION_MS = 8000;

export const HEADER_HEIGHT = 72;
export const HEADER_PADDING_TOP = 44;
/** Full header block: the 72px row plus the status-bar inset. */
export const HEADER_TOTAL = HEADER_HEIGHT + HEADER_PADDING_TOP;
export const SCORE_STRIP_HEIGHT = 56;
export const CONTROL_BAR_HEIGHT = 72;
export const CONTROL_BAR_BOTTOM = 28;

export type BoardSize = 4 | 5 | 6;
export const BOARD_SIZES: BoardSize[] = [4, 5, 6];
export const DEFAULT_BOARD_SIZE: BoardSize = 5;

export type OpponentId = 'NOVICE' | 'STEADY' | 'SHARP' | 'FRIEND';
export const OPPONENTS: OpponentId[] = ['NOVICE', 'STEADY', 'SHARP', 'FRIEND'];
export const DEFAULT_OPPONENT: OpponentId = 'STEADY';

export const AI_LEVELS: Record<Exclude<OpponentId, 'FRIEND'>, { thinkMs: number }> = {
  NOVICE: { thinkMs: 450 },
  STEADY: { thinkMs: 600 },
  SHARP: { thinkMs: 700 },
};

export const POND_RATIO = 0.08;
export const BONUS_RATIO = 0.12;
export const BONUS_VALUE = 2;

export const LEAGUE_TOTAL = 8;

export const TIMING = {
  screenFade: 240,
  elementFade: 200,
  railSlide: 130,
  claimFlood: 200,
  animalBounce: 200,
  idleHintMs: 5000,
  turnSwap: 220,
  scorePulse: 260,
  replayStep: 160,
  replayPause: 1400,
  sheetSlide: 420,
};

/* ---------------- board geometry (rule #4/#5) ---------------- */

export const BOARD_PAD = 10;
export const BOARD_BORDER = 3;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 13

export const POST_SIZE = 14;
export const RAIL_THICKNESS = 10;
export const MIN_TOUCH = 48;

const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);

/** Vertical room the board may use on GameScreen, so the floating bar never overlaps it. */
const BOARD_MAX_H =
  SCREEN_H -
  HEADER_TOTAL -
  SCORE_STRIP_HEIGHT -
  (CONTROL_BAR_HEIGHT + CONTROL_BAR_BOTTOM + 16) -
  24;

export function cellSizeFor(size: number): number {
  const side = Math.min(BOARD_MAX_W, BOARD_MAX_H);
  return Math.max(34, Math.floor((side - 2 * BOARD_FRAME) / size));
}

export function boardWidthFor(cell: number, size: number): number {
  return cell * size + 2 * BOARD_FRAME;
}

/** Shrunken, non-interactive copy used by the GameOver replay card. */
export function miniCellSizeFor(size: number): number {
  const target = Math.min(cellSizeFor(size) * 0.62, (200 - 2 * BOARD_FRAME) / size);
  return Math.max(16, Math.floor(target));
}
