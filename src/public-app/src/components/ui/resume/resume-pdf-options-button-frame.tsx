import type { ButtonProps } from '../button';
import { Button } from '../button';

type ResumePdfOptionsButtonFrameProps = Pick<
  ButtonProps,
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-label'
  | 'children'
  | 'onClick'
  | 'siteVariant'
  | 'variant'
>;

export function ResumePdfOptionsButtonFrame(props: ResumePdfOptionsButtonFrameProps) {
  return <Button {...props} sx={{ paddingInline: 'var(--site-space-2)' }} />;
}
