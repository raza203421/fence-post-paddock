import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import {
  BoardSize,
  DEFAULT_BOARD_SIZE,
  DEFAULT_OPPONENT,
  OpponentId,
} from './src/constants/config';
import { recordMatch } from './src/game/storage';
import { Team, newlyUnlocked } from './src/game/teams';
import { MatchSummary } from './src/hooks/useGameState';

type Screen = 'loader' | 'menu' | 'game' | 'gameover';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [size, setSize] = useState<BoardSize>(DEFAULT_BOARD_SIZE);
  const [opponent, setOpponent] = useState<OpponentId>(DEFAULT_OPPONENT);
  const [summary, setSummary] = useState<MatchSummary | null>(null);
  const [unlocked, setUnlocked] = useState<Team | null>(null);
  const [matchKey, setMatchKey] = useState(0);

  const screenRef = useRef<Screen>('loader');
  screenRef.current = screen;

  const goMenu = useCallback(() => setScreen('menu'), []);

  const startMatch = useCallback(() => {
    setSummary(null);
    setUnlocked(null);
    setMatchKey(n => n + 1);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback(
    (result: MatchSummary) => {
      const { winsBefore, winsAfter } = recordMatch({
        opponent,
        playerScore: result.playerScore,
        rivalScore: result.rivalScore,
        result: result.result,
      });
      setUnlocked(newlyUnlocked(winsBefore, winsAfter));
      setSummary(result);
      setScreen('gameover');
    },
    [opponent],
  );

  /** Android hardware back: Game and GameOver fall back to the Menu. */
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screenRef.current === 'game' || screenRef.current === 'gameover') {
        setScreen('menu');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          size={size}
          opponent={opponent}
          onSizeChange={setSize}
          onOpponentChange={setOpponent}
          onStart={startMatch}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={'match-' + matchKey}
          size={size}
          opponent={opponent}
          onGameOver={handleGameOver}
          onExit={goMenu}
        />
      ) : null}

      {screen === 'gameover' && summary ? (
        <GameOverScreen
          summary={summary}
          unlocked={unlocked}
          onPlayAgain={startMatch}
          onMenu={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A2610' },
});
