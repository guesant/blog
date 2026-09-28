'use client';

import { FindingReferenceCardFrame } from '../../ui';
import type { ReferenceCardProps } from './types';
import { ReferenceCardMeta } from './reference-card-meta';
import { ReferenceCardTopics } from './reference-card-topics';
import { SourcePreviewListGroup } from '../source-preview/source-preview-list-group';
import { sourcePreviewDataForLink } from '../source-preview/source-preview-data-for-link';
import { FindingCardSummary } from '../finding-card-summary';
import { FindingCardPresentation } from '../finding-card-presentation';

type ReferenceCardSurfaceProps = ReferenceCardProps;

export function ReferenceCardSurface(props: ReferenceCardSurfaceProps) {
  const { reference, headingLevel = 'h3' } = props;

  const content = reference;

  const sourcePreviews = content.links.flatMap((link) => {
    const preview = sourcePreviewDataForLink(content, link);

    return preview ? [preview] : [];
  });

  return (
    <FindingReferenceCardFrame>
      <FindingCardPresentation
        metadata={<ReferenceCardMeta reference={content} />}
        summary={
          <FindingCardSummary
            title={content.title}
            href={content.url ?? `/findings/${content.slug}`}
            description={content.description}
            headingLevel={headingLevel}
            presentation="reference"
          />
        }
        previews={
          sourcePreviews.length > 0 ? (
            <SourcePreviewListGroup entries={sourcePreviews} />
          ) : undefined
        }
        topics={
          content.topics.length > 0 ? <ReferenceCardTopics topics={content.topics} /> : undefined
        }
      />
    </FindingReferenceCardFrame>
  );
}
