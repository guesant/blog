import { ConditionalContent } from '../../primitives/conditional-content';
import { HomeProjectSummary } from './ui/home-project-summary';
import { HomeProjectSummaryText } from './ui/home-project-summary-text';
import { TextLink } from './ui/text-link';
import type { Translator } from '@/i18n/compat-support';

type HomeProjectsSummaryProps = {
  count: number;
  summary: string;
  label: string;
  t: Translator;
};

export function HomeProjectsSummary(props: HomeProjectsSummaryProps) {
  return (
    <ConditionalContent
      condition={props.count > 0}
      content={
        <HomeProjectSummary>
          <HomeProjectSummaryText>
            {props.summary.replace('{count}', String(props.count))}
          </HomeProjectSummaryText>
          <TextLink href="/projects#experiments">{props.t(props.label)}</TextLink>
        </HomeProjectSummary>
      }
    />
  );
}
