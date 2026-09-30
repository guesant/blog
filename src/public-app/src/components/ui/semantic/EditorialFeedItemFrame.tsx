import type { ElementType, ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';

type EditorialFeedItemFrameProps = {
  children: ReactNode;
  component?: ElementType;
};

const frameStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-space-4)',
  paddingBlock: 'var(--site-space-4)',
  border: 0,
  '&:last-child > hr': {
    display: 'none',
  },
  borderRadius: 0,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  textAlign: 'left',
  color: 'inherit',
  textDecoration: 'none',
};

const dividerStyles = {
  width: '100%',
  borderColor: 'var(--site-border)',
  borderStyle: 'dotted',
  borderWidth: 'var(--site-border-width) 0 0',
};

export function EditorialFeedItemFrame(props: EditorialFeedItemFrameProps) {
  return (
    <Box component={props.component} sx={frameStyles}>
      {props.children}
      <Divider sx={dividerStyles} />
    </Box>
  );
}
