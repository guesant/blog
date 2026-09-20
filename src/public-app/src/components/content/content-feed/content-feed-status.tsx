import { Stack, Typography } from '../../ui';

type ContentFeedStatusProps = { count: number; label: string };

export function ContentFeedStatus(props: ContentFeedStatusProps) {
  return (
    <Stack visualVariant="contentFeedStatus">
      <Typography variant="body2" color="text.secondary" visualVariant="contentFeedStatus">
        {props.count} {props.label}
      </Typography>
    </Stack>
  );
}
