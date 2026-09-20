const grainTexture =
  'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.72%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27 opacity=%27.9%27/%3E%3C/svg%3E")';

export const themeComponentsBase = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFamily: 'var(--site-font-family)',
        fontSize: 'var(--site-text-body)',
        lineHeight: 'var(--site-leading-relaxed)',
        backgroundColor: 'var(--site-surface)',
        color: 'var(--site-text-primary)',
        overflowX: 'hidden',
        overflowWrap: 'break-word',
        backgroundImage: 'none',
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
      '::selection': {
        background: 'var(--site-accent-bg)',
        color: 'var(--site-text-primary)',
      },
      ':focus-visible': {
        outline: 'var(--site-border-width-focus) solid var(--site-primary)',
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
        backgroundColor: 'var(--site-primary-hover)',
      },
      '.contextual-cursor-frame': {
        width: 34,
        height: 34,
        border:
          'var(--site-border-width) solid color-mix(in srgb, var(--site-primary) 58%, transparent)',
        borderRadius: '999px',
        backgroundColor: 'color-mix(in srgb, var(--site-accent-bg) 12%, transparent)',
      },
      '.contextual-cursor-frame[data-active="true"]': {
        borderColor: 'color-mix(in srgb, var(--site-primary) 42%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--site-accent-bg) 14%, transparent)',
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
        background: 'var(--site-primary)',
        transition: 'transform 180ms ease-out',
      },
      '#nprogress .peg': {
        position: 'absolute',
        right: 0,
        width: 80,
        height: '100%',
        boxShadow: '0 0 0.65rem var(--site-primary)',
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
          outline: 'var(--site-border-width-focus) solid var(--site-primary)',
          outlineOffset: 3,
        },
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        '&.Mui-selected': {
          zIndex: 1,
        },
      },
    },
  },
};
