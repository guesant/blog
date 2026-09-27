import { ConditionalContent } from '../../primitives/conditional-content';
import { ExternalLink } from '../../primitives/external-link';
import type { CreditEntry } from './types';

type CreditEntryTitleProps = {
  entry: CreditEntry;
};

export function CreditEntryTitle(props: CreditEntryTitleProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.entry.url)}
        content={
          <ExternalLink href={props.entry.url ?? ''} visualVariant="creditEntryItem">
            {props.entry.name}
          </ExternalLink>
        }
      />
      <ConditionalContent condition={!props.entry.url} content={props.entry.name} />
    </>
  );
}
