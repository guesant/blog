import type { ReactNode } from 'react';
import { Box } from '../box';

type PageHeaderTitleFrameProps = {
  adornment?: ReactNode;
  children: ReactNode;
};

export function PageHeaderTitleFrame(props: PageHeaderTitleFrameProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--site-gap-cluster)',
      }}
    >
      {props.adornment}
      {props.children}
    </Box>
  );
}
