import type { ReactNode } from 'react';
import { Box } from '../box';

type EditorialFeedItemFooterFrameProps = {
  children: ReactNode;
};

const footerStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: { xs: 'flex-start', sm: 'space-between' },
  rowGap: 'var(--site-gap-stack)',
  columnGap: 'var(--site-gap-cluster)',
};

export function EditorialFeedItemFooterFrame(props: EditorialFeedItemFooterFrameProps) {
  return <Box sx={footerStyles}>{props.children}</Box>;
}
