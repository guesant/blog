import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { getNavigationAvailability, getProfile, getSiteText } from '@portfolio/content/server';
import { getLocale, getTranslations } from 'next-intl/server';
import { SiteHeader } from '../navigation/site-header';
import { PageTransition } from '../primitives/page-transition';
import { SiteFooter } from './site-footer';

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
    <Box sx={{ minHeight: '100vh', color: 'text.primary', bgcolor: 'background.default' }}>
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
      <SiteHeader profile={profile} site={site} availability={availability} />
      <Container
        maxWidth="lg"
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{ px: { xs: 3, md: 5 } }}
      >
        <PageTransition>{children}</PageTransition>
        <SiteFooter site={site} profile={profile} availability={availability} />
      </Container>
    </Box>
  );
}
