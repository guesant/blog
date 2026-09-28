import { ResumeAwardIssuer } from '../../ui';
import type { AwardEntriesProps } from './types';

type AwardEntryMetaProps = {
  item: AwardEntriesProps['items'][number];
};

export function AwardEntryMeta(props: AwardEntryMetaProps) {
  return <ResumeAwardIssuer>{props.item.issuer}</ResumeAwardIssuer>;
}
