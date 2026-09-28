import { styled } from '@mui/material/styles';
import { Icon as BaseComponent } from '@/components/primitives/icon';

export const EmptyStateIcon = styled(BaseComponent, { name: 'EmptyStateIcon' })({
  display: 'block',
  flex: '0 0 auto',
  marginBottom: '0.75rem',
  opacity: 0.45,
});
