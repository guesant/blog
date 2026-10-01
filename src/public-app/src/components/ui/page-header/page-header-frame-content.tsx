import type { ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';
import { Typography } from '../typography';
import { ConditionalContent } from '../../primitives/conditional-content';
import { editorialDescriptionStyles, editorialPageTitleStyles } from '../editorial-typography';

export type PageHeaderFrameContentProps = {
  maxWidth: string;
  breadcrumbs?: ReactNode;
  title: string;
  description?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
  actions?: ReactNode;
};

export function PageHeaderFrameContent(props: PageHeaderFrameContentProps) {
  return (
    <Box
      component="header"
      sx={{ display: 'grid', rowGap: 'var(--site-page-content-offset)', maxWidth: props.maxWidth }}
    >
      {props.breadcrumbs}
      {props.breadcrumbs ? <Divider /> : null}
      <Box sx={{ display: 'grid', rowGap: 'var(--site-space-5)' }}>
        <Typography variant="h1" sx={editorialPageTitleStyles}>
          {props.title}
        </Typography>
        {props.actions}
        <ConditionalContent
          condition={Boolean(props.description)}
          content={
            <Typography color="text.secondary" sx={editorialDescriptionStyles}>
              {props.description}
            </Typography>
          }
        />
        <ConditionalContent
          condition={Boolean(props.meta)}
          content={
            <Typography color="text.secondary" sx={{ margin: 0 }}>
              {props.meta}
            </Typography>
          }
        />
        {props.metadata}
      </Box>
    </Box>
  );
}
