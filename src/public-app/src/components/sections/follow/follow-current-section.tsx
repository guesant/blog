import { ConditionalContent } from '../../primitives/conditional-content';
import { FollowSectionTitleText } from '../../ui/semantic/FollowSectionTitleText';
import { FollowSectionFrame } from '../../ui/semantic/FollowSectionFrame';

type FollowCurrentSectionProps = {
  title: string;
};

export function FollowCurrentSection(props: FollowCurrentSectionProps) {
  return (
    <FollowSectionFrame component="section">
      <ConditionalContent
        condition={Boolean(props.title)}
        content={
          <FollowSectionTitleText component="h2" variant="h2">
            {props.title}
          </FollowSectionTitleText>
        }
      />
    </FollowSectionFrame>
  );
}
