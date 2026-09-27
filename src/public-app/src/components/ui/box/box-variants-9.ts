import type { SxProps, Theme } from '@mui/material/styles';

export const boxVariants9: Record<string, SxProps<Theme>> = {
  sectionShell: {
    display: 'grid',
    rowGap: 'var(--site-space-6)',
    paddingBlock: 'var(--site-space-6)',
    textAlign: 'center',
  },
  sectionShellHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--site-space-2)',
    textAlign: 'center',
  },
  sectionShellBody: {
    width: '100%',
    minWidth: 0,
  },
  protectedEmailDialogIconWorking: {
    display: 'inline-flex',
    animation: 'protected-email-pulse 1.6s ease-in-out infinite',
    '@keyframes protected-email-pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.4 },
    },
  },
};
