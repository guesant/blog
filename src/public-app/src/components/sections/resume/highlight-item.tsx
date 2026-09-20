'use client';

import { Typography } from '../../ui';

type HighlightItemProps = { highlight: string };

export function HighlightItem(props: HighlightItemProps) {
  return (
    <Typography component="li" variant="body2" visualVariant="highlightItem">
      {props.highlight}
    </Typography>
  );
}
