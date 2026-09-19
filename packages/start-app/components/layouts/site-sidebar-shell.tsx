'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import type {
  NavigationAvailability,
  NavigationItem,
  Profile,
  SiteText,
} from '@portfolio/content/types';
import { useLocale, useRouter, useTranslations } from '@/i18n/compat';
import { type ElementType, type ReactNode, useEffect, useState } from 'react';
import { Link as LocaleLink, localizedPath, usePathname } from '../../i18n/navigation';
import { routing } from '../../i18n/routing';
import { ProtectedEmail } from '../contact/protected-email';
import { Icon, type IconName } from '../primitives/icon';
import { LayoutStack as Stack } from '../primitives/layout-stack';
import { ProfileIcon } from '../primitives/profile-icon';
import { externalProfileLabel } from '../../content/external-profiles';
import { sidebarActionSx, sidebarSubnavSx } from './sidebar-action';

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

function navigationItem(route: string, label: string): NavigationItem {
  return { route, label, children: [] };
}

function SidebarAction(props: {
  label: ReactNode;
  icon?: ReactNode;
  endIcon?: ReactNode;
  href: string;
  component: ElementType;
  target?: string;
  rel?: string;
  onClick?: () => void;
  active?: boolean;
  ariaCurrent?: 'page';
}) {
  const {
    label,
    icon,
    endIcon,
    href,
    component,
    target,
    rel,
    onClick,
    active = false,
    ariaCurrent,
  } = props;
  return (
    <Button
      component={component}
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      startIcon={icon}
      endIcon={endIcon}
      aria-current={ariaCurrent}
      sx={[
        sidebarActionSx,
        {
          color: active ? 'text.primary' : 'text.secondary',
          bgcolor: active ? 'action.selected' : 'transparent',
          borderColor: active ? 'secondary.main' : 'divider',
          '&:hover': {
            bgcolor: active ? 'action.selected' : 'action.hover',
            borderColor: 'secondary.main',
          },
        },
      ]}
    >
      {label}
    </Button>
  );
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
    <SidebarAction
      component={LocaleLink}
      href={route}
      onClick={onNavigate}
      icon={icon ? <Icon name={icon} size={14} /> : undefined}
      active={active}
      ariaCurrent={active ? 'page' : undefined}
      label={item.label.toLowerCase()}
    />
  );
}

function SidebarLinkList(props: {
  items: NavigationItem[];
  pathname: string;
  locale: string;
  onNavigate?: () => void;
}) {
  return props.items.map((item) => (
    <SidebarLink
      key={item.route}
      item={item}
      pathname={props.pathname}
      locale={props.locale}
      onNavigate={props.onNavigate}
    />
  ));
}

