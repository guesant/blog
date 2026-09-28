import type { ReactNode } from 'react';
import { Box } from '../box';

type CaseFeaturedFooterFrameProps = { children: ReactNode };

const footerStyles = {
  marginBlockStart: 'auto',
  paddingBlockStart: 3,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 2,
  flexWrap: 'wrap',
};

export function CaseFeaturedFooterFrame(props: CaseFeaturedFooterFrameProps) {
  return <Box sx={footerStyles}>{props.children}</Box>;
}
