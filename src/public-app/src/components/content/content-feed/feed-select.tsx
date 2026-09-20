'use client';

import { IconButton, InputAdornment, OptionSelect } from '../../ui';
import type { SelectOptionChangeEvent } from '../../ui';
import type { MouseEvent } from 'react';
import type { FeedSelectDefinition } from './feed-select.types';
import { Icon } from '../../primitives/icon';
import { handleFeedSelectClear } from './handle-feed-select-clear';
import { ConditionalContent } from '../../primitives/conditional-content';
import { buildFeedSelectOptions } from './build-feed-select-options';

type FeedSelectProps = FeedSelectDefinition & { clearLabel: string };

export function FeedSelect(props: FeedSelectProps) {
  const clearValue = props.clearValue ?? '';

  const hasValue = props.value !== clearValue;

  const options = buildFeedSelectOptions({ options: props.options });

  return (
    <OptionSelect
      labelId={`${props.id}-label`}
      value={props.value}
      label={props.label}
      onChange={(event: SelectOptionChangeEvent) => props.onChange(event.target.value)}
      options={options}
      endAdornment={
        <ConditionalContent
          condition={hasValue}
          content={
            <InputAdornment position="end">
              <IconButton
                type="button"
                size="small"
                aria-label={`${props.clearLabel}: ${props.label}`}
                title={`${props.clearLabel}: ${props.label}`}
                onMouseDown={(event: MouseEvent<HTMLButtonElement>) => event.stopPropagation()}
                onClick={handleFeedSelectClear.bind(null, props.onChange, clearValue)}
                visualVariant="feedSelectClear"
              >
                <Icon name="close" size={14} />
              </IconButton>
            </InputAdornment>
          }
        />
      }
    />
  );
}
