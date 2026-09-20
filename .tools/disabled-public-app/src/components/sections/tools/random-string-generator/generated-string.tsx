'use client';

import { Paper, Typography } from '../../../ui';

type GeneratedStringProps = { value: string };

export function GeneratedString(props: GeneratedStringProps) {
  return (
    <Paper variant="outlined" visualVariant="generatedString">
      <Typography visualVariant="generatedString">{props.value}</Typography>
    </Paper>
  );
}
