'use client';

import type { RichTextContent } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { useState } from 'react';
import { copyContentAction } from './copy-content-action';
import { plainText } from './plain-text';
import { useSiteFeatureFlags } from './use-site-feature-flags';
import { ContentActionsPlacement } from './content-actions-placement';
import { ConditionalContent } from '../primitives/conditional-content';
import { contentActionsAreVisible } from './content-actions-visibility';

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

  const contentProps = {
    text,
    copy,
    url,
    filename,
    t,
    copied,
    featureFlags: featureFlags.contentActions,
    externalUrl,
    downloadUrl,
  };

  const hasVisibleActions = contentActionsAreVisible(featureFlags.contentActions, {
    externalUrl,
    downloadUrl,
  });

  return (
    <ConditionalContent
      condition={hasVisibleActions}
      content={<ContentActionsPlacement {...contentProps} placement={placement} />}
    />
  );
}
