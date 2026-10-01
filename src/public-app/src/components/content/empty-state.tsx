import { type IconName } from '../primitives/icon';
import { ConditionalContent } from '../primitives/conditional-content';
import { EmptyStateCatIllustrationFrame } from '../ui/semantic/EmptyStateCatIllustrationFrame';
import { EmptyStateFrame } from '../ui/semantic/EmptyStateFrame';
import { EmptyStateIcon } from '../ui/semantic/EmptyStateIcon';
import { EmptyStateText } from '../ui/semantic/EmptyStateText';

type EmptyStateProps = {
  children: string;
  icon?: IconName;
  cat?: boolean;
  eyes?: string;
  topDivider?: boolean;
};

export function EmptyState(props: EmptyStateProps) {
  const { children, icon, cat = true, eyes = '^.^', topDivider } = props;

  return (
    <EmptyStateFrame role="status" topDivider={topDivider}>
      <ConditionalContent condition={cat}>
        <EmptyStateCatIllustrationFrame component="pre" aria-hidden="true">
          {`/\\_/\\
( ${eyes} )

 > ^ <`}
        </EmptyStateCatIllustrationFrame>
      </ConditionalContent>
      <ConditionalContent condition={Boolean(icon)}>
        <EmptyStateIcon name={icon ?? 'problem'} size={20} />
      </ConditionalContent>
      <EmptyStateText component="code" color="text.secondary">
        {children}
      </EmptyStateText>
    </EmptyStateFrame>
  );
}
