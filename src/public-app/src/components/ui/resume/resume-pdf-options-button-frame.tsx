import type { ButtonProps } from '../button';
import { ActionIconButton } from '../semantic/ActionIconButton';

type ResumePdfOptionsButtonFrameProps = Pick<
  ButtonProps,
  'aria-expanded' | 'aria-haspopup' | 'aria-label' | 'children' | 'onClick' | 'variant'
>;

export function ResumePdfOptionsButtonFrame(props: ResumePdfOptionsButtonFrameProps) {
  return <ActionIconButton {...props} sx={{ paddingInline: 'var(--site-space-2)' }} />;
}
