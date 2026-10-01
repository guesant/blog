import type { ComponentProps } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { Box as BaseComponent } from '@/components/ui/box';
import { mergeSx } from '../sx';

const baseStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  boxSizing: 'border-box',
  py: { xs: 5, md: 6 },
  px: { xs: 3, md: 4 },
  borderTop: 1,
  borderBottom: 1,
  borderColor: 'divider',
  textAlign: 'center',
};

type EmptyStateFrameProps = ComponentProps<typeof BaseComponent> & { topDivider?: boolean };

export function EmptyStateFrame(props: EmptyStateFrameProps) {
  const { topDivider, sx, ...rest } = props;

  return (
    <BaseComponent
      {...rest}
      sx={mergeSx(mergeSx(baseStyles, topDivider === false ? { borderTop: 0 } : undefined), sx)}
    />
  );
}
