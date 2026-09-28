import type { ReactNode } from 'react';
import { Box } from '../box';
import { Divider } from '../divider';
import { Typography } from '../typography';

type ResumeSectionFrameProps = {
  title: string;
  children: ReactNode;
};

const sectionStyles = {
  display: 'grid',
  gap: 'var(--site-space-4)',
  color: 'var(--site-text-primary)',
};

const headingStyles = { display: 'grid', gap: 'var(--site-space-1)' };

const titleStyles = {
  display: 'block',
  fontWeight: 'var(--site-weight-bold)',
  letterSpacing: 'var(--site-letter-label)',
};

const dividerStyles = {
  margin: 0,
};

export function ResumeSectionFrame(props: ResumeSectionFrameProps) {
  return (
    <Box component="section" sx={sectionStyles}>
      <Box sx={headingStyles}>
        <Typography component="h2" variant="overline" sx={titleStyles}>
          {props.title}
        </Typography>
        <Divider sx={dividerStyles} />
      </Box>
      {props.children}
    </Box>
  );
}
