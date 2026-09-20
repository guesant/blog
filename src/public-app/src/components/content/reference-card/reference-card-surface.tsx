'use client';

import { Card, Typography } from '../../ui';
import { NavLink } from '../../primitives/nav-link';
import type { ReferenceCardProps } from './types';
import { ReferenceCardMeta } from './reference-card-meta';
import { ReferenceCardTopics } from './reference-card-topics';
import { SourcePreviewListGroup } from '../source-preview/source-preview-list-group';
import { sourcePreviewDataForLink } from '../source-preview/source-preview-data-for-link';

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
      <Typography
        className="reference-card-title"
        component={headingLevel}
        variant="h3"
        visualVariant="referenceCardTitle"
      >
        <NavLink href={`/findings/${content.slug}`} underline="none" color="inherit">
          {content.title}
        </NavLink>
      </Typography>
      <Typography color="text.secondary" visualVariant="referenceCardDescription">
        {content.description}
      </Typography>
      {sourcePreviews.length > 0 && <SourcePreviewListGroup entries={sourcePreviews} />}
      {content.topics.length > 0 && <ReferenceCardTopics topics={content.topics} />}
    </Card>
  );
}
