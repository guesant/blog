'use client';

import type { Snippet } from '@portfolio/data/domain/types';
import { SnippetFileFrame } from '../../ui/semantic/SnippetFileFrame';
import { SnippetFilePaper } from '../../ui/semantic/SnippetFilePaper';
import { SnippetFileText } from '../../ui/semantic/SnippetFileText';

type SnippetFileProps = { file: Snippet['files'][number] };

export function SnippetFile(props: SnippetFileProps) {
  const { file } = props;

  return (
    <SnippetFilePaper key={file.id || file.path} variant="outlined">
      <SnippetFileText>{file.path}</SnippetFileText>
      <SnippetFileFrame component="pre">{file.content}</SnippetFileFrame>
    </SnippetFilePaper>
  );
}
