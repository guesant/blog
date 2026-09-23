import { ContentFeed } from '../../content/content-feed';
import type { ContentFeedProps } from '../../content/content-feed/types';
import type { FindingList } from '@portfolio/data/api/public-site-source-support';
import { useFindingsViewModel } from './use-findings-view-model';

export type FindingsSectionProps = {
  copy: ContentFeedProps['copy'];
  locale: string;
  search?: string;
  initialData: FindingList;
};

export function FindingsSection(props: FindingsSectionProps) {
  const viewModel = useFindingsViewModel({
    locale: props.locale,
    search: props.search,
    initialData: props.initialData,
  });

  return <ContentFeed {...viewModel} copy={props.copy} fixedKind="achado" action="/findings" />;
}
