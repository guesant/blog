import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';

type ProtectedEmailVariantRendererProps = {
  button: ReactNode;
  inline: ReactNode;
  sidebar: ReactNode;
  variant: 'button' | 'inline' | 'sidebar';
};

export function ProtectedEmailVariantRenderer(props: ProtectedEmailVariantRendererProps) {
  return (
    <>
      <ConditionalContent condition={props.variant === 'button'}>{props.button}</ConditionalContent>
      <ConditionalContent condition={props.variant === 'sidebar'}>
        {props.sidebar}
      </ConditionalContent>
      <ConditionalContent condition={props.variant === 'inline'}>{props.inline}</ConditionalContent>
    </>
  );
}
