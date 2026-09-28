import type { ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';
import { Typography } from '../typography';

type ResumeSectionFrameProps = {
  title: string;
  children: ReactNode;
};

const sectionStyles = {
  display: 'block',
  marginBlockStart: { xs: 'var(--site-space-4)', md: 'var(--site-space-5)' },
  color: 'var(--site-text-primary)',
};

const titleStyles = {
  display: 'block',
  fontWeight: 'var(--site-weight-bold)',
  letterSpacing: 'var(--site-letter-label)',
};

const dividerStyles = {
  marginBlockStart: 'var(--site-space-1)',
  marginBlockEnd: 'var(--site-space-4)',
};

export function ResumeSectionFrame(props: ResumeSectionFrameProps) {
  return (
    <Box component="section" sx={sectionStyles}>
      <Typography component="h2" variant="overline" sx={titleStyles}>
        {props.title}
      </Typography>
      <Divider sx={dividerStyles} />
      {props.children}
    </Box>
  );
}
