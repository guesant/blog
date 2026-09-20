import { Typography } from '../../../ui';

type HomeProjectSummaryTextProps = {
  children: string;
};

export function HomeProjectSummaryText(props: HomeProjectSummaryTextProps) {
  return (
    <Typography color="text.secondary" sx={{ fontSize: '.875rem' }}>
      {props.children}
    </Typography>
  );
}
