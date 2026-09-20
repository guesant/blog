import { Box } from '../ui';
import { Typography } from '../ui';
import { Icon, type IconName } from '../primitives/icon';
import { ConditionalContent } from '../primitives/conditional-content';

type EmptyStateProps = { children: string; icon?: IconName; cat?: boolean; eyes?: string };

export function EmptyState(props: EmptyStateProps) {
  const { children, icon, cat = true, eyes = '^.^' } = props;

  return (
    <Box role="status" visualVariant="emptyState">
      <ConditionalContent condition={cat}>
        <Box component="pre" aria-hidden="true" visualVariant="emptyState2">
          {`/\\_/\\
( ${eyes} )

 > ^ <`}
        </Box>
      </ConditionalContent>
      <ConditionalContent condition={Boolean(icon)}>
        <Icon name={icon ?? 'problem'} size={20} visualVariant="emptyState" />
      </ConditionalContent>
      <Typography component="code" color="text.secondary" visualVariant="emptyState">
        {children}
      </Typography>
    </Box>
  );
}
