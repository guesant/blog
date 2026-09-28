import type { ComponentProps } from 'react';
import { ActionButton } from './ActionButton';
import { mergeSx } from '@/components/ui/sx';

type SourcePreviewOpenActionButtonProps = ComponentProps<typeof ActionButton>;

export function SourcePreviewOpenActionButton(props: SourcePreviewOpenActionButtonProps) {
  const Component = ActionButton;

  return <Component {...props} sx={mergeSx({ justifySelf: 'start' }, props.sx)} />;
}
