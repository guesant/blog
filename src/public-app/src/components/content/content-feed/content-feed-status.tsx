import { ContentFeedStatusStack } from '../../ui/semantic/ContentFeedStatusStack';
import { ContentFeedStatusText } from '../../ui/semantic/ContentFeedStatusText';

type ContentFeedStatusProps = { count: number; label: string };

export function ContentFeedStatus(props: ContentFeedStatusProps) {
  return (
    <ContentFeedStatusStack>
      <ContentFeedStatusText variant="body2" color="text.secondary">
        {props.count} {props.label}
      </ContentFeedStatusText>
    </ContentFeedStatusStack>
  );
}
