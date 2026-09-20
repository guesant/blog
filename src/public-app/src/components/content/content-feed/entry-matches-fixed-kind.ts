import type { FeedEntry } from './types';

type EntryMatchesFixedKindProps = {
  entry: FeedEntry;
  fixedKind?: string;
  kind: string;
};

export function entryMatchesFixedKind(props: EntryMatchesFixedKindProps): boolean {
  return props.fixedKind
    ? props.entry.kind === props.fixedKind
    : props.kind === 'all' || props.entry.kind === props.kind;
}
