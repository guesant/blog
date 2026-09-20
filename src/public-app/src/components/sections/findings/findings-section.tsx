import { ContentFeed } from '../../content/content-feed';
import type { ContentFeedProps } from '../../content/content-feed/types';
import { useFindingsViewModel } from './use-findings-view-model';

export type FindingsSectionProps = {
  copy: ContentFeedProps['copy'];
  locale: string;
  search?: string;
};

export function FindingsSection(props: FindingsSectionProps) {
  const viewModel = useFindingsViewModel({ locale: props.locale, search: props.search });

  return <ContentFeed {...viewModel} copy={props.copy} fixedKind="achado" action="/findings" />;
}
