import type { ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';
import { Typography } from '../typography';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { PageHeaderLayout } from './styles';
import { pageHeaderLayoutStyles, pageHeaderSlotStyles } from './styles';

export type { PageHeaderLayout } from './styles';

export type PageHeaderFrameProps = {
  layout: PageHeaderLayout;
  breadcrumbs?: ReactNode;
  title: string;
  description?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
  actions?: ReactNode;
};

export function PageHeaderFrame(props: PageHeaderFrameProps) {
  const slotStyles = pageHeaderSlotStyles[props.layout];

  return (
    <Box component="header" sx={pageHeaderLayoutStyles[props.layout]}>
      {props.breadcrumbs}
      {props.breadcrumbs ? <Divider /> : null}
      <Typography variant="h1" sx={slotStyles.title}>
        {props.title}
      </Typography>
      {props.actions}
      <ConditionalContent
        condition={Boolean(props.description)}
        content={
          <Typography color="text.secondary" sx={slotStyles.description}>
            {props.description}
          </Typography>
        }
      />
      <ConditionalContent
        condition={Boolean(props.meta)}
        content={
          <Typography color="text.secondary" sx={slotStyles.meta}>
            {props.meta}
          </Typography>
        }
      />
      {props.metadata}
    </Box>
  );
}
