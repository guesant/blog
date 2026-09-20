import { createElement, type SVGProps } from 'react';

type SvgElementProps = SVGProps<SVGElement> & {
  component: keyof SVGElementTagNameMap;
};

export function SvgElement(props: SvgElementProps) {
  const { component, ...elementProps } = props;

  return createElement(component, elementProps);
}
