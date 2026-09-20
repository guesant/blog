import { CreditsSection } from './credits-section';
import { CreditEntryItem } from './credit-entry-item';
import { CreditsReferenceGrid } from './ui/reference-grid';
import type { CreditEntry } from './types';

type CreditsReferencesProps = {
  entries: CreditEntry[];
  heading: string;
};

export function CreditsReferences(props: CreditsReferencesProps) {
  if (props.entries.length === 0) {
    return null;
  }

  return (
    <CreditsSection heading={props.heading}>
      <CreditsReferenceGrid>
        {props.entries.map((entry) => (
          <CreditEntryItem key={entry.url} entry={entry} />
        ))}
      </CreditsReferenceGrid>
    </CreditsSection>
  );
}
