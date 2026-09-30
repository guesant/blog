const editorialTextBase = {
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  fontFamily: 'var(--site-font-family)',
};

const editorialHeadingBase = {
  ...editorialTextBase,
  margin: 0,
  color: 'var(--site-text-primary)',
  fontWeight: 'var(--site-weight-bold)',
  letterSpacing: 'var(--site-letter-heading)',
  lineHeight: 'var(--site-leading-tight)',
  textAlign: 'left',
};

export const editorialPageTitleStyles = {
  ...editorialHeadingBase,
  fontSize: 'var(--site-text-2xl)',
};

export const editorialSectionTitleStyles = {
  ...editorialHeadingBase,
  fontSize: 'var(--site-text-xl)',
};

export const editorialSubsectionTitleStyles = {
  ...editorialHeadingBase,
  fontSize: 'var(--site-text-lg)',
};

export const editorialSubtitleStyles = {
  ...editorialTextBase,
  margin: 0,
  color: 'var(--site-text-secondary)',
  fontSize: 'var(--site-text-body)',
  lineHeight: 'var(--site-leading-relaxed)',
  textAlign: 'left',
};

export const editorialDescriptionStyles = {
  ...editorialSubtitleStyles,
  textAlign: 'justify',
  hyphens: 'auto',
};

export const editorialBodyStyles = {
  ...editorialTextBase,
  color: 'var(--site-text-primary)',
  fontSize: 'var(--site-text-body)',
  fontWeight: 'var(--site-weight-regular)',
  lineHeight: 'var(--site-leading-relaxed)',
  textAlign: 'justify',
  hyphens: 'auto',
};
