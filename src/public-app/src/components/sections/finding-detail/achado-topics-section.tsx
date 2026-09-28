import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { TopicChip } from '../../content/topic-chip';
import { FindingSection } from './finding-section';
import { ConditionalContent } from '../../primitives/conditional-content';
import { AchadoTopicsListFrame } from '../../ui/semantic/AchadoTopicsListFrame';

type AchadoTopicsSectionProps = {
  item: Reference;
  t: AchadosTranslator;
};

export function AchadoTopicsSection(props: AchadoTopicsSectionProps) {
  return (
    <ConditionalContent
      condition={props.item.topics.length > 0}
      content={
        <FindingSection title={props.t('topicsHeading')}>
          <AchadoTopicsListFrame>
            {props.item.topics.map((topic, index) => (
              <TopicChip
                key={topic}
                name={topic}
                slug={props.item.topicSlugs?.[index] ?? ''}
                url={props.item.topicUrls?.[index]}
              />
            ))}
          </AchadoTopicsListFrame>
        </FindingSection>
      }
    />
  );
}
