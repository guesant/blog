import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icon, type IconName } from '../primitives/icon';

type EmptyStateProps = { children: string; icon?: IconName };

export function EmptyState(props: EmptyStateProps) {
  const { children, icon } = props;
  return (
    <Box
      role="status"
      sx={{
        py: { xs: 5, md: 6 },
        px: { xs: 3, md: 4 },
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      {icon && <Icon name={icon} size={20} style={{ marginBottom: '0.75rem', opacity: 0.45 }} />}
      <Typography color="text.secondary" sx={{ maxWidth: '48ch' }}>
        {children}
      </Typography>
    </Box>
  );
}
