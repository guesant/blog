'use client';

import type { Reference, Topic } from '@portfolio/data/domain/types';
import { ReferenceGridPage } from '../../content/reference-grid-page';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type TopicoDetailContentProps = {
  topic: Topic;
  references: Reference[];
  pagination: ContentCollectionMeta;
};

export function TopicoDetailContent(props: TopicoDetailContentProps) {
  const { topic, references } = props;

  return (
    <ReferenceGridPage
      title={topic.name}
      references={references}
      pagination={props.pagination}
      action={topic.url ?? `/topics/${topic.slug}`}
    />
  );
}
