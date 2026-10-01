import type { ReactNode } from 'react';
import { Typography } from '../typography';
import { editorialDescriptionStyles } from '../editorial-typography';

type PageHeaderDescriptionFrameProps = {
  children: ReactNode;
};

export function PageHeaderDescriptionFrame(props: PageHeaderDescriptionFrameProps) {
  return (
    <Typography component="div" color="text.secondary" sx={editorialDescriptionStyles}>
      {props.children}
    </Typography>
  );
}
