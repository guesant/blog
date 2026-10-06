import type { ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';
import { ConditionalContent } from '../../primitives/conditional-content';
import { PageHeaderDescriptionFrame } from './page-header-description-frame';
import { PageHeaderSupportingContentFrame } from './page-header-supporting-content-frame';
import { PageHeaderTitleFrame } from './page-header-title-frame';
import { PageHeaderTitle } from './page-header-title';
import { pageHeaderHasSupportingContent } from './page-header-has-supporting-content';

export type PageHeaderFrameContentProps = {
  maxWidth: string;
  breadcrumbs?: ReactNode;
  titleAdornment?: ReactNode;
  titleAdornmentInline?: boolean;
  title: string;
  description?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
  actions?: ReactNode;
};

export function PageHeaderFrameContent(props: PageHeaderFrameContentProps) {
  const hasSupportingContent = pageHeaderHasSupportingContent(props);

  return (
    <Box
      component="header"
      sx={{ display: 'grid', rowGap: 'var(--site-page-content-offset)', maxWidth: props.maxWidth }}
    >
      {props.breadcrumbs}
      {props.breadcrumbs ? <Divider /> : null}
      <PageHeaderTitleFrame
        adornment={props.titleAdornment}
        inlineAdornment={props.titleAdornmentInline}
      >
        <PageHeaderTitle title={props.title} inlineAdornment={props.titleAdornmentInline} />
      </PageHeaderTitleFrame>
      <Divider />
      <ConditionalContent
        condition={Boolean(props.description)}
        content={<PageHeaderDescriptionFrame>{props.description}</PageHeaderDescriptionFrame>}
      />
      <ConditionalContent condition={Boolean(props.description)} content={<Divider />} />
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
