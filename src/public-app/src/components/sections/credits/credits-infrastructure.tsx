import { CreditsSection } from './credits-section';
import { EntryList } from './entry-list';
import type { CreditEntry } from './types';

type CreditsInfrastructureProps = {
  entries: CreditEntry[];
  heading: string;
};

export function CreditsInfrastructure(props: CreditsInfrastructureProps) {
  if (props.entries.length === 0) {
    return null;
  }

  return (
    <CreditsSection heading={props.heading} maxWidth="none">
      <EntryList entries={props.entries} />
    </CreditsSection>
  );
}
