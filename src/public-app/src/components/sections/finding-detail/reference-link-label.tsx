import { ReferenceLinkLabel2Text } from '../../ui/semantic/ReferenceLinkLabel2Text';
import { ReferenceLinkLabelFrame } from '../../ui/semantic/ReferenceLinkLabelFrame';
import { ReferenceLinkLabelText } from '../../ui/semantic/ReferenceLinkLabelText';

type ReferenceLinkLabelProps = { label: string; host: string };

export function ReferenceLinkLabel(props: ReferenceLinkLabelProps) {
  return (
    <ReferenceLinkLabelFrame>
      <ReferenceLinkLabelText>{props.label}</ReferenceLinkLabelText>
      <ReferenceLinkLabel2Text>{props.host}</ReferenceLinkLabel2Text>
    </ReferenceLinkLabelFrame>
  );
}
