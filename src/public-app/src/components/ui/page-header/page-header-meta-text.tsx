import type { ReactNode } from 'react';
import { Typography } from '../typography';

type PageHeaderMetaTextProps = {
  children: ReactNode;
};

export function PageHeaderMetaText(props: PageHeaderMetaTextProps) {
  return (
    <Typography color="text.secondary" sx={{ margin: 0 }}>
      {props.children}
    </Typography>
  );
}
