import type { ElementType, ReactNode } from 'react';
import { Box } from '../box';

type EditorialFeedItemFrameProps = {
  children: ReactNode;
  component?: ElementType;
};

const frameStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-page-section-gap)',
  border: 0,
  borderRadius: 0,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  textAlign: 'left',
  color: 'inherit',
  textDecoration: 'none',
};

export function EditorialFeedItemFrame(props: EditorialFeedItemFrameProps) {
  return (
    <Box component={props.component} sx={frameStyles}>
      {props.children}
    </Box>
  );
}
