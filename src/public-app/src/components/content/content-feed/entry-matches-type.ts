import type { FeedEntry } from './types';

type EntryMatchesTypeProps = {
  entry: FeedEntry;
  type: string;
};

export function entryMatchesType(props: EntryMatchesTypeProps): boolean {
  return !props.type || props.entry.findingType === props.type;
}
