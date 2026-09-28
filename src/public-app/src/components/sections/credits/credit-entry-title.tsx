import { ConditionalContent } from '../../primitives/conditional-content';
import type { CreditEntry } from './types';
import { CreditEntryItemLink } from '../../ui/semantic/CreditEntryItemLink';

type CreditEntryTitleProps = {
  entry: CreditEntry;
};

export function CreditEntryTitle(props: CreditEntryTitleProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.entry.url)}
        content={
          <CreditEntryItemLink href={props.entry.url ?? ''}>{props.entry.name}</CreditEntryItemLink>
        }
      />
      <ConditionalContent condition={!props.entry.url} content={props.entry.name} />
    </>
  );
}
