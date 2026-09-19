import Box from '@mui/material/Box';
import { getNavigationAvailability, getProfile, getSiteText } from '@portfolio/content/server';
import { getLocale, getTranslations } from 'next-intl/server';
import { PageTransition } from '../primitives/page-transition';
import { SiteSidebarShell } from './site-sidebar-shell';

type SiteShellProps = { children: React.ReactNode };

export async function SiteShell(props: SiteShellProps) {
  const { children } = props;
  const locale = await getLocale();
  const [profile, site, availability, t] = await Promise.all([
    getProfile(locale),
    getSiteText(locale),
    getNavigationAvailability(locale),
    getTranslations('Nav'),
  ]);

  return (
    <Box sx={{ color: 'text.primary' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'absolute',
          zIndex: 1500,
          left: 8,
          top: -48,
          px: 2,
          py: 1,
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
          textDecoration: 'none',
          transition: 'top .15s ease-out',
          '&:focus-visible': { top: 8 },
        }}
      >
        {t('skipToContent')}
      </Box>
      <SiteSidebarShell profile={profile} site={site} availability={availability}>
        <Box id="main-content" tabIndex={-1}>
          <PageTransition>{children}</PageTransition>
        </Box>
      </SiteSidebarShell>
    </Box>
  );
}
