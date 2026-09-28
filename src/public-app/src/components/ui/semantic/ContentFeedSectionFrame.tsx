import type { ComponentProps } from 'react';
import { Box } from '../box';

type ContentFeedSectionFrameProps = ComponentProps<typeof Box>;

export function ContentFeedSectionFrame(props: ContentFeedSectionFrameProps) {
  return (
    <Box
      {...props}
      component="section"
      sx={{
        display: 'grid',
        rowGap: 'var(--site-page-content-offset)',
        width: '100%',
        scrollMarginTop: 'var(--site-topbar-h)',
        ...props.sx,
      }}
    />
  );
}
