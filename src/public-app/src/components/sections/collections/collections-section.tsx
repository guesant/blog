import { ContentFeed } from '../../content/content-feed';
import type { ContentFeedProps } from '../../content/content-feed/types';

export type CollectionsSectionProps = Pick<
  ContentFeedProps,
  'writings' | 'findings' | 'collections' | 'copy'
>;

export function CollectionsSection(props: CollectionsSectionProps) {
  return (
    <ContentFeed
      writings={props.writings}
      findings={props.findings}
      collections={props.collections}
      copy={props.copy}
      fixedKind="colecao"
      action="/collections"
    />
  );
}
