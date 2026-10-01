import { ContentRichText } from '../../content/content-rich-text';
import { MetricsGrid } from '../../content/detail-layout';
import type { CaseStudy } from '@portfolio/data/domain/types';
import type { CasesTranslator } from '@/i18n/compat-support';
import { CaseDetailMetric } from './case-detail-metric';
import { ConditionalContent } from '../../primitives/conditional-content';
import { CaseBodyRichTextFrame } from '../../ui/semantic/CaseBodyRichTextFrame';
import { CaseDetailFactsGridFrame } from '../../ui/semantic/CaseDetailFactsGridFrame';
import { CaseDetailTechnologyListText } from '../../ui/semantic/CaseDetailTechnologyListText';

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
      <CaseDetailFactsGridFrame>
        {details.map((detail) => (
          <CaseDetailMetric key={detail.field} {...detail} />
        ))}
      </CaseDetailFactsGridFrame>
      <MetricsGrid metrics={props.item.metrics} />
      <CaseDetailTechnologyListText>
        {props.item.technologies.join(' · ')}
      </CaseDetailTechnologyListText>
      <ConditionalContent
        condition={Boolean(props.item.body)}
        content={
          <CaseBodyRichTextFrame>
            <ContentRichText content={props.item.body ?? {}} />
          </CaseBodyRichTextFrame>
        }
      />
    </>
  );
}
