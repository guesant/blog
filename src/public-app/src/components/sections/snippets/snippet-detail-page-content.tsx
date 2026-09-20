'use client';

import { Button } from '../../ui';
import { Icon } from '../../primitives/icon';
import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import type { Snippet } from '@portfolio/data/domain/types';
import { SnippetFile } from './snippet-file';
import { SnippetFileList } from './ui/file-list';

type SnippetDetailPageContentProps = { snippet: Snippet };

export function SnippetDetailPageContent(props: SnippetDetailPageContentProps) {
  const { snippet } = props;

  const tNav = useTranslations('Nav');

  const tActions = useTranslations('Pages.contentActions');

  return (
    <>
      <PageHeader
        eyebrow={tNav('snippets')}
        title={snippet.title}
        description={snippet.description}
        breadcrumbs={[{ label: tNav('snippets'), href: '/snippets' }]}
      />
      <Button
        component="a"
        href={snippet.downloadUrl}
        download
        variant="outlined"
        startIcon={<Icon name="download" size={14} />}
      >
        {tActions('downloadFiles')}
      </Button>
      <SnippetFileList>
        {snippet.files.map((file) => (
          <SnippetFile key={file.id || file.path} file={file} />
        ))}
      </SnippetFileList>
    </>
  );
}
