import { Divider } from '../divider';

const dividerStyles = {
  width: '100%',
  borderColor: 'var(--site-border)',
  borderStyle: 'dotted',
  borderWidth: 'var(--site-border-width) 0 0',
};

export function EditorialFeedItemDivider() {
  return <Divider sx={dividerStyles} />;
}
