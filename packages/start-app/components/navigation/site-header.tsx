'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { NavigationAvailability, Profile, SiteText } from '@portfolio/content/types';
import { useScroll } from 'motion/react';
import * as m from 'motion/react-m';
import { useLocale, useTranslations } from '@/i18n/compat';
import { useState } from 'react';
import { Link, usePathname } from '../../i18n/navigation';
import { routing } from '../../i18n/routing';
import { Icon, type IconName } from '../primitives/icon';
import { LayoutStack as Stack } from '../primitives/layout-stack';

type NavigationLink = { label: string; href: string; icon: IconName };

type PrimaryNavigationLinkProps = {
  link: NavigationLink;
  index: number;
  pathname: string;
};

function PrimaryNavigationLink(primaryNavigationLinkProps: PrimaryNavigationLinkProps) {
  const { link, index, pathname } = primaryNavigationLinkProps;
  const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
  return (
    <Button
      component={Link}
      href={link.href}
      size="small"
      startIcon={<Icon name={link.icon} size={14} />}
      sx={{
        color: active ? 'text.primary' : 'text.secondary',
        bgcolor: active ? 'action.selected' : 'transparent',
        minWidth: ['4.75rem', '4.75rem', '4.5rem', '4rem'][index] ?? '4rem',
        px: 1.25,
        fontSize: '.88rem',
        '&:hover': { bgcolor: active ? 'action.selected' : 'action.hover' },
      }}
    >
      {link.label}
    </Button>
  );
}

type LocaleNavigationButtonProps = {
  item: (typeof routing.locales)[number];
  locale: string;
  pathname: string;
};

function LocaleNavigationButton(localeNavigationButtonProps: LocaleNavigationButtonProps) {
  const { item, locale, pathname } = localeNavigationButtonProps;
  const selected = locale === item;
  return (
    <Button
      component={Link}
      href={pathname}
      locale={item}
      scroll={false}
      size="small"
      hrefLang={item}
      aria-current={selected ? 'true' : undefined}
      sx={{
        minWidth: '2rem',
        px: 0.75,
        fontSize: '.68rem',
        color: selected ? 'secondary.main' : 'text.secondary',
        bgcolor: selected ? 'secondary.light' : 'transparent',
        fontWeight: selected ? 750 : 550,
      }}
    >
      {item === 'en' ? 'EN' : 'PT'}
    </Button>
  );
}

type MobileLocaleButtonProps = LocaleNavigationButtonProps & { onNavigate: () => void };

function MobileLocaleButton(mobileLocaleButtonProps: MobileLocaleButtonProps) {
  const { item, locale, pathname, onNavigate } = mobileLocaleButtonProps;
  const selected = locale === item;
  return (
    <Button
      component={Link}
      href={pathname}
      locale={item}
      scroll={false}
      onClick={onNavigate}
      variant={selected ? 'contained' : 'outlined'}
      size="small"
      hrefLang={item}
      aria-current={selected ? 'true' : undefined}
      sx={{ flex: 1 }}
    >
      {item === 'en' ? 'EN' : 'PT-BR'}
    </Button>
  );
}

type SiteHeaderProps = {
  profile: Profile;
  site: SiteText;
  availability: NavigationAvailability;
};

function primaryNavigationLinks(
  availability: NavigationAvailability,
  t: ReturnType<typeof useTranslations>,
) {
  const links: NavigationLink[] = [];
  if (availability.cases) {
    links.push({ label: t('work'), href: '/cases', icon: 'briefcase' });
  }
  if (availability.projects) {
    links.push({ label: t('projects'), href: '/projects', icon: 'layout-grid' });
  }
  if (availability.writing) {
    links.push({ label: t('writing'), href: '/writing', icon: 'pen-line' });
  }
  if (availability.achados) {
    links.push({ label: t('achados'), href: '/findings', icon: 'sparkles' });
  }
  links.push({ label: t('about'), href: '/about', icon: 'user' });
  return links;
}

function mobileNavigationLinks(
  primaryLinks: NavigationLink[],
  availability: NavigationAvailability,
  t: ReturnType<typeof useTranslations>,
): NavigationLink[] {
  if (!availability.contact) {
    return primaryLinks;
  }
  return [...primaryLinks, { label: t('contact'), href: '/contact', icon: 'mail' as const }];
}

type HeaderBrandProps = {
  profile: Profile;
  profileSource: Record<string, unknown>;
  profileRaw: Record<string, unknown>;
  site: SiteText;
  siteRaw: Record<string, unknown>;
};

function HeaderBrand(props: HeaderBrandProps) {
  const { profile, profileSource, profileRaw, site, siteRaw } = props;
  return (
    <Box
      component={Link}
      href="/"
      sx={{
        color: 'text.primary',
        fontFamily: 'var(--site-font-logo)',
        textDecoration: 'none',
        display: 'inline-flex',
        width: 'max-content',
        maxWidth: '100%',
        justifySelf: 'start',
        alignItems: 'center',
        gap: 1.25,
      }}
    >
      <Box
        sx={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'text.primary',
          color: 'background.default',
          fontFamily: 'var(--site-font-logo)',
          fontSize: '.7rem',
          fontWeight: 700,
          letterSpacing: '-.04em',
        }}
      >
        <span {...getEditableProps(siteRaw, 'shortName')}>{site.shortName}</span>
      </Box>
      <Box>
        <Typography
          {...getEditableProps(profileRaw, 'name')}
          sx={{ fontFamily: 'var(--site-font-logo)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-.02em' }}
        >
          {profile.name}
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontFamily: 'var(--font-mono)',
            fontSize: '.65rem',
            lineHeight: 1.4,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <span {...getEditableProps(profileSource, 'title')}>{profile.title.toUpperCase()}</span>
        </Typography>
      </Box>
    </Box>
  );
}

