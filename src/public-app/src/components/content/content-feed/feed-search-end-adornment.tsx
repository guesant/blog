import { InputAdornment } from '../../ui';
import { Icon } from '../../primitives/icon';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ContentFeedSearchClearIconButton } from '../../ui/semantic/ContentFeedSearchClearIconButton';

type FeedSearchEndAdornmentProps = {
  value: string;
  clearLabel: string;
  onClear: () => void;
};

export function FeedSearchEndAdornment(props: FeedSearchEndAdornmentProps) {
  return (
    <ConditionalContent
      condition={Boolean(props.value)}
      content={
        <InputAdornment position="end">
          <ContentFeedSearchClearIconButton
            type="button"
            size="small"
            aria-label={props.clearLabel}
            title={props.clearLabel}
            onClick={props.onClear}
          >
            <Icon name="close" size={14} />
          </ContentFeedSearchClearIconButton>
        </InputAdornment>
      }
    />
  );
}
