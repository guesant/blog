import { type IconName } from '../primitives/icon';
import { ConditionalContent } from '../primitives/conditional-content';
import { EmptyState2Frame } from '../ui/semantic/EmptyState2Frame';
import { EmptyStateFrame } from '../ui/semantic/EmptyStateFrame';
import { EmptyStateIcon } from '../ui/semantic/EmptyStateIcon';
import { EmptyStateText } from '../ui/semantic/EmptyStateText';

type EmptyStateProps = { children: string; icon?: IconName; cat?: boolean; eyes?: string };

export function EmptyState(props: EmptyStateProps) {
  const { children, icon, cat = true, eyes = '^.^' } = props;

  return (
    <EmptyStateFrame role="status">
      <ConditionalContent condition={cat}>
        <EmptyState2Frame component="pre" aria-hidden="true">
          {`/\\_/\\
( ${eyes} )

 > ^ <`}
        </EmptyState2Frame>
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
