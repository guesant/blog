import type { ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';
import { Typography } from '../typography';
import { ConditionalContent } from '../../primitives/conditional-content';

export type EditorialSectionProps = {
  id?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  divider?: boolean;
};

const sectionStyles = {
  display: 'grid',
  rowGap: 'var(--site-space-6)',
  paddingBlock: 'var(--site-space-6)',
  textAlign: 'center',
  '&[id="recent-writing"], &[id="recent-findings"], &[id="popular-writing"], &[id="portfolio-credits"], &[id="contact"]':
    {
      paddingBlockStart: 0,
      gap: 'var(--site-page-content-offset)',
    },
};

const headerStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--site-space-2)',
  textAlign: 'center',
};

const descriptionStyles = {
  display: 'block',
  width: '100%',
  maxWidth: '100%',
  marginInline: 'auto',
  boxSizing: 'border-box',
  textAlign: 'center',
};

export function EditorialSection(props: EditorialSectionProps) {
  return (
    <Box component="section" id={props.id} sx={sectionStyles}>
      <ConditionalContent
        condition={Boolean(props.divider)}
        content={<Divider sx={{ width: '100%', borderColor: 'var(--site-border)' }} />}
      />
      <Box component="header" sx={headerStyles}>
        <Typography component="h2" variant="h2">
          {props.title}
        </Typography>
        <ConditionalContent
          condition={Boolean(props.description)}
          content={
            <Typography color="text.secondary" sx={descriptionStyles}>
              {props.description}
            </Typography>
          }
        />
      </Box>
      <Box sx={{ width: '100%', minWidth: 0 }}>{props.children}</Box>
      {props.footer}
    </Box>
  );
}
