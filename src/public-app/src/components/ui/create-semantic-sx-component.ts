import { createElement, type ComponentType, type CSSProperties } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from './sx';

type SemanticStyleProps = {
  sx?: SxProps<Theme>;
  style?: CSSProperties;
};

export function createSemanticSxComponent<Props extends SemanticStyleProps>(
  BaseComponent: ComponentType<Props>,
  baseStyles: SxProps<Theme>,
) {
  type SemanticProps = Omit<Props, 'sx' | 'style'> & SemanticStyleProps;

  return function SemanticComponent(props: SemanticProps) {
    return createElement(BaseComponent, {
      ...(props as Props),
      sx: mergeSx(baseStyles, props.sx),
    });
  };
}
