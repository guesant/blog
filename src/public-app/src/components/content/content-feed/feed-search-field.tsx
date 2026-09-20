'use client';

import { TextField } from '../../ui';
import type { ChangeEvent } from 'react';
import { FeedSearchEndAdornment } from './feed-search-end-adornment';
import { FeedSearchStartAdornment } from './feed-search-start-adornment';

type FeedSearchFieldProps = {
  value: string;
  label: string;
  clearLabel: string;
  onChange: (value: string) => void;
};

export function FeedSearchField(props: FeedSearchFieldProps) {
  return (
    <TextField
      size="small"
      label={props.label}
      value={props.value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
      slotProps={{
        input: {
          startAdornment: <FeedSearchStartAdornment />,
          endAdornment: (
            <FeedSearchEndAdornment
              value={props.value}
              clearLabel={props.clearLabel}
              onClear={() => props.onChange('')}
            />
          ),
        },
      }}
      visualVariant="feedSearchField"
    />
  );
}
