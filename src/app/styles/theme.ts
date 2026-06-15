import { createGlobalStyle } from 'styled-components';

// ─── M3 Color Tokens (paleta FIFA World Cup 2026: púrpura profundo + dorado de acento)
export const theme = {
  colors: {
    // Primary — púrpura profundo (marca Mundial 2026)
    primary:              '#4B2D7F',
    onPrimary:            '#FFFFFF',
    primaryContainer:     '#E9DDFF',
    onPrimaryContainer:   '#190064',

    // Secondary (neutro con tinte cálido sutil)
    secondary:            '#625B71',
    onSecondary:          '#FFFFFF',
    secondaryContainer:   '#E8DEF8',
    onSecondaryContainer: '#1D192B',

    // Tertiary — dorado tipo trofeo
    tertiary:             '#7E5700',
    onTertiary:           '#FFFFFF',
    tertiaryContainer:    '#FFDF9E',
    onTertiaryContainer:  '#281800',

    // Error
    error:                '#BA1A1A',
    onError:              '#FFFFFF',
    errorContainer:       '#FFDAD6',
    onErrorContainer:     '#410002',

    // Tonos de surface — fondo blanco puro, containers tintados con púrpura sutil
    background:           '#FFFFFF',
    onBackground:         '#1D1B20',
    surface:              '#FFFBFF',
    onSurface:            '#1D1B20',
    surfaceVariant:       '#E7E0EC',
    onSurfaceVariant:     '#49454F',

    // Surface containers (low → high = sutil → prominente)
    surfaceContainerLowest:  '#FFFFFF',
    surfaceContainerLow:     '#F7F2FA',
    surfaceContainer:        '#F1ECF4',
    surfaceContainerHigh:    '#EBE6EE',
    surfaceContainerHighest: '#E5E0E8',

    // Outline
    outline:        '#79747E',
    outlineVariant: '#CAC4D0',

    // Inverse
    inverseSurface:   '#322F35',
    inverseOnSurface: '#F5EFF7',
    inversePrimary:   '#CFBCFF',

    // Estados semánticos (patrón container de M3)
    success:          '#386A20',
    successContainer: '#B7F397',
    warning:          '#7B5800',
    warningContainer: '#FFDEA8',

    // ─── Aliases legacy (mantienen compatibilidad con componentes existentes) ───
    danger:        '#BA1A1A',    // = error
    text:          '#1D1B20',   // = onBackground
    textSecondary: '#49454F',   // = onSurfaceVariant
    border:        '#CAC4D0',   // = outlineVariant
    scrim:         'rgba(0,0,0,0.5)',
  },

  // ─── M3 Shape Scale ───────────────────────────────────────────────────────
  shape: {
    none:       '0px',
    extraSmall: '4px',
    small:      '8px',
    medium:     '12px',
    large:      '16px',
    extraLarge: '28px',
    full:       '9999px',
  },

  // ─── borderRadius legacy (actualizado a valores M3) ──────────────────────
  borderRadius: {
    sm: '8px',   // M3 small
    md: '12px',  // M3 medium
    lg: '16px',  // M3 large
  },

  // ─── Spacing (sin cambios) ───────────────────────────────────────────────
  spacing: {
    xs:  '0.25rem',
    sm:  '0.5rem',
    md:  '1rem',
    lg:  '1.5rem',
    xl:  '2rem',
    xxl: '3rem',
  },

  // ─── M3 Elevation (sombra + tonal surface overlay) ───────────────────────
  elevation: {
    0: 'none',
    1: '0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
    2: '0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
    3: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)',
    4: '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px rgba(0,0,0,0.3)',
    5: '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.3)',
  },

  // ─── Shadows legacy (mapeados a niveles de M3 Elevation) ─────────────────
  shadows: {
    sm: '0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
    md: '0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
    lg: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)',
  },

  // ─── M3 Typography Scale ─────────────────────────────────────────────────
  typography: {
    displayLarge:  { fontSize: '3.5625rem', lineHeight: '4rem',    fontWeight: 400 },
    displayMedium: { fontSize: '2.8125rem', lineHeight: '3.25rem', fontWeight: 400 },
    displaySmall:  { fontSize: '2.25rem',   lineHeight: '2.75rem', fontWeight: 400 },
    headlineLarge:  { fontSize: '2rem',     lineHeight: '2.5rem',  fontWeight: 400 },
    headlineMedium: { fontSize: '1.75rem',  lineHeight: '2.25rem', fontWeight: 400 },
    headlineSmall:  { fontSize: '1.5rem',   lineHeight: '2rem',    fontWeight: 400 },
    titleLarge:  { fontSize: '1.375rem', lineHeight: '1.75rem', fontWeight: 400 },
    titleMedium: { fontSize: '1rem',     lineHeight: '1.5rem',  fontWeight: 500 },
    titleSmall:  { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 500 },
    bodyLarge:   { fontSize: '1rem',     lineHeight: '1.5rem',  fontWeight: 400 },
    bodyMedium:  { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 400 },
    bodySmall:   { fontSize: '0.75rem',  lineHeight: '1rem',    fontWeight: 400 },
    labelLarge:  { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 500 },
    labelMedium: { fontSize: '0.75rem',  lineHeight: '1rem',    fontWeight: 500 },
    labelSmall:  { fontSize: '0.6875rem',lineHeight: '1rem',    fontWeight: 500 },
  },

  // ─── M3 State Layer Opacities ────────────────────────────────────────────
  state: {
    hover:    '0.08',
    focused:  '0.12',
    pressed:  '0.12',
    dragged:  '0.16',
    disabled: '0.38',
  },
};

// ─── Estilos globales ─────────────────────────────────────────────────────────
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.background};
    color: ${theme.colors.onBackground};
    font-size: 1rem;
    line-height: 1.5;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
  }
`;
