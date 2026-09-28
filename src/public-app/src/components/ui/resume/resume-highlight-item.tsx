import { Typography } from '../typography';

type ResumeHighlightItemProps = { highlight: string };

export function ResumeHighlightItem(props: ResumeHighlightItemProps) {
  return (
    <Typography component="li" variant="body2">
      {props.highlight}
    </Typography>
  );
}
