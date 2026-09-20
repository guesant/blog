import { Box } from '../ui';
import { Typography } from '../ui';
import type { ReactNode } from 'react';
import { ConditionalContent } from '../primitives/conditional-content';

type TimelineRowProps = {
  rail: string;
  title: string;
  subtitle?: string;
  body?: string;
  children?: ReactNode;
};

export function TimelineRow(props: TimelineRowProps) {
  const { rail, title, subtitle, body, children } = props;

  return (
    <Box visualVariant="timelineRow">
      <Typography color="text.secondary" visualVariant="timelineRow">
        {rail}
      </Typography>
      <Box>
        <Typography visualVariant="timelineRow2">{title}</Typography>
        <ConditionalContent
          condition={Boolean(subtitle)}
          content={
            <Typography color="primary" visualVariant="timelineRow3">
              {subtitle}
            </Typography>
          }
        />
        <ConditionalContent
          condition={Boolean(body)}
          content={
            <Typography color="text.secondary" visualVariant="timelineRow4">
              {body}
            </Typography>
          }
        />
        {children}
      </Box>
    </Box>
  );
}
