'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { domAnimation, LazyMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { NavigationProgress } from '../components/navigation/navigation-progress';
import { ContextualCursor } from '../components/primitives/contextual-cursor';

const grainTexture =
  'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.72%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27 opacity=%27.9%27/%3E%3C/svg%3E")';

const spacingTokens: Record<number, string> = {
  0: '0',
  0.5: 'var(--site-space-1)',
  1: 'var(--site-space-2)',
  1.5: 'var(--site-space-3)',
  2: 'var(--site-space-4)',
  2.5: 'var(--site-space-5)',
  3: 'var(--site-space-6)',
  3.5: 'var(--site-space-7)',
  4: 'var(--site-space-8)',
  5: 'var(--site-space-10)',
  6: 'var(--site-space-12)',
  8: 'var(--site-space-16)',
};

function siteSpacing(factor: number) {
  return spacingTokens[factor] ?? `calc(var(--site-space-2) * ${factor})`;
}

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
  spacing: siteSpacing,
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: 'var(--site-font-family)',
    h1: {
      fontSize: 'var(--site-text-3xl)',
      fontWeight: 'var(--site-weight-bold)',
      letterSpacing: 'var(--site-letter-heading)',
      lineHeight: 'var(--site-leading-tight)',
    },
    h2: {
      fontSize: 'var(--site-text-2xl)',
      fontWeight: 'var(--site-weight-bold)',
      letterSpacing: 'var(--site-letter-heading)',
      lineHeight: 'var(--site-leading-tight)',
    },
    h3: {
      fontSize: 'var(--site-text-xl)',
      fontWeight: 'var(--site-weight-semibold)',
      lineHeight: 'var(--site-leading-tight)',
    },
    h4: { fontSize: 'var(--site-text-lg)', fontWeight: 'var(--site-weight-semibold)', lineHeight: 'var(--site-leading-tight)' },
    h5: { fontSize: 'var(--site-text-body)', fontWeight: 'var(--site-weight-semibold)', lineHeight: 'var(--site-leading-tight)' },
    h6: { fontSize: 'var(--site-text-sm)', fontWeight: 'var(--site-weight-semibold)', lineHeight: 'var(--site-leading-tight)' },
    button: {
      textTransform: 'none',
      fontFamily: 'var(--site-font-action)',
      fontSize: 'var(--site-text-action)',
      fontWeight: 'var(--site-weight-medium)',
      lineHeight: 'var(--site-leading-normal)',
    },
    overline: {
      fontSize: 'var(--site-text-xs)',
      lineHeight: 'var(--site-leading-normal)',
      letterSpacing: 'var(--site-letter-label)',
      fontWeight: 'var(--site-weight-semibold)',
    },
    caption: { fontSize: 'var(--site-text-sm)', lineHeight: 'var(--site-leading-normal)' },
    body1: { fontSize: 'var(--site-text-body)', lineHeight: 'var(--site-leading-relaxed)' },
    body2: { fontSize: 'var(--site-text-sm)', lineHeight: 'var(--site-leading-normal)' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'var(--site-font-family)',
          fontSize: 'var(--site-text-body)',
          lineHeight: 'var(--site-leading-relaxed)',
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
      defaultProps: { disableRipple: true },
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
        root: {
          borderRadius: 'var(--site-radius)',
          fontFamily: 'var(--site-font-action)',
          padding: 'var(--site-action-py) var(--site-action-px)',
          minHeight: 'var(--site-control-h)',
          '& .MuiButton-startIcon': {
            marginLeft: 0,
            marginRight: 'var(--site-space-2)',
          },
          '& .MuiButton-endIcon': {
            marginRight: 0,
            marginLeft: 'var(--site-space-2)',
          },
        },
        sizeSmall: {
          padding: 'var(--site-action-py) var(--site-action-px)',
          minHeight: 'var(--site-control-h-sm)',
        },
        sizeLarge: {
          padding: 'var(--site-action-py) var(--site-action-px)',
          minHeight: 'var(--site-control-h-lg)',
        },
        text: { padding: 'var(--site-action-py) var(--site-action-px)' },
      },
    },
    MuiLink: {
      defaultProps: { color: 'secondary' },
      styleOverrides: { root: { textUnderlineOffset: 'var(--site-space-1)' } },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 'var(--site-radius)',
          padding: 'var(--site-action-py) var(--site-action-px)',
          fontSize: 'var(--site-text-sm)',
          fontWeight: 'var(--site-weight-medium)',
          lineHeight: 'var(--site-leading-normal)',
        },
        label: { padding: 0 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 'var(--site-control-h)',
          borderRadius: 'var(--site-radius)',
          backgroundColor: 'var(--site-surface)',
          fontFamily: 'var(--site-font-action)',
          fontSize: 'var(--site-text-form)',
          lineHeight: 'var(--site-leading-normal)',
          '& .MuiOutlinedInput-input': {
            fontFamily: 'var(--site-font-action)',
            padding: 'var(--site-inset-control)',
          },
          '&.MuiInputBase-sizeSmall': {
            minHeight: 'var(--site-control-h-sm)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--site-border-strong)',
            borderWidth: 'var(--site-border-width)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--site-primary)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--site-primary)',
            borderWidth: 'var(--site-border-width)',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--site-font-action)',
          fontSize: 'var(--site-text-xs)',
          lineHeight: 'var(--site-leading-normal)',
          letterSpacing: 'var(--site-letter-label)',
          '&.Mui-focused': { color: 'var(--site-primary)' },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0, variant: 'outlined' },
      styleOverrides: {
        root: { borderColor: 'var(--site-border)', borderRadius: 'var(--site-radius)' },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 'var(--site-space-2)',
          border: 'var(--site-border-width) solid var(--site-border)',
          borderRadius: 'var(--site-radius-lg)',
          boxShadow: 'var(--site-shadow-popover)',
        },
        list: { padding: 'var(--site-space-1)' },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 'var(--site-text-sm)',
          borderRadius: 'var(--site-radius-lg)',
          padding: 'var(--site-inset-control)',
          minHeight: 'var(--site-control-h-sm)',
          lineHeight: 'var(--site-leading-normal)',
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          fontSize: 'var(--site-text-xs)',
          lineHeight: 'var(--site-leading-normal)',
          letterSpacing: 'var(--site-letter-label)',
          fontWeight: 'var(--site-weight-semibold)',
          textTransform: 'uppercase',
          color: 'var(--site-text-secondary)',
          backgroundColor: 'transparent',
          padding: 'var(--site-space-2) var(--site-space-3) var(--site-space-1)',
        },
      },
    },
  },
});

type ThemeRegistryProps = { children: ReactNode };

export function ThemeRegistry(props: ThemeRegistryProps) {
  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LazyMotion features={domAnimation} strict>
        <NavigationProgress />
        <ContextualCursor />
        {children}
      </LazyMotion>
    </ThemeProvider>
  );
}
