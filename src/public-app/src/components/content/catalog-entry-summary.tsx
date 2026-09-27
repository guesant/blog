import type { ReactNode } from 'react';
import { ConditionalContent } from '../primitives/conditional-content';
import { Typography } from '../ui';

type CatalogEntrySummaryProps = {
  meta?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  titleComponent?: 'h2' | 'h3';
  titleVariant?: string;
  titleVisualVariant?: string;
  descriptionVisualVariant?: string;
};

export function CatalogEntrySummary(props: CatalogEntrySummaryProps) {
  return (
    <>
      {props.meta}
      <Typography
        component={props.titleComponent ?? 'h2'}
        variant={props.titleVariant ?? 'h5'}
        visualVariant={props.titleVisualVariant}
      >
        {props.title}
      </Typography>
      <ConditionalContent
        condition={Boolean(props.description)}
        content={
          <Typography color="text.secondary" visualVariant={props.descriptionVisualVariant}>
            {props.description}
          </Typography>
        }
      />
    </>
  );
}
