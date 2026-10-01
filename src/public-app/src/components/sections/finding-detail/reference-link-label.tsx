import { ReferenceLinkHostText } from '../../ui/semantic/ReferenceLinkHostText';
import { ReferenceLinkLabelFrame } from '../../ui/semantic/ReferenceLinkLabelFrame';
import { ReferenceLinkLabelText } from '../../ui/semantic/ReferenceLinkLabelText';

type ReferenceLinkLabelProps = { label: string; host: string };

export function ReferenceLinkLabel(props: ReferenceLinkLabelProps) {
  return (
    <ReferenceLinkLabelFrame>
      <ReferenceLinkLabelText>{props.label}</ReferenceLinkLabelText>
      <ReferenceLinkHostText>{props.host}</ReferenceLinkHostText>
    </ReferenceLinkLabelFrame>
  );
}
