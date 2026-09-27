'use client';

import { Stack } from '../ui';
import type { RichTextContent } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { useState } from 'react';
import { copyContentAction } from './copy-content-action';
import { plainText } from './plain-text';
import { ContentActionsPrimary } from './content-actions-primary';
import { ContentActionsSecondary } from './content-actions-secondary';
import { useSiteFeatureFlags } from './use-site-feature-flags';

type ContentActionsProps = {
  title: string;
  url: string;
  body?: RichTextContent;
  externalUrl?: string;
  downloadUrl?: string;
  placement?: 'hero' | 'section';
};

export function ContentActions(props: ContentActionsProps) {
  const { title, url, body, externalUrl, downloadUrl, placement = 'section' } = props;

  const t = useTranslations('Pages.contentActions');

  const featureFlags = useSiteFeatureFlags();

  const [copied, setCopied] = useState<string | null>(null);

  const text = plainText(body);

  const copy = copyContentAction.bind(null, setCopied);

  const filename =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'content';

  return (
    <Stack
      direction="row"
      visualVariant={placement === 'hero' ? 'contentActionsHero' : 'contentActionsSection'}
    >
      <ContentActionsPrimary
        text={text}
        copy={copy}
        url={url}
        filename={filename}
        t={t}
        copied={copied}
        featureFlags={featureFlags.contentActions}
      />
      <ContentActionsSecondary externalUrl={externalUrl} downloadUrl={downloadUrl} t={t} />
    </Stack>
  );
}
