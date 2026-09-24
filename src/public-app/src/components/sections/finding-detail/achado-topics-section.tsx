import { Stack } from '../../ui';
import type { Reference } from '@portfolio/data/domain/types';
import type { useTranslations } from '@/i18n/compat';
import { TopicChip } from '../../content/topic-chip';
import { FindingSection } from './finding-section';
import { ConditionalContent } from '../../primitives/conditional-content';

type AchadoTopicsSectionProps = {
  item: Reference;
  t: ReturnType<typeof useTranslations>;
};

export function AchadoTopicsSection(props: AchadoTopicsSectionProps) {
  return (
    <ConditionalContent
      condition={props.item.topics.length > 0}
      content={
        <FindingSection title={props.t('topicsHeading')}>
          <Stack flexWrap="wrap" gap="var(--site-space-2)">
            {props.item.topics.map((topic, index) => (
              <TopicChip
                key={topic}
                name={topic}
                slug={props.item.topicSlugs?.[index] ?? ''}
                url={props.item.topicUrls?.[index]}
              />
            ))}
          </Stack>
        </FindingSection>
      }
    />
  );
}
