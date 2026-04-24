import { createGlobalStyle } from 'styled-components';

// ─── M3 Color Tokens ────────────────────────────────────────────────────────
export const theme = {
  colors: {
    // Primary
    primary:              '#1B5FA8',
    onPrimary:            '#FFFFFF',
    primaryContainer:     '#D3E4FF',
    onPrimaryContainer:   '#001B3D',

    // Secondary (neutral blue-gray)
    secondary:            '#545F71',
    onSecondary:          '#FFFFFF',
    secondaryContainer:   '#D8E3F8',
    onSecondaryContainer: '#111C2B',

    // Tertiary (warm amber – keeps existing "secondary" orange feel)
    tertiary:             '#B25B04',
    onTertiary:           '#FFFFFF',
    tertiaryContainer:    '#FFDCC2',
    onTertiaryContainer:  '#3A1700',

    // Error
    error:                '#BA1A1A',
    onError:              '#FFFFFF',
    errorContainer:       '#FFDAD6',
    onErrorContainer:     '#410002',

    // Surface tones
    background:           '#F3F3FA',
    onBackground:         '#1A1C1E',
    surface:              '#FAFAFF',
    onSurface:            '#1A1C1E',
    surfaceVariant:       '#DFE2EB',
    onSurfaceVariant:     '#43474E',

    // Surface containers (low → high = subtle → prominent)
    surfaceContainerLowest:  '#FFFFFF',
    surfaceContainerLow:     '#F3F3FA',
    surfaceContainer:        '#EDEEF4',
    surfaceContainerHigh:    '#E7E8EE',
    surfaceContainerHighest: '#E2E2E9',

    // Outline
    outline:        '#73777F',
    outlineVariant: '#C3C7CF',

    // Inverse
    inverseSurface:   '#2F3033',
    inverseOnSurface: '#F1F0F7',
    inversePrimary:   '#A5C8FF',

    // Semantic status (M3 container pattern)
    success:          '#386A20',
    successContainer: '#B7F397',
    warning:          '#7B5800',
    warningContainer: '#FFDEA8',

    // ─── Legacy aliases (keeps existing components working) ─────────────────
    danger:        '#BA1A1A',    // = error
    text:          '#1A1C1E',   // = onBackground
    textSecondary: '#43474E',   // = onSurfaceVariant
    border:        '#C3C7CF',   // = outlineVariant
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

  // ─── Legacy borderRadius (updated to M3 values) ───────────────────────────
  borderRadius: {
    sm: '8px',   // M3 small
    md: '12px',  // M3 medium
    lg: '16px',  // M3 large
  },

  // ─── Spacing (unchanged) ──────────────────────────────────────────────────
  spacing: {
    xs:  '0.25rem',
    sm:  '0.5rem',
    md:  '1rem',
    lg:  '1.5rem',
    xl:  '2rem',
    xxl: '3rem',
  },

  // ─── M3 Elevation (shadow + tonal surface overlay) ────────────────────────
  elevation: {
    0: 'none',
    1: '0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15)',
    2: '0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)',
    3: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)',
    4: '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px rgba(0,0,0,0.3)',
    5: '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.3)',
  },

  // ─── Legacy shadows (aliased to M3 elevation levels) ─────────────────────
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

// ─── Global Styles ────────────────────────────────────────────────────────────
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
