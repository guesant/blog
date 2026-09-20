import { Box, Typography } from '../../../ui';
import { GeneratedStringList } from './generated-string-list';

type GeneratedResultsProps = { results: string[]; label: string };

export function GeneratedResults(props: GeneratedResultsProps) {
  return (
    <Box component="section" aria-live="polite">
      <Typography variant="overline" color="text.secondary">
        {props.label}
      </Typography>
      <GeneratedStringList results={props.results} />
    </Box>
  );
}
