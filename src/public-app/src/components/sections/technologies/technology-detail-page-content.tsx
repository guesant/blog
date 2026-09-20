'use client';

import { Chip } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import type { Technology } from '@portfolio/data/domain/types';
import { TechnologySkillList } from './ui/skill-list';

type TechnologyDetailPageContentProps = { technology: Technology };

export function TechnologyDetailPageContent(props: TechnologyDetailPageContentProps) {
  const { technology } = props;

  const tNav = useTranslations('Nav');

  return (
    <>
      <PageHeader
        eyebrow={tNav('technologies')}
        title={technology.name}
        breadcrumbs={[{ label: tNav('technologies'), href: '/technologies' }]}
      />
      <ConditionalContent
        condition={Boolean(technology.code)}
        content={<Chip label={technology.code ?? ''} />}
      />
      <ConditionalContent
        condition={technology.skills.length > 0}
        content={
          <TechnologySkillList
            children={technology.skills.map((skill) => (
              <Chip key={skill} label={skill} variant="outlined" />
            ))}
          />
        }
      />
    </>
  );
}
