import { styled } from '@mui/material/styles';
import { Icon as BaseComponent } from '@/components/primitives/icon';

export const MutedIcon = styled(BaseComponent, { name: 'MutedIcon' })({
  display: 'block',
  flex: '0 0 auto',
  opacity: 0.6,
});
