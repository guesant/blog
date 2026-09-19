'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type {
  NavigationAvailability,
  NavigationItem,
  Profile,
  SiteText,
} from '@portfolio/content/types';
import { useLocale, useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';
import { Link as LocaleLink, usePathname } from '../../i18n/navigation';
import { ProtectedEmail } from '../contact/protected-email';
import { Icon, type IconName } from '../primitives/icon';
import { LayoutStack as Stack } from '../primitives/layout-stack';
import { ProfileIcon } from '../primitives/profile-icon';
import { externalProfileLabel } from '../../content/external-profiles';
import { sidebarActionSx } from './sidebar-action';

type SiteSidebarShellProps = {
  children: ReactNode;
  profile: Profile;
  site: SiteText;
  availability: NavigationAvailability;
};

const aboutRoutes = ['resume', 'portfolio', 'cases'];

function internalRoute(route: string, locale: string) {
  const prefix = `/${locale}`;
  const path = route.startsWith(prefix) ? route.slice(prefix.length) : route;
  return path || '/';
}

function routeSegment(route: string) {
  return route.replace(/\/$/, '').split('/').filter(Boolean).at(-1) ?? '';
}

function isAboutRoute(route: string) {
  return ['about', 'now', 'portfolio', 'cases', 'projects', 'resume'].includes(routeSegment(route));
}

function iconForRoute(route: string): IconName | undefined {
  if (route === '/') {
    return 'home';
  }
  switch (routeSegment(route)) {
    case 'about':
      return 'user';
    case 'resume':
      return 'graduation-cap';
    case 'writing':
      return 'pen-line';
    case 'findings':
      return 'sparkles';
    case 'topics':
      return 'tag';
    case 'collections':
      return 'book';
    case 'knowledge-map':
      return 'compass';
    case 'technologies':
      return 'wrench';
    case 'snippets':
      return 'document';
    case 'tools':
      return 'wrench';
    case 'cases':
      return 'briefcase';
    case 'projects':
    case 'portfolio':
      return 'layout-grid';
    case 'now':
      return 'clock';
    case 'contact':
      return 'mail';
    case 'license':
      return 'scroll-text';
    case 'credits':
      return 'bookmark';
    case 'follow':
      return 'rss';
    default:
      return undefined;
  }
}

function visibleRoute(route: string, site: SiteText) {
  const visibility = site.visibility;
  if (!visibility) {
    return true;
  }
  switch (routeSegment(route)) {
    case 'writing':
      return visibility.writing;
    case 'findings':
      return visibility.findings;
    case 'topics':
      return visibility.topics;
    case 'collections':
      return visibility.collections;
    case 'snippets':
      return visibility.snippets;
    default:
      return true;
  }
}

function activeRoute(pathname: string, route: string) {
  return pathname === route || (route !== '/' && pathname.startsWith(`${route}/`));
}

function SidebarLink(props: {
  item: NavigationItem;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
}) {
  const { item, pathname, locale, onNavigate } = props;
  const route = internalRoute(item.route, locale);
  const active = activeRoute(pathname, route);
  const icon = iconForRoute(route);
  return (
    <Button
      component={LocaleLink}
      href={route}
      onClick={onNavigate}
      startIcon={icon ? <Icon name={icon} size={14} /> : undefined}
      aria-current={active ? 'page' : undefined}
      sx={[
        sidebarActionSx,
        {
          color: active ? 'text.primary' : 'text.secondary',
          bgcolor: active ? 'action.selected' : 'transparent',
          borderColor: active ? '#86b7fe' : 'divider',
          '&:hover': {
            bgcolor: active ? 'action.selected' : 'action.hover',
            borderColor: 'secondary.main',
          },
        },
      ]}
    >
      {item.label.toLowerCase()}
    </Button>
  );
}

function SidebarGroup(props: {
  label: string;
  items: NavigationItem[];
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
}) {
  const { label, items, pathname, locale, site, onNavigate } = props;
  const visibleItems = items.filter((item) => visibleRoute(item.route, site));
  if (!visibleItems.length) {
    return null;
  }
  return (
    <Box>
      <Divider sx={{ mt: 0, mb: 'var(--site-space-6)' }} />
      <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
        {label}
      </Typography>
      <Stack sx={{ gap: 1, mt: 0.5 }}>
        {visibleItems.map((item) => (
          <SidebarLink
            key={item.route}
            item={item}
            pathname={pathname}
            locale={locale}
            onNavigate={onNavigate}
          />
        ))}
      </Stack>
    </Box>
  );
}

function LeftSidebar(props: {
  site: SiteText;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
}) {
  const { site, pathname, locale, onNavigate } = props;
  const t = useTranslations('Sidebar');
  const tNav = useTranslations('Nav');
  const groups = site.navigation?.sidebar ?? [];
  const aboutGroup = groups.flatMap((group) => group).filter((item) => isAboutRoute(item.route));
  const contentGroups = groups
    .map((items) => items.filter((item) => !isAboutRoute(item.route)))
    .filter((items) => items.length > 0);
  const aboutVisible = site.visibility?.about ?? true;
  const visibleAboutRoutes = aboutRoutes.filter((route) => {
    if (route === 'resume') return site.visibility?.resume ?? true;
    if (route === 'portfolio') return site.visibility?.portfolio ?? true;
    return site.visibility?.cases ?? true;
  });
  const aboutItems = aboutRoutes
    .map((route) =>
      aboutGroup.find((item) => routeSegment(item.route) === route) ?? {
        route: `/${route}`,
        label: route === 'resume' ? tNav('resume') : route,
        children: [],
      },
    )
    .filter((item) => visibleAboutRoutes.includes(routeSegment(item.route)));
  const routeSegments = pathname.split('/').filter(Boolean);
  const backHref =
    pathname === '/' ? undefined : routeSegments.length > 1 ? `/${routeSegments[0]}` : '/';
  const backLabel =
    routeSegments.length > 1
      ? ({
          writing: tNav('writing'),
          findings: tNav('achados'),
          collections: tNav('collections'),
          snippets: tNav('snippets'),
          topics: tNav('topics'),
          technologies: tNav('technologies'),
          cases: tNav('work'),
          projects: tNav('projects'),
        }[routeSegments[0]] ?? routeSegments[0])
      : tNav('home');

  return (
    <Box component="nav" aria-label={t('navigation')} sx={{ p: 2, minWidth: 0 }}>
      <Stack sx={{ gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minHeight: '2rem' }}>
          {backHref && (
            <IconButton component={LocaleLink} href={backHref} aria-label={backLabel} size="small">
              <Icon name="arrow-left" size={15} />
            </IconButton>
          )}
          <Link component={LocaleLink} href="/" underline="none" color="text.primary">
            guesant.net
          </Link>
        </Box>
        <Divider />
        <SidebarLink
          item={{ route: '/', label: tNav('home'), children: [] }}
          pathname={pathname}
          locale={locale}
          onNavigate={onNavigate}
        />
        {contentGroups.map((items, index) => (
          <SidebarGroup
            key={index}
            label={items.some((item) => ['writing', 'findings', 'topics', 'collections', 'knowledge-map', 'technologies'].includes(routeSegment(item.route))) ? t('groupContent') : t('groupTools')}
            items={items}
            pathname={pathname}
            locale={locale}
            site={site}
            onNavigate={onNavigate}
          />
        ))}
        {aboutVisible && aboutItems.length > 0 && (
          <Box>
            <Divider sx={{ mt: 0, mb: 'var(--site-space-6)' }} />
            <SidebarLink
              item={{ route: '/about', label: tNav('about'), children: [] }}
              pathname={pathname}
              locale={locale}
              onNavigate={onNavigate}
            />
            <Stack sx={{ gap: 1, ml: 1.5, pl: 1.5, borderLeft: 'var(--site-border-width) solid', borderColor: 'divider' }}>
              {aboutItems.map((item) => (
                <SidebarLink
                  key={item.route}
                  item={item}
                  pathname={pathname}
                  locale={locale}
                  onNavigate={onNavigate}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

function RightSidebar(props: {
  site: SiteText;
  profile: Profile;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
}) {
  const { site, profile, locale, onNavigate } = props;
  const t = useTranslations('Sidebar');
  const tExternalProfiles = useTranslations('ExternalProfiles');
  const visibility = site.visibility;
  const showContact = visibility?.contact ?? site.contact.available;
  const showLegal = visibility?.license || visibility?.credits || showContact;
  const showUpdates = visibility?.follow;
  const buildSha = site.build?.commitSha?.slice(0, 7);
  const buildUrl = buildSha && site.sourceRepositoryUrl
    ? `${site.sourceRepositoryUrl.replace(/\/$/, '')}/commit/${site.build?.commitSha}`
    : undefined;

  return (
    <Box component="aside" sx={{ p: 3, minWidth: 0 }}>
      <Stack sx={{ gap: 3 }}>
        {showContact && (
          <SidebarSection label={t('connect')}>
            <SidebarLink
              item={{ route: '/contact', label: t('contact'), children: [] }}
              pathname={props.pathname}
              locale={locale}
              onNavigate={onNavigate}
            />
            <Stack sx={{ gap: 1, ml: 1.5, pl: 1.5, borderLeft: 'var(--site-border-width) solid', borderColor: 'divider' }}>
              {site.contact.profiles.map((item) => (
                <Button
                  key={item.url}
                  component="a"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<ProfileIcon platform={item.platform} size={14} />}
                  sx={sidebarActionSx}
                >
                  {externalProfileLabel(item, tExternalProfiles)}
                </Button>
              ))}
              {site.contact.hasEmail && (
                <ProtectedEmail
                  challenge={site.contact.emailChallenge}
                  label={t('contact')}
                  variant="sidebar"
                />
              )}
            </Stack>
          </SidebarSection>
        )}
        {showLegal && (
          <SidebarSection label={t('legal')}>
            {visibility?.license && (
              <SidebarLink item={{ route: '/license', label: t('license'), children: [] }} pathname={props.pathname} locale={locale} onNavigate={onNavigate} />
            )}
            {visibility?.credits && (
              <SidebarLink item={{ route: '/credits', label: t('credits'), children: [] }} pathname={props.pathname} locale={locale} onNavigate={onNavigate} />
            )}
            {showContact && (
              <SidebarLink item={{ route: '/contact', label: t('reportIssue'), children: [] }} pathname={props.pathname} locale={locale} onNavigate={onNavigate} />
            )}
          </SidebarSection>
        )}
        {showUpdates && (
          <SidebarSection label={t('updates')}>
            <SidebarLink item={{ route: '/follow', label: t('follow'), children: [] }} pathname={props.pathname} locale={locale} onNavigate={onNavigate} />
          </SidebarSection>
        )}
        {buildUrl && (
          <SidebarSection label={t('source')}>
            <Button component="a" href={buildUrl} target="_blank" rel="noopener noreferrer" sx={sidebarActionSx}>
              <Icon name="evolution" size={14} />
              <Box component="span" sx={{ ml: 1 }}>build {buildSha}</Box>
            </Button>
          </SidebarSection>
        )}
      </Stack>
    </Box>
  );
}

function SidebarSection(props: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        {props.label}
      </Typography>
      <Stack sx={{ gap: 1 }}>{props.children}</Stack>
    </Box>
  );
}

export function SiteSidebarShell(props: SiteSidebarShellProps) {
  const { children, profile, site, availability } = props;
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Sidebar');
  const [open, setOpen] = useState(false);
  const showRight = site.visibility?.rightSidebar ?? true;
  const copyright = site.copyrightTemplate
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{name}', profile.name);

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          md: showRight ? '16rem minmax(0, 1fr) 16rem' : '16rem minmax(0, 1fr)',
        },
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'block' }, borderRight: 'var(--site-border-width) solid', borderColor: '#d4d4d4' }}>
        <Box sx={{ position: 'sticky', top: 0, height: '100dvh', overflowY: 'auto' }}>
          <LeftSidebar site={site} pathname={pathname} locale={locale} />
        </Box>
      </Box>
      <Box sx={{ minWidth: 0, minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '3.5rem',
            px: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Link component={LocaleLink} href="/" underline="none" color="text.primary">
            guesant.net
          </Link>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Icon name="menu" size={14} />}
            onClick={() => setOpen(true)}
          >
            {t('navigation')}
          </Button>
        </Box>
        <Box component="main" sx={{ flex: 1, minWidth: 0, overflowX: 'clip', overflowY: 'auto', px: { xs: 2, md: 3 }, scrollbarGutter: 'stable' }}>
          <Box sx={{ width: 'min(100%, 57.5rem)', mx: 'auto' }}>
            {children}
            <Divider sx={{ mt: 6 }} />
            <Typography component="footer" variant="body2" color="text.secondary" sx={{ py: 3 }}>
              {copyright}
            </Typography>
          </Box>
        </Box>
      </Box>
      {showRight && (
        <Box sx={{ display: { xs: 'none', md: 'block' }, borderLeft: 'var(--site-border-width) solid', borderColor: '#d4d4d4' }}>
          <Box sx={{ position: 'sticky', top: 0, height: '100dvh', overflowY: 'auto' }}>
            <RightSidebar site={site} profile={profile} pathname={pathname} locale={locale} />
          </Box>
        </Box>
      )}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: 'min(18rem, 86vw)' } } }}
      >
        <Stack sx={{ overflowY: 'auto', p: 1.5 }}>
          <LeftSidebar
            site={site}
            pathname={pathname}
            locale={locale}
            onNavigate={() => setOpen(false)}
          />
          {showRight && (
            <RightSidebar
              site={site}
              profile={profile}
              pathname={pathname}
              locale={locale}
              onNavigate={() => setOpen(false)}
            />
          )}
        </Stack>
      </Drawer>
    </Box>
  );
}
