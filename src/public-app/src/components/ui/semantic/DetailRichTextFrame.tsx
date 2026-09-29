import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box } from '@/components/ui/box';
import {
  editorialBodyStyles,
  editorialSectionTitleStyles,
  editorialSubsectionTitleStyles,
} from '../editorial-typography';

export const DetailRichTextFrame = createSemanticSxComponent<ComponentProps<typeof Box>>(Box, {
  mt: 6,
  pt: 5,
  borderTop: 1,
  borderColor: 'divider',
  '& p, & li': editorialBodyStyles,
  '& p': { mb: 3 },
  '& h2': { ...editorialSectionTitleStyles, mt: 5, mb: 2 },
  '& h3': { ...editorialSubsectionTitleStyles, mt: 4, mb: 1.5 },
  '& pre': { overflowX: 'auto', p: 2, bgcolor: 'background.paper' },
  '& code': { fontFamily: 'var(--site-font-mono)' },
});
