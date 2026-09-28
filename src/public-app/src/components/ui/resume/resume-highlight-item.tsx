import { Typography } from '../typography';

type ResumeHighlightItemProps = { highlight: string };

const highlightStyles = { marginBlockEnd: 'var(--site-space-1)' };

export function ResumeHighlightItem(props: ResumeHighlightItemProps) {
  return (
    <Typography component="li" variant="body2" sx={highlightStyles}>
      {props.highlight}
    </Typography>
  );
}
