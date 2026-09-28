import type { SxProps, Theme } from '@mui/material/styles';

const justifiedText = {
  textAlign: 'justify',
  hyphens: 'auto',
};

const homeReadingText = {
  display: 'block',
  width: '100%',
  maxWidth: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box',
  ...justifiedText,
};

export const typographyVariants3: Record<string, SxProps<Theme>> = {
  contentFeedStatus: { textAlign: 'center' },
  homeIntro: {
    ...homeReadingText,
    margin: 0,
    fontFamily: 'var(--site-font-action)',
    fontSize: 'var(--site-text-lg)',
    fontWeight: 'var(--site-weight-medium)',
    lineHeight: 'var(--site-leading-relaxed)',
    color: 'text.secondary',
  },
  homeHeroTitle: {
    margin: 0,
    width: '100%',
    fontSize: 'var(--site-text-3xl)',
  },
  metricItem: { fontWeight: 700 },
  connectionsSection: {
    margin: 0,
    fontSize: 'var(--site-text-2xl)',
    fontWeight: 'var(--site-weight-bold)',
    letterSpacing: 'var(--site-letter-heading)',
    lineHeight: 'var(--site-leading-tight)',
  },
  connectionGroup: {
    marginBottom: 'var(--site-space-2)',
    color: 'var(--site-text-secondary)',
    fontSize: 'var(--site-text-sm)',
    fontWeight: 'var(--site-weight-semibold)',
    textTransform: 'capitalize',
  },
  sourcePreviewListMetadataItem: {
    minWidth: 0,
    maxWidth: '100%',
    color: 'var(--site-text-secondary)',
    fontSize: 'var(--site-text-xs)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sourcePreviewListMetadataItemIdentifier: {
    display: 'block',
    minWidth: 0,
    maxWidth: '100%',
    color: 'var(--site-text-secondary)',
    fontSize: 'var(--site-text-xs)',
    overflowWrap: 'anywhere',
    whiteSpace: 'normal',
  },
  caseIllustration: {
    position: 'absolute',
    zIndex: 1,
    right: '1rem',
    bottom: '0.75rem',
    color: 'text.disabled',
  },
  breadcrumbTrailItem: { px: 'var(--site-action-px)', py: 'var(--site-action-py)' },
};
