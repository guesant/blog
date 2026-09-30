import { FindingCardPresentation } from '../finding-card-presentation';
import { FindingCardSummary } from '../finding-card-summary';
import { ReferenceCardMeta } from './reference-card-meta';
import { ReferenceCardTopics } from './reference-card-topics';
import type { ReferenceCardProps } from './types';

type ReferenceCardContentProps = ReferenceCardProps;

export function ReferenceCardContent(props: ReferenceCardContentProps) {
  const { reference, headingLevel = 'h3' } = props;

  return (
    <FindingCardPresentation
      metadata={<ReferenceCardMeta reference={reference} />}
      summary={
        <FindingCardSummary
          title={reference.title}
          href={reference.url ?? `/findings/${reference.slug}`}
          description={reference.description}
          headingLevel={headingLevel}
          presentation="reference"
        />
      }
      topics={
        reference.topics.length > 0 ? <ReferenceCardTopics topics={reference.topics} /> : undefined
      }
    />
  );
}
