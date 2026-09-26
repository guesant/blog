import { Box, Typography } from '../../ui';
import { Breadcrumbs } from '../../navigation/breadcrumbs';
import type { PageHeaderProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';

export function PageHeader(props: PageHeaderProps) {
  return (
    <Box component="header" visualVariant={props.visualVariant ?? 'pageHeader'}>
      <ConditionalContent condition={Boolean(props.breadcrumbs)}>
        <Breadcrumbs trail={props.breadcrumbs ?? []} />
      </ConditionalContent>
      <Typography variant="h1" visualVariant={props.titleVisualVariant ?? 'pageHeader2'}>
        {props.title}
      </Typography>
      {props.actions}
      <ConditionalContent condition={Boolean(props.description)}>
        <Typography
          color="text.secondary"
          visualVariant={props.descriptionVisualVariant ?? 'pageHeader3'}
        >
          {props.description}
        </Typography>
      </ConditionalContent>
      <ConditionalContent condition={Boolean(props.meta)}>
        <Typography color="text.secondary" visualVariant={props.metaVisualVariant}>
          {props.meta}
        </Typography>
      </ConditionalContent>
    </Box>
  );
}
