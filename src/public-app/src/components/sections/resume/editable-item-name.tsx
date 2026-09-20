'use client';

import { Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ExternalLink } from '../../primitives/external-link';
import type { EditableItemNameProps } from './types';

export function EditableItemName(props: EditableItemNameProps) {
  const { item } = props;

  return (
    <>
      <ConditionalContent
        condition={Boolean(item.url?.trim())}
        content={
          <ExternalLink
            href={item.url ?? ''}
            visualVariant="editableItemName"
            children={item.name}
          />
        }
      />
      <ConditionalContent
        condition={!item.url?.trim()}
        content={<Typography visualVariant="editableItemName">{item.name}</Typography>}
      />
    </>
  );
}
