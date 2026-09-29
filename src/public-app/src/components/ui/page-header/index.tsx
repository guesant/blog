import type { ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';
import { Typography } from '../typography';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { PageHeaderVariant } from './styles';
import { pageHeaderSlotStyles, pageHeaderVariantStyles } from './styles';

export type { PageHeaderVariant } from './styles';

export type PageHeaderFrameProps = {
  variant: PageHeaderVariant;
  breadcrumbs?: ReactNode;
  title: string;
  description?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
  actions?: ReactNode;
};

export function PageHeaderFrame(props: PageHeaderFrameProps) {
  const slotStyles = pageHeaderSlotStyles[props.variant];

  return (
    <Box component="header" sx={pageHeaderVariantStyles[props.variant]}>
      {props.breadcrumbs}
      {props.breadcrumbs ? <Divider /> : null}
      <Box sx={{ display: 'grid', rowGap: 'var(--site-space-5)' }}>
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
    </Box>
  );
}
