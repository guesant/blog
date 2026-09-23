import { CreditsSection } from './credits-section';
import { EntryList } from './entry-list';
import type { CreditEntry } from './types';

export type CreditsEntrySectionProps = {
  entries: CreditEntry[];
  heading: string;
};

export function CreditsEntrySection(props: CreditsEntrySectionProps) {
  if (props.entries.length === 0) {
    return null;
  }

  return (
    <CreditsSection heading={props.heading} maxWidth="none">
      <EntryList entries={props.entries} />
    </CreditsSection>
  );
}
