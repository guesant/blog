import type { ReactNode } from 'react';
import { Box } from '../box';
import { Typography } from '../typography';

type ResumeHeaderFrameProps = {
  eyebrow: string;
  name: string;
  title: string;
  location: string;
  documentActions: ReactNode;
  contactActions: ReactNode;
};

const headerStyles = { textAlign: 'center' };

const nameStyles = {
  marginBlockStart: 'var(--site-space-1)',
  fontWeight: 'var(--site-weight-bold)',
};

const titleStyles = {
  marginBlockStart: 'var(--site-space-1)',
  color: 'var(--site-text-secondary)',
};

const locationStyles = {
  marginBlockStart: 'var(--site-space-1)',
  color: 'var(--site-text-secondary)',
};

const documentActionsStyles = {
  marginBlockStart: 'var(--site-space-4)',
  '@media print': { display: 'none' },
};

const contactActionsStyles = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  columnGap: 'var(--site-space-4)',
  rowGap: 'var(--site-space-1)',
  marginBlockStart: 'var(--site-space-4)',
};

export function ResumeHeaderFrame(props: ResumeHeaderFrameProps) {
  return (
    <Box component="header" sx={headerStyles}>
      <Typography variant="overline" color="primary">
        {props.eyebrow}
      </Typography>
      <Typography component="h1" variant="h2" sx={nameStyles}>
        {props.name}
      </Typography>
      <Typography sx={titleStyles}>{props.title}</Typography>
      <Typography variant="body2" sx={locationStyles}>
        {props.location}
      </Typography>
      <Box sx={documentActionsStyles}>{props.documentActions}</Box>
      <Box sx={contactActionsStyles}>{props.contactActions}</Box>
    </Box>
  );
}
