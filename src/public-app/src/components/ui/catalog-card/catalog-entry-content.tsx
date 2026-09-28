import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { Typography } from '../typography';

type CatalogEntryContentProps = {
  meta?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  titleComponent?: 'h2' | 'h3';
  titleVariant?: 'h3' | 'h5';
  descriptionLayout?: 'default' | 'reference';
};

const descriptionStyles = {
  default: {},
  reference: { fontSize: 'var(--site-text-body)', maxWidth: '48ch' },
};

export function CatalogEntryContent(props: CatalogEntryContentProps) {
  return (
    <>
      {props.meta}
      <Typography component={props.titleComponent ?? 'h2'} variant={props.titleVariant ?? 'h5'}>
        {props.title}
      </Typography>
      <ConditionalContent
        condition={Boolean(props.description)}
        content={
          <Typography
            color="text.secondary"
            sx={descriptionStyles[props.descriptionLayout ?? 'default']}
          >
            {props.description}
          </Typography>
        }
      />
    </>
  );
}
