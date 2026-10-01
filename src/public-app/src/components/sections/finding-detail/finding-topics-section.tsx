import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { TopicChip } from '../../content/topic-chip';
import { FindingSection } from './finding-section';
import { ConditionalContent } from '../../primitives/conditional-content';
import { FindingTopicsListFrame } from '../../ui/semantic/FindingTopicsListFrame';

type FindingTopicsSectionProps = {
  item: Reference;
  t: AchadosTranslator;
};

export function FindingTopicsSection(props: FindingTopicsSectionProps) {
  return (
    <ConditionalContent
      condition={props.item.topics.length > 0}
      content={
        <FindingSection title={props.t('topicsHeading')}>
          <FindingTopicsListFrame>
            {props.item.topics.map((topic, index) => (
              <TopicChip
                key={topic}
                name={topic}
                slug={props.item.topicSlugs?.[index] ?? ''}
                url={props.item.topicUrls?.[index]}
              />
            ))}
          </FindingTopicsListFrame>
        </FindingSection>
      }
    />
  );
}
