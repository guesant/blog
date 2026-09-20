import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

export type UiProps = Record<string, unknown> & {
  sx?: SxProps<Theme>;
  visualVariant?: string;
};

export type UiVariants = Record<string, SxProps<Theme>>;

export function createUiComponent<T, P extends object = UiProps>(
  render: (props: P) => ReactNode,
  variants: UiVariants = {},
): T & ((props: P & UiProps) => ReactNode) {
  return ((props: P & UiProps) => {
    const { visualVariant, ...muiProps } = props;

    const visualSx = variants[visualVariant ?? ''];

    const nextProps: UiProps = visualSx
      ? { ...muiProps, sx: [visualSx, muiProps.sx] as SxProps<Theme> }
      : muiProps;

    return render(nextProps as P);
  }) as T & ((props: P & UiProps) => ReactNode);
}
