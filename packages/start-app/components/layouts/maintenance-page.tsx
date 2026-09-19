'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { Profile, SiteText } from '@portfolio/content/types';

type MaintenancePageProps = { site: SiteText; profile: Profile };

export function MaintenancePage(props: MaintenancePageProps) {
  const { site: staticSite, profile: staticProfile } = props;
  const { content: site, source } = useEditableContent(staticSite);
  const { content: profile, raw: profileRaw } = useEditableContent(staticProfile);
  const maintenanceSource = source.maintenance as Record<string, unknown>;

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100svh',
        display: 'grid',
        alignItems: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        py: 8,
      }}
    >
      <Container maxWidth="sm" sx={{ px: { xs: 3, sm: 5 } }}>
        <Typography
          variant="overline"
          color="secondary.main"
          {...getEditableProps(maintenanceSource, 'eyebrow')}
        >
          {site.maintenance.eyebrow}
        </Typography>
        <Typography
          component="h1"
          variant="h1"
          {...getEditableProps(maintenanceSource, 'title')}
          sx={{ mt: 2, fontSize: { xs: '2.5rem', sm: '3rem' } }}
        >
          {site.maintenance.title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          {...getEditableProps(maintenanceSource, 'description')}
          sx={{ mt: 2.5, maxWidth: '34rem' }}
        >
          {site.maintenance.description}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          {...getEditableProps(profileRaw, 'name')}
          sx={{ mt: 6 }}
        >
          {profile.name}
        </Typography>
      </Container>
    </Box>
  );
}
