'use client';

import { InputLabel } from '../../ui';
import type { FeedSelectDefinition } from './feed-select.types';
import { FeedSelect } from './feed-select';
import { ListingFieldControl } from '../../ui/semantic/ListingFieldControl';

type FeedSelectControlProps = FeedSelectDefinition & { clearLabel: string };

export function FeedSelectControl(props: FeedSelectControlProps) {
  return (
    <ListingFieldControl size="small">
      <InputLabel shrink id={`${props.id}-label`}>
        {props.label}
      </InputLabel>
      <FeedSelect {...props} />
    </ListingFieldControl>
  );
}
