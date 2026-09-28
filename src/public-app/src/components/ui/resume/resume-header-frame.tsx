import type { ReactNode } from 'react';
import { Box } from '../box';
import { Typography } from '../typography';

type ResumeHeaderFrameProps = {
  name: string;
  title: string;
  location: string;
  documentActions: ReactNode;
  contactActions: ReactNode;
};

const headerStyles = { display: 'grid', gap: 'var(--site-gap-stack)', textAlign: 'center' };

const identityStyles = { display: 'grid', gap: 'var(--site-space-1)' };

const nameStyles = {
  fontWeight: 'var(--site-weight-bold)',
};

const titleStyles = {
  color: 'var(--site-text-secondary)',
};

const locationStyles = {
  color: 'var(--site-text-secondary)',
};

const documentActionsStyles = {
  '@media print': { display: 'none' },
};

const contactActionsStyles = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  columnGap: 'var(--site-space-4)',
  rowGap: 'var(--site-space-1)',
};

export function ResumeHeaderFrame(props: ResumeHeaderFrameProps) {
  return (
    <Box component="header" sx={headerStyles}>
      <Box sx={identityStyles}>
        <Typography component="h1" variant="h2" sx={nameStyles}>
          {props.name}
        </Typography>
        <Typography sx={titleStyles}>{props.title}</Typography>
        <Typography variant="body2" sx={locationStyles}>
          {props.location}
        </Typography>
      </Box>
      <Box sx={documentActionsStyles}>{props.documentActions}</Box>
      <Box sx={contactActionsStyles}>{props.contactActions}</Box>
    </Box>
  );
}
