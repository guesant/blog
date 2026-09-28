import type { SxProps, Theme } from '@mui/material/styles';

const explorationTileGrid: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 'var(--site-space-3)',
  mt: 'var(--site-space-4)',
  '& > *, & [data-exploration-item]': {
    flex: {
      xs: '0 0 calc((100% - var(--site-space-3)) / 2)',
      sm: '0 0 calc((100% - (var(--site-space-3) * 3)) / 4)',
    },
    minWidth: 0,
  },
};

export const boxVariants6: Record<string, SxProps<Theme>> = {
  contentFeedFilters: {
    display: 'flex',
    alignItems: 'stretch',
    gap: 'var(--site-space-2)',
    width: '100%',
    minWidth: 0,
    flex: '1 1 100%',
  },
  detailArticle: {
    paddingBlockStart: 0,
    paddingBlockEnd: { xs: 8, md: 10 },
    maxWidth: '52rem',
    mx: 'auto',
  },
  explorationTileGrid,
  connectionsSection: {
    display: 'grid',
    gap: 'var(--site-space-4)',
    padding: 'var(--site-space-6)',
    borderRadius: 0,
    backgroundColor: 'var(--site-surface)',
  },
  connectionsSection2: { display: 'flex', flexDirection: 'column', gap: 'var(--site-space-4)' },
  connectionGroup: { display: 'flex', flexWrap: 'wrap', gap: 'var(--site-space-2)' },
  homeHeroSurface: {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    pt: 0,
    pb: 'var(--site-space-8)',
  },
  homeHeroSurfaceWithContact: {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    pt: 0,
    pb: 0,
  },
  homeHeroContent: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    rowGap: 'var(--site-space-6)',
    width: '100%',
    textAlign: 'center',
  },
  homeHeroActions: { ...explorationTileGrid, mt: 0 },
  sourcePreviewListGroup: { display: 'grid', gap: 'var(--site-space-2)' },
  sourcePreviewListMetadata: { display: 'flex', flexWrap: 'wrap', gap: 'var(--site-space-1)' },
  sourcePreviewListItemFallback: {
    display: 'grid',
    placeItems: 'center',
    height: '100%',
    minHeight: 'var(--site-space-12)',
    color: 'var(--site-primary)',
  },
  sourcePreviewListItemMedia: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  technologyMarquee: { mt: 5 },
  technologyMarquee2: { mt: 2, display: 'grid', gap: 1.5 },
};
