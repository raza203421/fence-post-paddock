import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HEADER_HEIGHT, HEADER_PADDING_TOP } from '../constants/config';
import theme from '../constants/theme';

interface Props {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  title?: string;
  centerSlot?: React.ReactNode;
}

/** One header for every screen — only the slots change (Menu, Game, GameOver). */
export function ScreenHeader({ leftSlot, rightSlot, title, centerSlot }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{leftSlot}</View>
      <View style={styles.center}>
        {centerSlot}
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT + HEADER_PADDING_TOP,
    paddingTop: HEADER_PADDING_TOP,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.ui.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(42,51,18,0.18)',
  },
  side: { minWidth: 44, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: theme.colors.text.onDark,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
});

export default ScreenHeader;
