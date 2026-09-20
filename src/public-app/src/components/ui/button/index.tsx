import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { forwardRef } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { buttonVariants } from './variants';
import { siteButtonVariants, type SiteButtonVariant } from './site-variants';

export type { SiteButtonVariant } from './site-variants';

declare module '@mui/material/Button' {
  interface ButtonOwnProps {
    siteVariant?: SiteButtonVariant;
    visualVariant?: string;
  }
}

export type { ButtonProps } from '@mui/material/Button';

const ButtonImplementation = forwardRef<HTMLButtonElement, MuiButtonProps>(
  function Button(props, ref) {
    const { siteVariant, visualVariant, sx, variant, ...muiProps } = props;

    const normalizedSiteVariant = (siteVariant ?? 'default') as SiteButtonVariant;

    const effectiveVariant = siteVariant === 'breadcrumb' ? 'text' : variant;

    const composedSx = [
      siteButtonVariants[normalizedSiteVariant],
      buttonVariants[visualVariant ?? ''],
      ...(Array.isArray(sx) ? sx : [sx]),
    ] as SxProps<Theme>;

    return <MuiButton ref={ref} {...muiProps} variant={effectiveVariant} sx={composedSx} />;
  },
);

export const Button = ButtonImplementation as typeof MuiButton;
