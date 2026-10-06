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
  display: 'block',
  '& > svg': {
    display: 'inline-block',
    marginInlineEnd: 'var(--site-space-2)',
    verticalAlign: 'middle',
  },
  '& a': {
    ...titleLinkStyles,
    display: 'inline',
    overflowWrap: 'anywhere',
    whiteSpace: 'normal',
  },
};
