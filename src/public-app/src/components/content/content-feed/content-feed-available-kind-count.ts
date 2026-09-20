import type { ContentFeedProps } from './types';

type ContentFeedAvailableKindCountProps = Pick<
  ContentFeedProps,
  'writings' | 'findings' | 'collections'
>;

export function contentFeedAvailableKindCount(props: ContentFeedAvailableKindCountProps): number {
  return (
    Number(props.writings.length > 0) +
    Number(props.findings.length > 0) +
    Number(props.collections.length > 0)
  );
}
