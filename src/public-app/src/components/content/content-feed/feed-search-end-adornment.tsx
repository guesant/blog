import { IconButton, InputAdornment } from '../../ui';
import { Icon } from '../../primitives/icon';
import { ConditionalContent } from '../../primitives/conditional-content';

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
          <IconButton
            type="button"
            size="small"
            aria-label={props.clearLabel}
            title={props.clearLabel}
            onClick={props.onClear}
            visualVariant="contentFeedSearchClear"
          >
            <Icon name="close" size={14} />
          </IconButton>
        </InputAdornment>
      }
    />
  );
}
