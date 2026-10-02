import type { ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';
import { Typography } from '../typography';
import { ConditionalContent } from '../../primitives/conditional-content';
import { editorialPageTitleStyles } from '../editorial-typography';
import { PageHeaderDescriptionFrame } from './page-header-description-frame';
import { PageHeaderSupportingContentFrame } from './page-header-supporting-content-frame';
import { PageHeaderTitleFrame } from './page-header-title-frame';

export type PageHeaderFrameContentProps = {
  maxWidth: string;
  breadcrumbs?: ReactNode;
  titleAdornment?: ReactNode;
  title: string;
  description?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
  actions?: ReactNode;
};

export function PageHeaderFrameContent(props: PageHeaderFrameContentProps) {
  const hasDescription = Boolean(props.description);

  const hasSupportingContent = Boolean(props.actions || props.meta || props.metadata);

  return (
    <Box
      component="header"
      sx={{ display: 'grid', rowGap: 'var(--site-page-content-offset)', maxWidth: props.maxWidth }}
    >
      {props.breadcrumbs}
      {props.breadcrumbs ? <Divider /> : null}
      <PageHeaderTitleFrame adornment={props.titleAdornment}>
        <Typography variant="h1" sx={editorialPageTitleStyles}>
          {props.title}
        </Typography>
      </PageHeaderTitleFrame>
      <Divider />
      <ConditionalContent
        condition={hasDescription}
        content={<PageHeaderDescriptionFrame>{props.description}</PageHeaderDescriptionFrame>}
      />
      <ConditionalContent condition={hasDescription} content={<Divider />} />
      <ConditionalContent
        condition={hasSupportingContent}
        content={
          <PageHeaderSupportingContentFrame
            actions={props.actions}
            meta={props.meta}
            metadata={props.metadata}
          />
        }
      />
      <ConditionalContent condition={hasSupportingContent} content={<Divider />} />
    </Box>
  );
}
