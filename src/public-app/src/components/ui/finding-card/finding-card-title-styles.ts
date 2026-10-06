const titleBaseStyles = {
  margin: 0,
  width: '100%',
  color: 'var(--site-text-primary)',
  fontWeight: 'var(--site-weight-bold)',
  letterSpacing: 'var(--site-letter-heading)',
  lineHeight: 'var(--site-leading-tight)',
  textAlign: 'left',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  transition: 'color .2s',
};

const titleLinkStyles = {
  color: 'var(--site-primary)',
  minWidth: 0,
};

export const findingCardTitleStyles = {
  ...titleBaseStyles,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  '& a': titleLinkStyles,
};

export const findingCardTitleWithLeadingIconStyles = {
  ...titleBaseStyles,
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  columnGap: 'var(--site-space-2)',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  '& a': {
    ...titleLinkStyles,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
