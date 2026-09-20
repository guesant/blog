'use client';

import { Box, Typography } from '../../ui';
import type { AboutPageCopy } from '@portfolio/data/domain/types';

type AboutIntroTextProps = {
  page: AboutPageCopy;
};

export function AboutIntroText(props: AboutIntroTextProps) {
  return (
    <Box>
      <Typography variant="h2" visualVariant="aboutIntroText">
        {props.page.lead}
      </Typography>
      <Typography visualVariant="aboutIntroText2">{props.page.context}</Typography>
      <Typography color="text.secondary" visualVariant="aboutIntroText3">
        {props.page.description}
      </Typography>
    </Box>
  );
}
