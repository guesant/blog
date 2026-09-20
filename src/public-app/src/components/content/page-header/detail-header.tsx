import { Box, Typography } from '../../ui';
import { Breadcrumbs } from '../../navigation/breadcrumbs';
import type { DetailHeaderProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';

export function DetailHeader(props: DetailHeaderProps) {
  const { eyebrow, title, description, meta, actions, breadcrumbs } = props;

  return (
    <Box component="header" visualVariant="detailHeader">
      <ConditionalContent condition={Boolean(breadcrumbs)}>
        <Breadcrumbs trail={breadcrumbs ?? []} />
      </ConditionalContent>
      <Typography variant="overline" color="text.secondary" visualVariant="detailHeader">
        {eyebrow}
      </Typography>
      <Typography variant="h1" visualVariant="detailHeader2">
        {title}
      </Typography>
      {actions}
      <ConditionalContent condition={Boolean(description)}>
        <Typography visualVariant="detailHeader3">{description}</Typography>
      </ConditionalContent>
      <ConditionalContent condition={Boolean(meta)}>
        <Typography color="text.secondary" visualVariant="detailHeader4">
          {meta}
        </Typography>
      </ConditionalContent>
    </Box>
  );
}
