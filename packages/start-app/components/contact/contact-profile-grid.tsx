import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import type { ExternalProfile } from '@portfolio/content/types';
import { externalProfileLabel } from '../../content/external-profiles';
import { Icon } from '../primitives/icon';
import { ProfileIcon } from '../primitives/profile-icon';

type ContactProfileGridProps = {
  profiles: ExternalProfile[];
  tExternalProfiles: (key: string) => string;
};

export function ContactProfileGrid(props: ContactProfileGridProps) {
  const { profiles, tExternalProfiles } = props;
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
        },
        gap: 'var(--site-space-3)',
      }}
    >
      {profiles.map((profile) => (
        <Button
          key={profile.url}
          component="a"
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          size="medium"
          startIcon={<ProfileIcon platform={profile.platform} size={16} />}
          endIcon={<Icon name="external" size={12} />}
          sx={{
            minWidth: 0,
            justifyContent: 'flex-start',
            textAlign: 'left',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {externalProfileLabel(profile, tExternalProfiles)}
        </Button>
      ))}
    </Box>
  );
}
