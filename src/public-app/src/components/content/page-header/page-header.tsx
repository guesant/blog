import { Box, Typography } from '../../ui';
import { Breadcrumbs } from '../../navigation/breadcrumbs';
import type { PageHeaderProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';

export function PageHeader(props: PageHeaderProps) {
  const { eyebrow, title, description, actions, breadcrumbs } = props;

  return (
    <Box component="header" visualVariant="pageHeader">
      <ConditionalContent condition={Boolean(breadcrumbs)}>
        <Breadcrumbs trail={breadcrumbs ?? []} />
      </ConditionalContent>
      <Typography variant="overline" color="text.secondary" visualVariant="pageHeader">
        {eyebrow}
      </Typography>
      <Typography variant="h1" visualVariant="pageHeader2">
        {title}
      </Typography>
      {actions}
      <ConditionalContent condition={Boolean(description)}>
        <Typography color="text.secondary" visualVariant="pageHeader3">
          {description}
        </Typography>
      </ConditionalContent>
    </Box>
  );
}