type DesktopNavigationProps = {
  primaryLinks: NavigationLink[];
  pathname: string;
  locale: string;
  availability: NavigationAvailability;
  t: ReturnType<typeof useTranslations>;
};

function DesktopNavigation(props: DesktopNavigationProps) {
  const { primaryLinks, pathname, locale, availability, t } = props;
  return (
    <>
      <Stack
        direction="row"
        spacing={0}
        sx={{
          display: { xs: 'none', md: 'flex' },
          justifySelf: 'center',
          alignItems: 'center',
          gap: 0.25,
        }}
      >
        {primaryLinks.map((link, index) => (
          <PrimaryNavigationLink key={link.href} link={link} index={index} pathname={pathname} />
        ))}
      </Stack>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          justifySelf: 'end',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Stack
          direction="row"
          spacing={0.25}
          role="group"
          aria-label={t('language')}
          sx={{
            alignItems: 'center',
            p: 0.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: '.5rem',
          }}
        >
          {routing.locales.map((item) => (
            <LocaleNavigationButton key={item} item={item} locale={locale} pathname={pathname} />
          ))}
        </Stack>
        <Stack direction="row" spacing={0.75}>
          <Button
            component={Link}
            href="/resume"
            variant="text"
            size="small"
            startIcon={<Icon name="document" size={14} />}
            sx={{ color: 'text.secondary', minWidth: '4.75rem' }}
          >
            {t('resume')}
          </Button>
          {availability.contact && (
            <Button
              component={Link}
              href="/contact"
              variant="outlined"
              size="small"
              startIcon={<Icon name="mail" size={14} />}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {t('talk')}
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );
}

type MobileNavigationProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  links: NavigationLink[];
  pathname: string;
  locale: string;
  t: ReturnType<typeof useTranslations>;
};

function MobileNavigation(props: MobileNavigationProps) {
  const { open, setOpen, links, pathname, locale, t } = props;
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{ paper: { sx: { width: '17.5rem' } } }}
    >
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
        >
          <Typography sx={{ fontWeight: 700 }}>{t('menu')}</Typography>
          <IconButton aria-label={t('closeMenu')} onClick={() => setOpen(false)}>
            <Icon name="close" />
          </IconButton>
        </Stack>
        <List>
          {links.map((link) => (
            <ListItemButton
              key={link.href}
              component={Link}
              href={link.href}
              onClick={() => setOpen(false)}
              selected={pathname === link.href || pathname.startsWith(`${link.href}/`)}
              sx={{ borderRadius: 2, mb: 0.5, gap: 1.25 }}
            >
              <Icon name={link.icon} size={17} style={{ opacity: 0.7 }} />
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
        <Stack direction="row" role="group" aria-label={t('language')} sx={{ gap: 0.75, my: 1.5 }}>
          {routing.locales.map((item) => (
            <MobileLocaleButton
              key={item}
              item={item}
              locale={locale}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </Stack>
        <Button
          component={Link}
          href="/resume"
          variant="contained"
          fullWidth
          startIcon={<Icon name="document" size={16} />}
        >
          {t('cv')}
        </Button>
      </Box>
    </Drawer>
  );
}

export function SiteHeader(props: SiteHeaderProps) {
  const { profile: staticProfile, site: staticSite, availability } = props;
  const {
    content: profile,
    source: profileSource,
    raw: profileRaw,
  } = useEditableContent(staticProfile);
  const { content: site, raw: siteRaw } = useEditableContent(staticSite);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Nav');
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

  const primaryLinks = primaryNavigationLinks(availability, t);
  const mobileLinks = mobileNavigationLinks(primaryLinks, availability, t);

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: scrolled ? 'divider' : 'transparent',
        backdropFilter: 'blur(1rem)',
        bgcolor: scrolled ? 'rgba(247,249,252,0.92)' : 'rgba(247,249,252,0.76)',
        transition: 'background-color .2s, border-color .2s',
      }}
    >
      <m.div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1,
          height: 3,
          backgroundColor: theme.palette.secondary.main,
          scaleX: scrollYProgress,
          transformOrigin: '0 50%',
        }}
      />
      <Toolbar
        component="nav"
        aria-label={t('menu')}
        sx={{
          width: '100%',
          maxWidth: '75rem',
          mx: 'auto',
          minHeight: { xs: '4.25rem', md: '5rem' },
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr) auto auto',
            md: 'minmax(13.5rem, 1fr) auto minmax(13.5rem, 1fr)',
          },
          gap: { xs: 1, md: 2 },
          px: { xs: 3, md: 5 },
        }}
      >
        <HeaderBrand
          profile={profile}
          profileSource={profileSource}
          profileRaw={profileRaw}
          site={site}
          siteRaw={siteRaw}
        />
        <DesktopNavigation
          primaryLinks={primaryLinks}
          pathname={pathname}
          locale={locale}
          availability={availability}
          t={t}
        />
        <Button
          component={Link}
          href="/resume"
          variant="outlined"
          size="small"
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          {t('cvShort')}
        </Button>
        <IconButton
          aria-label={t('openMenu')}
          onClick={() => setOpen(true)}
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          <Icon name="menu" />
        </IconButton>
      </Toolbar>
      <MobileNavigation
        open={open}
        setOpen={setOpen}
        links={mobileLinks}
        pathname={pathname}
        locale={locale}
        t={t}
      />
    </AppBar>
  );
}
