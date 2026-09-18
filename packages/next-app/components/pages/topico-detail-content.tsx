'use client';

import type { Reference, Topic } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { ReferenceGridPage } from '../content/reference-grid-page';

type TopicoDetailContentProps = { topic: Topic; references: Reference[] };

export function TopicoDetailContent(props: TopicoDetailContentProps) {
  const { topic, references } = props;
  const tPages = useTranslations('Pages.topics');

  return (
    <ReferenceGridPage eyebrow={tPages('eyebrow')} title={topic.name} references={references} />
  );
}
