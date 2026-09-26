import { ConditionalContent } from '../../primitives/conditional-content';
import { FactGrid } from './fact-grid';
import { FindingSection } from './finding-section';
import type { DetailEntry } from './types';

type FindingFactSectionProps = {
  entries: DetailEntry[];
  title: string;
};

export function FindingFactSection(props: FindingFactSectionProps) {
  return (
    <ConditionalContent
      condition={props.entries.length > 0}
      content={
        <FindingSection title={props.title}>
          <FactGrid entries={props.entries} />
        </FindingSection>
      }
    />
  );
}
