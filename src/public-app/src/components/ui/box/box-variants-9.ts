import type { SxProps, Theme } from '@mui/material/styles';

export const boxVariants9: Record<string, SxProps<Theme>> = {
  protectedEmailDialogIconWorking: {
    display: 'inline-flex',
    animation: 'protected-email-pulse 1.6s ease-in-out infinite',
    '@keyframes protected-email-pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.4 },
    },
  },
};
