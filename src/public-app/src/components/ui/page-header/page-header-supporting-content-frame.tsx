import type { ReactNode } from 'react';
import { Box } from '../box';
import { ConditionalContent } from '../../primitives/conditional-content';
import { PageHeaderMetaText } from './page-header-meta-text';

type PageHeaderSupportingContentFrameProps = {
  actions?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
};

export function PageHeaderSupportingContentFrame(props: PageHeaderSupportingContentFrameProps) {
  return (
    <Box sx={{ display: 'grid', rowGap: 'var(--site-space-5)' }}>
      {props.actions}
      <ConditionalContent
        condition={Boolean(props.meta)}
        content={<PageHeaderMetaText>{props.meta}</PageHeaderMetaText>}
      />
      {props.metadata}
    </Box>
  );
}
