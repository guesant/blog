'use client';

import { Box } from '../../ui';
import { useState } from 'react';
import type { ResumePdfActionsProps } from './types';
import { ResumePdfButtonGroup } from './resume-pdf-button-group';
import { ResumePdfMenu } from './resume-pdf-menu';

export function ResumePdfActions(props: ResumePdfActionsProps) {
  const { locale, pdfUrls, t } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <Box visualVariant="resumePdfActions">
      <ResumePdfButtonGroup
        locale={locale}
        pdfUrls={pdfUrls}
        t={t}
        open={Boolean(anchorEl)}
        onOpen={(event) => setAnchorEl(event.currentTarget)}
      />
      <ResumePdfMenu
        locale={locale}
        pdfUrls={pdfUrls}
        t={t}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      />
    </Box>
  );
}
