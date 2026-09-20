'use client';

import { FormControl, InputLabel } from '../../ui';
import type { FeedSelectDefinition } from './feed-select.types';
import { FeedSelect } from './feed-select';

type FeedSelectControlProps = FeedSelectDefinition & { clearLabel: string };

export function FeedSelectControl(props: FeedSelectControlProps) {
  return (
    <FormControl size="small" visualVariant="listingField">
      <InputLabel shrink id={`${props.id}-label`}>
        {props.label}
      </InputLabel>
      <FeedSelect {...props} />
    </FormControl>
  );
}
