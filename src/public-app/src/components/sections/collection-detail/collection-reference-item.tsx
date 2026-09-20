'use client';

import { Box, Typography } from '../../ui';
import { ReferenceCard } from '../../content/reference-card';
import type { ReferenceCollectionDetail } from '@portfolio/data/domain/types';
import { ConditionalContent } from '../../primitives/conditional-content';

type CollectionReferenceItemProps = {
  item: ReferenceCollectionDetail['items'][number];
};

export function CollectionReferenceItem(props: CollectionReferenceItemProps) {
  const { item } = props;

  return (
    <Box>
      <ReferenceCard reference={item.reference} headingLevel="h2" />
      <ConditionalContent
        condition={Boolean(item.note)}
        content={
          <Typography color="text.secondary" visualVariant="collectionReferenceItem">
            {item.note}
          </Typography>
        }
      />
    </Box>
  );
}
