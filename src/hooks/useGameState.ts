import { useCallback, useEffect, useRef, useState } from 'react';
import { AI_LEVELS, OpponentId, TIMING } from '../constants/config';
import { AiLevel, chooseMove, hintGap } from '../game/ai';
import { BoardState, PLAYER, Player, RIVAL, createBoard } from '../game/board';
import { MoveRecord, longestChain } from '../game/chain';
import { isFinished, placeRail, railsPlaced, railsTotal, score } from '../game/rules';

export type Phase = 'idle' | 'pending' | 'placing' | 'claiming' | 'aiThinking' | 'finished';

export interface MatchSummary {
  playerScore: number;
  rivalScore: number;
  result: 'win' | 'loss' | 'draw';
  winningChain: string[];
  longestChain: number;
  board: BoardState;
}

export interface GameOptions {
  size: number;
  opponent: OpponentId;
  railConfirm: boolean;
  hintsEnabled: boolean;
  onGameOver: (summary: MatchSummary) => void;
}

const CLAIM_LOCK_MS = TIMING.claimFlood + TIMING.animalBounce;

export function useGameState(options: GameOptions) {
  const { size, opponent, railConfirm, hintsEnabled, onGameOver } = options;

  const [board, setBoard] = useState<BoardState>(() => createBoard(size));
  const [turn, setTurn] = useState<Player>(PLAYER);
  const [phase, setPhase] = useState<Phase>('idle');
  const [pendingGap, setPendingGap] = useState<string | null>(null);
  const [lastGap, setLastGap] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [moveSeq, setMoveSeq] = useState(0);

  // Everything an animation/timer callback reads lives in a ref, never in state.
  const boardRef = useRef(board);
  const turnRef = useRef<Player>(PLAYER);
  const historyRef = useRef<MoveRecord[]>([]);
  const finishedRef = useRef(false);
  const onGameOverRef = useRef(onGameOver);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  onGameOverRef.current = onGameOver;

  const addTimer = useCallback((t: ReturnType<typeof setTimeout>) => {
    timersRef.current.push(t);
  }, []);

  useEffect(
    () => () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    },
    [],
  );

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const state = boardRef.current;
    const playerScore = score(state, PLAYER);
    const rivalScore = score(state, RIVAL);
    const result: MatchSummary['result'] =
      playerScore > rivalScore ? 'win' : playerScore < rivalScore ? 'loss' : 'draw';
    const winner: Player | 0 = result === 'win' ? PLAYER : result === 'loss' ? RIVAL : 0;
    const chain = longestChain(historyRef.current, winner);
    setPhase('finished');
    onGameOverRef.current({
      playerScore,
      rivalScore,
      result,
      winningChain: chain,
      longestChain: chain.length,
      board: state,
    });
  }, []);

  const commit = useCallback(
    (gap: string, player: Player) => {
      if (finishedRef.current) return;
      const { state: next, claims } = placeRail(boardRef.current, gap, player);
      if (next === boardRef.current) return;

      boardRef.current = next;
      historyRef.current = historyRef.current.concat({ gap, player, claims: claims.length });

      setBoard(next);
      setLastGap(gap);
      setPendingGap(null);
      setHint(null);
      setMoveSeq(n => n + 1);

      if (isFinished(next)) {
        finish();
        return;
      }

      const keepsTurn = claims.length > 0;
      const nextTurn: Player = keepsTurn ? player : player === PLAYER ? RIVAL : PLAYER;
      turnRef.current = nextTurn;
      setTurn(nextTurn);

      if (keepsTurn) {
        setPhase('claiming');
        addTimer(
          setTimeout(() => {
            if (!finishedRef.current) setPhase('idle');
          }, CLAIM_LOCK_MS),
        );
      } else {
        setPhase('idle');
      }
    },
    [addTimer, finish],
  );

  const aiControlled = opponent !== 'FRIEND';
  const boardLocked = phase === 'aiThinking' || phase === 'claiming' || phase === 'finished';

  /** Hand over to the farmer across the fence. */
  useEffect(() => {
    if (!aiControlled) return;
    if (phase !== 'idle') return;
    if (turn !== RIVAL) return;
    setPhase('aiThinking');
  }, [aiControlled, phase, turn]);

  /** Separate effect so the think timer is never cancelled by its own setPhase. */
  useEffect(() => {
    if (phase !== 'aiThinking') return undefined;
    const level = (opponent === 'FRIEND' ? 'STEADY' : opponent) as AiLevel;
    const delay = AI_LEVELS[level].thinkMs;
    const timer = setTimeout(() => {
      const move = chooseMove(boardRef.current, level);
      if (move) commit(move, RIVAL);
      else finish();
    }, delay);
    addTimer(timer);
    return () => clearTimeout(timer);
  }, [phase, moveSeq, opponent, commit, finish, addTimer]);

  /** Idle hint: after 5s with no tap the best safe gap starts pulsing. */
  useEffect(() => {
    if (!hintsEnabled) return undefined;
    if (phase !== 'idle') return undefined;
    if (aiControlled && turn !== PLAYER) return undefined;
    const timer = setTimeout(() => setHint(hintGap(boardRef.current)), TIMING.idleHintMs);
    addTimer(timer);
    return () => clearTimeout(timer);
  }, [hintsEnabled, phase, turn, moveSeq, aiControlled, addTimer]);

  const tapGap = useCallback(
    (gap: string) => {
      if (finishedRef.current) return;
      if (phase !== 'idle' && phase !== 'pending') return;
      if (aiControlled && turnRef.current !== PLAYER) return;

      setHint(null);

      if (railConfirm && pendingGap !== gap) {
        setPendingGap(gap);
        setPhase('pending');
        return;
      }
      commit(gap, turnRef.current);
    },
    [aiControlled, commit, pendingGap, phase, railConfirm],
  );

  const requestHint = useCallback(() => {
    if (phase !== 'idle') return;
    if (aiControlled && turnRef.current !== PLAYER) return;
    setHint(hintGap(boardRef.current));
  }, [aiControlled, phase]);

  return {
    board,
    turn,
    phase,
    pendingGap,
    lastGap,
    hint,
    boardLocked,
    playerScore: score(board, PLAYER),
    rivalScore: score(board, RIVAL),
    railsPlaced: railsPlaced(board),
    railsTotal: railsTotal(board),
    tapGap,
    requestHint,
  };
}

export default useGameState;
