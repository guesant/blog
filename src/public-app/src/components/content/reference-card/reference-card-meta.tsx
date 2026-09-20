'use client';

import { Box, Typography } from '../../ui';
import { toMessageKey } from '@portfolio/data/config/achados';
import type { Reference } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { ConditionalContent } from '../../primitives/conditional-content';

type ReferenceCardMetaProps = {
  reference: Reference;
};

export function ReferenceCardMeta(props: ReferenceCardMetaProps) {
  const t = useTranslations('Pages.achados');

  return (
    <Box visualVariant="referenceCardMeta">
      <Typography variant="overline" color="secondary">
        {t(`types.${toMessageKey(props.reference.type)}`)}
      </Typography>
      <ConditionalContent
        condition={props.reference.rating !== 'not-rated'}
        content={
          <Typography variant="overline" color="text.disabled">
            · {t(`ratings.${toMessageKey(props.reference.rating)}`)}
          </Typography>
        }
      />
    </Box>
  );
}
