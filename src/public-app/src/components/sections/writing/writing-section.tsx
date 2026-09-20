import { ContentFeed } from '../../content/content-feed';
import type { ContentFeedProps } from '../../content/content-feed/types';

export type WritingSectionProps = Pick<
  ContentFeedProps,
  'writings' | 'findings' | 'collections' | 'copy'
>;

export function WritingSection(props: WritingSectionProps) {
  return (
    <ContentFeed
      writings={props.writings}
      findings={props.findings}
      collections={props.collections}
      copy={props.copy}
      fixedKind="post"
      action="/writing"
    />
  );
}
