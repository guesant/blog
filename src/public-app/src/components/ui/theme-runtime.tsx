'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, type Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { ThemeMotionLayer } from './theme-motion-layer';

type ThemeRuntimeProps = { theme: Theme; children: ReactNode; contextualCursorEnabled: boolean };

export function ThemeRuntime(props: ThemeRuntimeProps) {
  return (
    <ThemeProvider theme={props.theme} storageManager={null}>
      <CssBaseline />
      <ThemeMotionLayer contextualCursorEnabled={props.contextualCursorEnabled}>
        {props.children}
      </ThemeMotionLayer>
    </ThemeProvider>
  );
}