function SidebarNavItem(props: {
  item: NavigationItem;
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
}) {
  const { item, pathname, locale, site, onNavigate } = props;
  const visibleChildren = item.children.filter((child) => visibleRoute(child.route, site));
  return (
    <Box>
      <SidebarLink
        item={item}
        pathname={pathname}
        locale={locale}
        onNavigate={onNavigate}
      />
      {visibleChildren.length > 0 && (
        <Stack sx={sidebarSubnavSx}>
          {visibleChildren.map((child) => (
            <SidebarNavItem
              key={child.route}
              item={child}
              pathname={pathname}
              locale={locale}
              site={site}
              onNavigate={onNavigate}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

function SidebarGroup(props: {
  label?: string;
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
      {label && (
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
      )}
      <Stack
        sx={{
          gap: 'var(--site-space-2)',
          mt: label ? 'var(--site-space-1)' : 0,
        }}
      >
        {visibleItems.map((item) => (
          <SidebarNavItem
            key={item.route}
            item={item}
            pathname={pathname}
            locale={locale}
            site={site}
            onNavigate={onNavigate}
          />
        ))}
      </Stack>
    </Box>
  );
}

type ThemeMode = 'system' | 'light' | 'dark';

function SidebarThemeButton(props: { t: ReturnType<typeof useTranslations> }) {
  const { t } = props;
  const [mode, setMode] = useState<ThemeMode>('system');

  function applyTheme(nextMode: ThemeMode) {
    if (nextMode === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.dataset.theme = nextMode;
    }
    window.localStorage.setItem('site-theme', nextMode);
    setMode(nextMode);
  }

  useEffect(() => {
    const stored = window.localStorage.getItem('site-theme');
    const initialMode: ThemeMode =
      stored === 'system' || stored === 'light' || stored === 'dark'
        ? stored
        : 'system';
    if (initialMode === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.dataset.theme = initialMode;
    }
    setMode(initialMode);
  }, []);

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={mode}
      onChange={(_, value: ThemeMode | null) => value && applyTheme(value)}
      aria-label={t('theme')}
      sx={{
        width: '100%',
        '& .MuiToggleButton-root': {
          flex: 1,
          minWidth: 0,
          minHeight: 'var(--site-control-h-sm)',
          padding: 'var(--site-space-1) var(--site-space-2)',
          borderColor: 'divider',
          borderRadius: 'var(--site-radius)',
          color: 'text.secondary',
          fontFamily: 'var(--site-font-action)',
          fontSize: 'var(--site-text-xs)',
          lineHeight: 'var(--site-leading-normal)',
          textTransform: 'none',
          '&.Mui-selected': {
            color: 'text.primary',
            bgcolor: 'action.selected',
            borderColor: 'secondary.main',
          },
        },
      }}
    >
      <ToggleButton value="system">{t('systemTheme')}</ToggleButton>
      <ToggleButton value="light">{t('lightTheme')}</ToggleButton>
      <ToggleButton value="dark">{t('darkTheme')}</ToggleButton>
    </ToggleButtonGroup>
  );
}

function SidebarPreferences(props: { pathname: string; locale: string; t: ReturnType<typeof useTranslations> }) {
  const { pathname, locale, t } = props;
  const router = useRouter();
  return (
    <SidebarSection label={t('preferences')}>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={locale}
        onChange={(_, value: string | null) => {
          if (value) {
            router.push(localizedPath(pathname, value as 'en' | 'pt-BR'));
          }
        }}
        aria-label={t('language')}
        sx={{
          width: '100%',
          '& .MuiToggleButton-root': {
            flex: 1,
            minHeight: 'var(--site-control-h-sm)',
            padding: 'var(--site-space-1) var(--site-space-2)',
            borderColor: 'divider',
            borderRadius: 'var(--site-radius)',
            color: 'text.secondary',
            fontFamily: 'var(--site-font-action)',
            fontSize: 'var(--site-text-xs)',
            lineHeight: 'var(--site-leading-normal)',
            textTransform: 'none',
            '&.Mui-selected': {
              color: 'text.primary',
              bgcolor: 'action.selected',
              borderColor: 'secondary.main',
            },
          },
        }}
      >
        {routing.locales.map((item) => (
          <ToggleButton
            key={item}
            value={item}
          >
            {item === 'en' ? 'EN' : 'PT'}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <SidebarThemeButton t={t} />
    </SidebarSection>
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
  const aboutItem: NavigationItem = {
    route: '/about',
    label: tNav('about'),
    children: aboutItems,
  };
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
          <Link component={LocaleLink} href="/" underline="none" color="text.primary" sx={{ fontFamily: 'var(--site-font-logo)' }}>
            guesant.net
          </Link>
        </Box>
        <Divider />
        <SidebarLinkList
          items={[navigationItem('/', tNav('home'))]}
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
          <SidebarGroup
            items={[aboutItem]}
            pathname={pathname}
            locale={locale}
            site={site}
            onNavigate={onNavigate}
          />
        )}
        <SidebarPreferences pathname={pathname} locale={locale} t={t} />
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
  const legalItems = [
    visibility?.license ? navigationItem('/license', t('license')) : undefined,
    visibility?.credits ? navigationItem('/credits', t('credits')) : undefined,
    showContact ? navigationItem('/contact', t('reportIssue')) : undefined,
  ].filter((item): item is NavigationItem => item !== undefined);
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
            <Stack sx={sidebarSubnavSx}>
              {site.contact.profiles.map((item) => (
                <SidebarAction
                  key={item.url}
                  component="a"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ProfileIcon platform={item.platform} size={14} />}
                  label={externalProfileLabel(item, tExternalProfiles)}
                />
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
            <SidebarLinkList
              items={legalItems}
              pathname={props.pathname}
              locale={locale}
              onNavigate={onNavigate}
            />
          </SidebarSection>
        )}
        {showUpdates && (
          <SidebarSection label={t('updates')}>
            <SidebarLinkList
              items={[navigationItem('/follow', t('follow'))]}
              pathname={props.pathname}
              locale={locale}
              onNavigate={onNavigate}
            />
          </SidebarSection>
        )}
        {buildUrl && (
          <SidebarSection label={t('source')}>
            <SidebarAction
              component="a"
              href={buildUrl}
              target="_blank"
              rel="noopener noreferrer"
              icon={<Icon name="evolution" size={14} />}
              label={`build ${buildSha}`}
              endIcon={<Icon name="external" size={12} />}
            />
          </SidebarSection>
        )}
      </Stack>
    </Box>
  );
}

function SidebarSection(props: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
        {props.label}
      </Typography>
      <Stack sx={{ gap: 'var(--site-space-2)' }}>{props.children}</Stack>
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
          <Link component={LocaleLink} href="/" underline="none" color="text.primary" sx={{ fontFamily: 'var(--site-font-logo)' }}>
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
