import type { ReactNode } from 'react';
import { Box } from '../box';

type PageHeaderTitleFrameProps = {
  adornment?: ReactNode;
  children: ReactNode;
  inlineAdornment?: boolean;
};

export function PageHeaderTitleFrame(props: PageHeaderTitleFrameProps) {
  return (
    <Box
      sx={{
        ...(props.inlineAdornment
          ? {
              display: 'block',
              '& > svg': {
                display: 'inline-block',
                marginInlineEnd: 'var(--site-gap-cluster)',
                verticalAlign: 'middle',
              },
            }
          : {
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--site-gap-cluster)',
            }),
      }}
    >
      {props.adornment}
      {props.children}
    </Box>
  );
}
