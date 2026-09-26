'use client';

import { Card } from '../../ui';
import type { ReferenceCardProps } from './types';
import { ReferenceCardMeta } from './reference-card-meta';
import { ReferenceCardTopics } from './reference-card-topics';
import { SourcePreviewListGroup } from '../source-preview/source-preview-list-group';
import { sourcePreviewDataForLink } from '../source-preview/source-preview-data-for-link';
import { FindingCardSummary } from '../finding-card-summary';

type ReferenceCardSurfaceProps = ReferenceCardProps;

export function ReferenceCardSurface(props: ReferenceCardSurfaceProps) {
  const { reference, headingLevel = 'h3' } = props;

  const content = reference;

  const sourcePreviews = content.links.flatMap((link) => {
    const preview = sourcePreviewDataForLink(content, link);

    return preview ? [preview] : [];
  });

  return (
    <Card visualVariant="referenceCard">
      <ReferenceCardMeta reference={content} />
      <FindingCardSummary
        title={content.title}
        href={content.url ?? `/findings/${content.slug}`}
        description={content.description}
        headingLevel={headingLevel}
        titleVariant="h3"
        titleClassName="reference-card-title"
        titleVisualVariant="referenceCardTitle"
        descriptionVisualVariant="referenceCardDescription"
      />
      {sourcePreviews.length > 0 && <SourcePreviewListGroup entries={sourcePreviews} />}
      {content.topics.length > 0 && <ReferenceCardTopics topics={content.topics} />}
    </Card>
  );
}
