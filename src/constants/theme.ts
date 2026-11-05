/**
 * FencePostPaddock — WARM_EARTHY preset with the brief's accent overrides.
 * The `name` field is the preset value verbatim and must not be renamed.
 */
export const theme = {
  name: 'warm-earthy',
  colors: {
    bg: {
      primary: '#FAF5EC',
      secondary: '#F2EAD8',
      tertiary: '#EFE6D2',
      meadow: '#EEF5D6',
      felt: '#E7DCC0',
      accent: '#D8C99B',
    },
    earth: {
      sage: '#5C7F2C',
      sageLight: '#8FB24E',
      sageDark: '#44611F',
      terracotta: '#C9402F',
      mustard: '#D9B36C',
      wood: '#8A6A3F',
      woodDark: '#6B5128',
      woodLight: '#A8794A',
      cream: '#FAF5EC',
      pond: '#9DCEDB',
      pondInk: '#00558B',
    },
    text: {
      primary: '#2A3312',
      secondary: '#6B7355',
      muted: '#A89B82',
      onDark: '#F3EFDE',
      onDarkMuted: 'rgba(243,239,222,0.62)',
    },
    ui: {
      border: 'rgba(42,51,18,0.14)',
      borderStrong: 'rgba(42,51,18,0.28)',
      divider: '#E8DDC4',
      scrim: 'rgba(26,38,16,0.62)',
      headerBg: 'rgba(42,51,18,0.30)',
      glass: 'rgba(250,245,236,0.90)',
    },
  },
  gradients: {
    primary: ['#6E9636', '#5C7F2C', '#44611F'],
    surface: ['#F2EAD8', '#E8DDC4'],
    plank: ['#A8794A', '#8A6A3F', '#6B5128'],
    loaderBar: ['#5C7F2C', '#8FB24E'],
    loaderOverlay: ['rgba(26,38,16,0.92)', 'rgba(42,51,18,0.86)', 'rgba(16,24,10,0.95)'],
    menuOverlay: ['rgba(238,245,214,0.10)', 'rgba(238,245,214,0.42)', 'rgba(238,245,214,0.88)'],
    gameOverlay: ['rgba(238,245,214,0.55)', 'rgba(216,201,155,0.35)', 'rgba(238,245,214,0.72)'],
    overWin: ['rgba(92,127,44,0.72)', 'rgba(42,51,18,0.90)'],
    overLoss: ['rgba(201,64,47,0.55)', 'rgba(42,51,18,0.92)'],
    overDraw: ['rgba(138,106,63,0.60)', 'rgba(42,51,18,0.92)'],
  },
  typography: {
    hero: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 4 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 1.5 },
    score: { fontSize: 22, fontWeight: '800' as const, letterSpacing: 0.5 },
    body: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 0.6 },
    button: { fontSize: 17, fontWeight: '800' as const, letterSpacing: 2 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 2.2 },
  },
  radius: { sm: 6, md: 12, lg: 16, xl: 28, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  shadows: {
    sheet: {
      shadowColor: '#2A3312',
      shadowOpacity: 0.28,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: -8 },
      elevation: 16,
    },
    card: {
      shadowColor: '#2A3312',
      shadowOpacity: 0.22,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 5 },
      elevation: 8,
    },
    board: {
      shadowColor: '#2A3312',
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 12,
    },
    cta: {
      shadowColor: '#44611F',
      shadowOpacity: 0.35,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 10,
    },
  },
  animation: {
    spring: { tension: 60, friction: 8 },
    bounce: { tension: 120, friction: 6 },
    pop: { tension: 90, friction: 8 },
    press: { tension: 200, friction: 10 },
  },
};

export type Theme = typeof theme;
export default theme;
