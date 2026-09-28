import { ContentRichText } from '../../content/content-rich-text';
import { MetricsGrid } from '../../content/detail-layout';
import type { CaseStudy } from '@portfolio/data/domain/types';
import type { CasesTranslator } from '@/i18n/compat-support';
import { CaseDetailMetric } from './case-detail-metric';
import { ConditionalContent } from '../../primitives/conditional-content';
import { CaseDetailContent2Frame } from '../../ui/semantic/CaseDetailContent2Frame';
import { CaseDetailContentFrame } from '../../ui/semantic/CaseDetailContentFrame';
import { CaseDetailContentText } from '../../ui/semantic/CaseDetailContentText';

type CaseDetailBodyProps = {
  item: CaseStudy;
  t: CasesTranslator;
};

export function CaseDetailBody(props: CaseDetailBodyProps) {
  const details = [
    { label: props.t('context'), field: 'context', value: props.item.context, icon: 'problem' },
    { label: props.t('role'), field: 'role', value: props.item.role, icon: 'solution' },
    { label: props.t('result'), field: 'result', value: props.item.result, icon: 'evolution' },
  ] as const;

  return (
    <>
      <CaseDetailContentFrame>
        {details.map((detail) => (
          <CaseDetailMetric key={detail.field} {...detail} />
        ))}
      </CaseDetailContentFrame>
      <MetricsGrid metrics={props.item.metrics} marginTop={4} />
      <CaseDetailContentText>{props.item.technologies.join(' · ')}</CaseDetailContentText>
      <ConditionalContent
        condition={Boolean(props.item.body)}
        content={
          <CaseDetailContent2Frame>
            <ContentRichText content={props.item.body ?? {}} />
          </CaseDetailContent2Frame>
        }
      />
    </>
  );
}
