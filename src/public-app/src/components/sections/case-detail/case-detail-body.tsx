import { Box, Typography } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import { MetricsGrid } from '../../content/detail-layout';
import type { CaseStudy } from '@portfolio/data/domain/types';
import type { useTranslations } from '@/i18n/compat';
import { CaseDetailMetric } from './case-detail-metric';
import { ConditionalContent } from '../../primitives/conditional-content';

type CaseDetailBodyProps = {
  item: CaseStudy;
  t: ReturnType<typeof useTranslations>;
};

export function CaseDetailBody(props: CaseDetailBodyProps) {
  const details = [
    { label: props.t('context'), field: 'context', value: props.item.context, icon: 'problem' },
    { label: props.t('role'), field: 'role', value: props.item.role, icon: 'solution' },
    { label: props.t('result'), field: 'result', value: props.item.result, icon: 'evolution' },
  ] as const;

  return (
    <>
      <Box visualVariant="caseDetailContent">
        {details.map((detail) => (
          <CaseDetailMetric key={detail.field} {...detail} />
        ))}
      </Box>
      <MetricsGrid metrics={props.item.metrics} marginTop={4} />
      <Typography visualVariant="caseDetailContent">
        {props.item.technologies.join(' · ')}
      </Typography>
      <ConditionalContent
        condition={Boolean(props.item.body)}
        content={
          <Box visualVariant="caseDetailContent2">
            <ContentRichText content={props.item.body ?? {}} />
          </Box>
        }
      />
    </>
  );
}
