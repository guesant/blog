'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { domAnimation, LazyMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { NavigationProgress } from '../components/navigation/navigation-progress';
import { ContextualCursor } from '../components/primitives/contextual-cursor';

const grainTexture =
  'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.72%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27 opacity=%27.9%27/%3E%3C/svg%3E")';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#173A63',
      light: '#EAF2FA',
      dark: '#102A46',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1D5FA7',
      light: '#D9EAF8',
      dark: '#144A82',
      contrastText: '#FFFFFF',
    },
    success: { main: '#18794E' },
    warning: { main: '#9A6700' },
    error: { main: '#B42318' },
    info: { main: '#1D5FA7' },
    background: { default: '#F7F9FC', paper: '#FFFFFF' },
    text: { primary: '#172033', secondary: '#5D6978', disabled: '#8B96A5' },
    divider: '#D8E0E9',
    action: {
      hover: 'rgba(29,95,167,.06)',
      selected: 'rgba(29,95,167,.1)',
      focus: 'rgba(29,95,167,.18)',
    },
  },
  spacing: (factor: number) => `calc(var(--site-space-2) * ${factor})`,
  shape: { borderRadius: 'var(--site-radius)' },
  typography: {
    fontFamily: 'var(--font-sans), Arial, sans-serif',
    h1: {
      fontSize: 'var(--site-text-3xl)',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 'var(--site-leading-tight)',
    },
    h2: {
      fontSize: 'var(--site-text-2xl)',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 'var(--site-leading-tight)',
    },
    h3: {
      fontSize: 'var(--site-text-xl)',
      fontWeight: 600,
      lineHeight: 'var(--site-leading-tight)',
    },
    h4: { fontSize: 'var(--site-text-lg)', fontWeight: 600, lineHeight: 'var(--site-leading-tight)' },
    h5: { fontSize: 'var(--site-text-body)', fontWeight: 600, lineHeight: 'var(--site-leading-tight)' },
    h6: { fontSize: 'var(--site-text-sm)', fontWeight: 600, lineHeight: 'var(--site-leading-tight)' },
    button: { textTransform: 'none', fontSize: 'var(--site-text-action)', fontWeight: 500, lineHeight: 'var(--site-leading-normal)' },
    overline: { fontSize: '0.7rem', lineHeight: 1.4, letterSpacing: '0.1em', fontWeight: 700 },
    caption: { fontSize: 'var(--site-text-sm)', lineHeight: 'var(--site-leading-normal)' },
    body1: { fontSize: 'var(--site-text-body)', lineHeight: 'var(--site-leading-relaxed)' },
    body2: { fontSize: 'var(--site-text-sm)', lineHeight: 'var(--site-leading-normal)' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowX: 'hidden',
          overflowWrap: 'break-word',
          backgroundImage: [
            'radial-gradient(62% 48% at 12% -8%, rgba(29,95,167,.09), transparent 60%)',
            'radial-gradient(55% 42% at 104% 18%, rgba(23,58,99,.07), transparent 60%)',
          ].join(', '),
          backgroundAttachment: 'fixed',
          '&::before': {
            position: 'fixed',
            zIndex: 1400,
            inset: 0,
            content: '""',
            pointerEvents: 'none',
            backgroundImage: grainTexture,
            backgroundRepeat: 'repeat',
            backgroundSize: '11.25rem 11.25rem',
            mixBlendMode: 'multiply',
            opacity: 0.05,
          },
        },
        '::selection': { background: '#D9EAF8', color: '#172033' },
        ':focus-visible': {
          outline: '2px solid #1D5FA7',
          outlineOffset: 3,
        },
        '.contextual-cursor': {
          display: 'none',
          position: 'fixed',
          zIndex: 2100,
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'transform, width, height, border-radius',
          transition:
            'opacity 120ms ease-out, background-color 180ms ease-out, border-color 180ms ease-out',
        },
        '.contextual-cursor-dot': {
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: '#102A46',
        },
        '.contextual-cursor-frame': {
          width: 34,
          height: 34,
          border: '1px solid rgba(29,95,167,.58)',
          borderRadius: '999px',
          backgroundColor: 'rgba(234,242,250,.12)',
        },
        '.contextual-cursor-frame[data-active="true"]': {
          borderColor: 'rgba(29,95,167,.42)',
          backgroundColor: 'rgba(217,234,248,.14)',
        },
        '@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)': {
          '.contextual-cursor': { display: 'block' },
          'body.custom-cursor-enabled, body.custom-cursor-enabled *': {
            cursor: 'none !important',
          },
          'body.custom-cursor-enabled input, body.custom-cursor-enabled textarea, body.custom-cursor-enabled [contenteditable="true"]':
            {
              cursor: 'text !important',
            },
          'body.custom-cursor-enabled select, body.custom-cursor-enabled [data-native-cursor]': {
            cursor: 'auto !important',
          },
          'body.custom-cursor-enabled.custom-cursor-suspended, body.custom-cursor-enabled.custom-cursor-suspended *':
            {
              cursor: 'auto !important',
            },
          'body.custom-cursor-enabled.custom-cursor-suspended .contextual-cursor': {
            display: 'none',
          },
        },
        '#nprogress': { pointerEvents: 'none' },
        '#nprogress .bar': {
          position: 'fixed',
          zIndex: 2000,
          top: 0,
          left: 0,
          width: '100%',
          height: 3,
          background: '#1D5FA7',
          transition: 'transform 180ms ease-out',
        },
        '#nprogress .peg': {
          position: 'absolute',
          right: 0,
          width: 80,
          height: '100%',
          boxShadow: '0 0 0.65rem #1D5FA7',
          opacity: 0.72,
          transform: 'rotate(2deg) translateY(-1px)',
        },
        '#nprogress .spinner': { display: 'none' },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '2px solid #1D5FA7',
            outlineOffset: 3,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 'var(--site-radius)', padding: '0 var(--site-space-3)', minHeight: '2.25rem' },
        sizeSmall: { padding: '0 var(--site-space-2)', minHeight: '2rem' },
        sizeLarge: { padding: '0 var(--site-space-4)', minHeight: '2.5rem' },
        text: { padding: '0 var(--site-space-2)' },
      },
    },
    MuiLink: {
      defaultProps: { color: 'secondary' },
      styleOverrides: { root: { textUnderlineOffset: '0.2em' } },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: '0.375rem', fontWeight: 500 } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D8E0E9' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1D5FA7' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1D5FA7',
            borderWidth: '1px',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { '&.Mui-focused': { color: '#1D5FA7' } },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0, variant: 'outlined' },
      styleOverrides: { root: { borderColor: '#D8E0E9', borderRadius: '0.5rem' } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: '0.375rem',
          border: '1px solid #D8E0E9',
          borderRadius: '0.5rem',
          boxShadow: '0 0.75rem 1.75rem rgba(16,42,70,.1)',
        },
        list: { padding: '0.375rem' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          borderRadius: '0.375rem',
          padding: '0.5rem 0.75rem',
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: '0.7rem',
          lineHeight: 1.4,
          letterSpacing: '0.1em',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#5D6978',
          backgroundColor: 'transparent',
          padding: '0.5rem 0.75rem 0.25rem',
        },
      },
    },
  },
});

type ThemeRegistryProps = { children: ReactNode };

export function ThemeRegistry(props: ThemeRegistryProps) {
  const { children } = props;
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LazyMotion features={domAnimation} strict>
          <NavigationProgress />
          <ContextualCursor />
          {children}
        </LazyMotion>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
