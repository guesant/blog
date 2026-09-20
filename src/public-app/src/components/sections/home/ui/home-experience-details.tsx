import { Box, Typography } from '../../../ui';
import type { HomeExperienceItemProps } from '../types';

type HomeExperienceDetailsProps = Omit<HomeExperienceItemProps, 'index'>;

export function HomeExperienceDetails(props: HomeExperienceDetailsProps) {
  return (
    <Box>
      <Typography variant="h3" sx={{ fontSize: '1.25rem' }}>
        {props.item.role}
      </Typography>
      <Typography color="primary" sx={{ mt: 0.5, fontWeight: 600, fontSize: '.9rem' }}>
        {props.item.organization}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.25, maxWidth: '68ch', fontSize: '.925rem' }}>
        {(props.item.highlights ?? []).join(' ')}
      </Typography>
    </Box>
  );
}
