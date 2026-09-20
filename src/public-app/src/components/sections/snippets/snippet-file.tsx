'use client';

import { Box, Paper, Typography } from '../../ui';
import type { Snippet } from '@portfolio/data/domain/types';

type SnippetFileProps = { file: Snippet['files'][number] };

export function SnippetFile(props: SnippetFileProps) {
  const { file } = props;

  return (
    <Paper key={file.id || file.path} variant="outlined" visualVariant="snippetFile">
      <Typography visualVariant="snippetFile">{file.path}</Typography>
      <Box component="pre" visualVariant="snippetFile">
        {file.content}
      </Box>
    </Paper>
  );
}
