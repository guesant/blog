import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

type EditableProps = Record<string, string | undefined>;

type TimelineRowProps = {
  rail: string;
  title: string;
  subtitle?: string;
  body?: string;
  railEditableProps?: EditableProps;
  titleEditableProps?: EditableProps;
  subtitleEditableProps?: EditableProps;
  bodyEditableProps?: EditableProps;
  children?: ReactNode;
};

export function TimelineRow(timelineRowProps: TimelineRowProps) {
  const {
    rail,
    title,
    subtitle,
    body,
    railEditableProps,
    titleEditableProps,
    subtitleEditableProps,
    bodyEditableProps,
    children,
  } = timelineRowProps;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '9rem minmax(0, 1fr)' },
        gap: { xs: 1, sm: 4 },
        py: 3,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Typography color="text.secondary" {...railEditableProps} sx={{ fontSize: '.8125rem' }}>
        {rail}
      </Typography>
      <Box>
        <Typography {...titleEditableProps} sx={{ fontWeight: 650 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography
            color="primary"
            {...subtitleEditableProps}
            sx={{ mt: 0.35, fontSize: '.875rem' }}
          >
            {subtitle}
          </Typography>
        ) : null}
        {body ? (
          <Typography
            color="text.secondary"
            {...bodyEditableProps}
            sx={{ mt: 1, maxWidth: '68ch', fontSize: '.9rem' }}
          >
            {body}
          </Typography>
        ) : null}
        {children}
      </Box>
    </Box>
  );
}
