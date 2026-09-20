'use client';

import type { Reference, Topic } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { ReferenceGridPage } from '../../content/reference-grid-page';

type TopicoDetailContentProps = { topic: Topic; references: Reference[] };

export function TopicoDetailContent(props: TopicoDetailContentProps) {
  const { topic, references } = props;

  const tPages = useTranslations('Pages.topics');

  return (
    <ReferenceGridPage eyebrow={tPages('eyebrow')} title={topic.name} references={references} />
  );
}
